import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validated contact form submission mutation.
 * Enforces field lengths, email format, honeypot check, and basic rate limiting
 * without exposing any visitor messages publicly.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    projectType: v.optional(v.string()),
    message: v.string(),
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Reject automated bot submissions filling the hidden honeypot field
    if (args.honeypot && args.honeypot.trim().length > 0) {
      return {
        ok: true,
        id: null,
        storedAt: Date.now(),
      };
    }

    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const subject = args.subject.trim();
    const projectType = args.projectType?.trim() || "General Inquiry";
    const message = args.message.trim();

    if (name.length < 2 || name.length > 120) {
      throw new ConvexError("Name must be between 2 and 120 characters.");
    }
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      throw new ConvexError("Please provide a valid email address.");
    }
    if (subject.length < 3 || subject.length > 160) {
      throw new ConvexError("Subject must be between 3 and 160 characters.");
    }
    if (message.length < 10 || message.length > 4000) {
      throw new ConvexError("Message must be between 10 and 4,000 characters.");
    }

    const now = Date.now();
    const oneMinuteAgo = now - 60_000;

    // Rate-limit check: prevent rapid duplicate submissions from the same email within 60s
    const recentFromSender = await ctx.db
      .query("messages")
      .withIndex("by_email_created", (q) =>
        q.eq("email", email).gte("createdAt", oneMinuteAgo)
      )
      .take(3);

    if (recentFromSender.length >= 3) {
      throw new ConvexError(
        "Too many messages sent recently. Please wait a minute before trying again."
      );
    }

    const id = await ctx.db.insert("messages", {
      name,
      email,
      subject,
      projectType,
      message,
      status: "new",
      source: "portfolio-contact-form",
      createdAt: now,
    });

    return {
      ok: true,
      id,
      storedAt: now,
    };
  },
});
