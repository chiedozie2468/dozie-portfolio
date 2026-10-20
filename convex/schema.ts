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
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
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

  siteSettings: defineTable({
    key: v.literal("main"),
    heroDisplayWord: v.string(),
    dpImageUrl: v.string(),
    dpStorageId: v.optional(v.id("_storage")),
    dpCategory: v.string(),
    dpTitle: v.string(),
    dpSubtitle: v.string(),
    secondaryImageUrl: v.string(),
    secondaryStorageId: v.optional(v.id("_storage")),
    secondaryCategory: v.string(),
    secondaryTitle: v.string(),
    secondarySubtitle: v.string(),
    cvUrl: v.optional(v.string()),
    cvStorageId: v.optional(v.id("_storage")),
    cvFileName: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
