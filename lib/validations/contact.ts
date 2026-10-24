import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be less than 80 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),
  service: z
    .string()
    .trim()
    .min(2, "Please select or enter a service domain"),
  message: z
    .string()
    .trim()
    .min(10, "Please describe your project in at least 10 characters")
    .max(3000, "Message must be less than 3000 characters"),
  tel: z
    .string()
    .max(0, "Spam detected"), // Honeypot trap must remain empty
});

export type ContactFormData = z.infer<typeof contactSchema>;
