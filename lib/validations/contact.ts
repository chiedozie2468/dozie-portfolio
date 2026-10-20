import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(120, "Name must be 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  subject: z
    .string()
    .trim()
    .min(3, "Please enter a brief subject (at least 3 characters).")
    .max(160, "Subject must be 160 characters or fewer."),
  projectType: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few details (at least 10 characters).")
    .max(4000, "Message must be 4,000 characters or fewer."),
  honeypot: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
