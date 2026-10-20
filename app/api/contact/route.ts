import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { api } from "@/convex/_generated/api";
import { contactFormSchema } from "@/lib/validations/contact";

const DEFAULT_CONVEX_URL =
  "https://optimistic-bulldog-318.eu-west-1.convex.cloud";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = contactFormSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Invalid form input.",
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot check for bots
    if (data.honeypot && data.honeypot.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        delivery: "filtered",
        storedAt: Date.now(),
      });
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || DEFAULT_CONVEX_URL;
    const convex = new ConvexHttpClient(convexUrl);

    let convexPersisted = false;
    let convexRecordId: string | null = null;

    try {
      const mutationResult = await convex.mutation(api.messages.submit, {
        name: data.name,
        email: data.email,
        subject: data.subject,
        projectType: data.projectType || "General Inquiry",
        message: data.message,
        honeypot: data.honeypot,
      });
      convexPersisted = Boolean(mutationResult?.ok);
      convexRecordId = mutationResult?.id ? String(mutationResult.id) : null;
    } catch (convexErr) {
      const message =
        convexErr instanceof Error ? convexErr.message : String(convexErr);

      // If the Convex mutation threw a user-facing validation or rate-limit error, propagate it
      if (
        message.includes("Too many messages") ||
        message.includes("must be between") ||
        message.includes("valid email")
      ) {
        return NextResponse.json(
          { ok: false, error: message },
          { status: 429 }
        );
      }
      // Otherwise, the deployment `optimistic-bulldog-318` is reachable but awaiting initial function push
      convexPersisted = false;
    }

    // Optional SMTP email dispatch if credentials are provided in .env.local
    let emailSent = false;
    if (
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.CONTACT_FORM_RECIPIENT
    ) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_FORM_RECIPIENT,
          replyTo: data.email,
          subject: `[Portfolio] ${data.subject} — from ${data.name}`,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Project Type: ${data.projectType || "General Inquiry"}`,
            `Subject: ${data.subject}`,
            "",
            data.message,
          ].join("\n"),
        });
        emailSent = true;
      } catch {
        emailSent = false;
      }
    }

    return NextResponse.json({
      ok: true,
      convexPersisted,
      convexRecordId,
      emailSent,
      deployment: "optimistic-bulldog-318",
      storedAt: Date.now(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to process your message right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
