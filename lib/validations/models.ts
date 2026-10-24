import { z } from "zod";

// 1. Site Settings Validation
export const siteSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  tagline: z.string().min(1, "Tagline is required").max(300),
  location: z.string().min(1).max(100),
  timeZone: z.string().min(1).max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5).max(30),
  whatsapp: z.string().url("Must be a valid WhatsApp URL"),
  telegram: z.string().url("Must be a valid Telegram URL"),
  github: z.string().url("Must be a valid GitHub URL"),
  linkedin: z.string().url("Must be a valid LinkedIn URL"),
  seoDescription: z.string().min(10).max(500),
  seoKeywords: z.string().min(3).max(500),
  ogImageUrl: z.string().min(1),
});

// 2. Hero Section Validation
export const heroSchema = z.object({
  badgeEn: z.string().min(1).max(100),
  badgeBn: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  dash: z.string().default("—"),
  introEn: z.string().min(10).max(600),
  introBn: z.string().min(10).max(600),
  positioningEn: z.string().min(10).max(600),
  positioningBn: z.string().min(10).max(600),
  availableBadgeEn: z.string().min(1).max(100),
  availableBadgeBn: z.string().min(1).max(100),
  roles: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val) ? JSON.stringify(val) : val
  ),
});

// 3. About Section Validation
export const aboutSchema = z.object({
  heroHeadlineEn: z.string().min(5).max(300),
  heroHeadlineBn: z.string().min(5).max(300),
  storyP1En: z.string().min(10).max(1000),
  storyP1Bn: z.string().min(10).max(1000),
  storyP2En: z.string().min(10).max(1000),
  storyP2Bn: z.string().min(10).max(1000),
  storyP3En: z.string().min(10).max(1000),
  storyP3Bn: z.string().min(10).max(1000),
  avatarUrl: z.string().min(1),
  cvUrl: z.string().min(1),
  locationEn: z.string().min(1),
  locationBn: z.string().min(1),
});

// 4. Skill Validation
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name required").max(100),
  category: z.string().min(1, "Category is required"),
  level: z.string().optional().default("Expert"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

// 5. Project Validation
export const projectSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(2).max(150),
  subtitle: z.string().min(2).max(250),
  year: z.string().min(4).max(10),
  category: z.string().min(2).max(100),
  filterCategory: z.enum(["all", "web", "android", "automation"]).default("all"),
  summary: z.string().min(10).max(1000),
  problem: z.string().min(10).max(2000),
  solution: z.string().min(10).max(2000),
  result: z.string().max(1000).optional().nullable(),
  stack: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val) ? JSON.stringify(val) : val
  ),
  highlights: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val) ? JSON.stringify(val) : val
  ),
  role: z.string().default("Lead Architect"),
  status: z.string().default("Production"),
  metrics: z.string().min(1).max(200),
  coverImage: z.string().min(1),
  mockupType: z.enum(["browser", "mobile", "terminal"]).default("browser"),
  demoUrl: z.string().url().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

// 6. Service Validation
export const serviceSchema = z.object({
  titleEn: z.string().min(2).max(150),
  titleBn: z.string().min(2).max(150),
  descriptionEn: z.string().min(10).max(1000),
  descriptionBn: z.string().min(10).max(1000),
  deliverables: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val) ? JSON.stringify(val) : val
  ),
  icon: z.string().default("Code"),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

// 7. Testimonial Validation
export const testimonialSchema = z.object({
  author: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  quoteEn: z.string().min(10).max(1000),
  quoteBn: z.string().min(10).max(1000),
  avatarUrl: z.string().optional().nullable(),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

// 8. Experience Validation
export const experienceSchema = z.object({
  period: z.string().min(2).max(50),
  roleEn: z.string().min(2).max(150),
  roleBn: z.string().min(2).max(150),
  company: z.string().min(2).max(150),
  location: z.string().default("Dhaka, Bangladesh"),
  descriptionEn: z.string().min(10).max(1000),
  descriptionBn: z.string().min(10).max(1000),
  technologies: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val) ? JSON.stringify(val) : val
  ),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

// 9. Contact Message Status Validation
export const contactMessageStatusSchema = z.object({
  status: z.enum(["unread", "read", "replied", "archived"]),
});
