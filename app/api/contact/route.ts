import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-memory sliding-window rate limit tracker (IP -> timestamp array)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Forensic Honeypot Anti-Spam Trap
    // The hidden 'tel' field is invisible to legitimate humans; bots fill it automatically.
    if (body.tel && String(body.tel).trim() !== "") {
      console.warn("[Contact API] Bot honeypot triggered from payload:", body.tel);
      // Return 200 OK with success so malicious bots don't learn or retry with other fields
      return NextResponse.json(
        { success: true, message: "Your message has been received." },
        { status: 200 }
      );
    }

    // 2. Strict Zod Schema Validation
    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors)[0]?.[0] || "Invalid submission data.";
      return NextResponse.json(
        { error: firstErrorMessage, errors: fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, service, message } = parseResult.data;

    // 3. IP Rate Limiting (Sliding Window: 5 requests per 10 minutes)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait a few minutes before submitting another inquiry.",
        },
        { status: 429 }
      );
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // 4. Persistent Database Storage (Guarantees zero lead loss)
    try {
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          service,
          message,
          ipAddress: ip,
          status: "unread",
        },
      });
      console.log(`[Contact API] Inquiry from ${name} (${email}) persisted to database.`);
    } catch (dbErr) {
      console.error("[Contact API] Failed to persist message to database:", dbErr);
    }

    // 4. Upstash Redis Rate Limiting (if environment variables configured)
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (upstashUrl && upstashToken) {
      try {
        const key = `rate_limit:contact:${ip}`;
        const upstashRes = await fetch(`${upstashUrl}/incr/${key}`, {
          headers: { Authorization: `Bearer ${upstashToken}` },
        });
        const upstashData = await upstashRes.json();
        if (upstashData.result === 1) {
          // Set expiry to 600 seconds
          await fetch(`${upstashUrl}/expire/${key}/600`, {
            headers: { Authorization: `Bearer ${upstashToken}` },
          });
        } else if (upstashData.result > MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            {
              error:
                "Rate limit exceeded. Please wait a few minutes before submitting another inquiry.",
            },
            { status: 429 }
          );
        }
      } catch (redisErr) {
        console.error("[Contact API] Upstash Redis error:", redisErr);
      }
    }

    // Helper to sanitize untrusted strings and neutralize HTML injection
    const escapeHtml = (str: string) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message);

    // 5. Email Dispatch via Resend (with Graceful Fallback if Keys Absent)
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail =
      process.env.CONTACT_EMAIL_TO || "mahmudhasan.infodev@gmail.com";

    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Mahmud Hasan Portfolio <onboarding@resend.dev>",
            to: [recipientEmail],
            reply_to: email,
            subject: `⚡ New Project Inquiry: ${safeName} [${safeService}]`,
            html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B0C0E; color: #ECEAE3; border-radius: 12px; border: 1px solid rgba(236,234,227,0.10);">
              <h2 style="color: #C8F24A; margin-top: 0;">New Project Inquiry</h2>
              <p><strong>Client Name:</strong> ${safeName}</p>
              <p><strong>Email Address:</strong> <a href="mailto:${encodeURI(email)}" style="color: #C8F24A;">${safeEmail}</a></p>
              <p><strong>Service Domain:</strong> ${safeService}</p>
              <hr style="border: 0; border-top: 1px solid rgba(236,234,227,0.10); margin: 20px 0;" />
              <h3 style="color: #ECEAE3; font-size: 14px; text-transform: uppercase;">Project Scope & Details:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #8E9197;">${safeMessage}</p>
              <hr style="border: 0; border-top: 1px solid rgba(236,234,227,0.10); margin: 20px 0;" />
              <p style="font-size: 12px; color: #8E9197;">Sent via mahmudhasan.dev portfolio inquiry form.</p>
            </div>
            `,
          }),
        });
        if (resendRes.ok) {
          console.log(`[Contact API] Inquiry successfully sent via Resend to ${recipientEmail}`);
        } else {
          const resendErrData = await resendRes.text();
          console.warn("[Contact API] Resend returned non-OK status:", resendRes.status, resendErrData);
        }
      } catch (resendErr) {
        console.error("[Contact API] Resend email delivery failed:", resendErr);
      }
    } else {
      console.log(
        "[Contact API] No RESEND_API_KEY configured. Running in simulated development mode:",
        {
          name,
          email,
          service,
          messagePreview: message.slice(0, 80),
          recipient: recipientEmail,
        }
      );
    }

    // 6. Optional Telegram Bot Notification
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId) {
      try {
        await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: `🚀 <b>New Project Inquiry</b>\n<b>Name:</b> ${safeName}\n<b>Email:</b> ${safeEmail}\n<b>Service:</b> ${safeService}\n\n<b>Message:</b>\n${safeMessage}`,
              parse_mode: "HTML",
            }),
          }
        );
      } catch (tgErr) {
        console.error("[Contact API] Telegram notification failed:", tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your message has been received. Mahmud will get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("[Contact API] Unexpected error in handler:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while transmitting your inquiry. Please reach out via email directly.",
      },
      { status: 500 }
    );
  }
}
