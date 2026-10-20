import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    title: v.string(),
    subtitle: v.string(),
    category: v.union(
      v.literal("Full-Stack"),
      v.literal("Platform"),
      v.literal("Commerce & Booking"),
      v.literal("Enterprise Portal")
    ),
    year: v.string(),
    status: v.string(),
    summary: v.string(),
    problem: v.string(),
    architecture: v.string(),
    outcome: v.string(),
    metrics: v.array(v.string()),
    stack: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"])
    .index("by_featured_order", ["featured", "order"]),

  capabilities: defineTable({
    slug: v.string(),
    title: v.string(),
    indexLabel: v.string(),
    summary: v.string(),
    deliverables: v.array(v.string()),
    technologies: v.array(v.string()),
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    projectType: v.optional(v.string()),
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("archived")
    ),
    source: v.string(),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_email_created", ["email", "createdAt"])
    .index("by_status", ["status"]),
});
