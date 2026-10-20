import { mutation, query } from "./_generated/server";
import { INITIAL_CAPABILITIES, INITIAL_PROJECTS } from "../lib/portfolio-data";

/**
 * Fetch published projects and engineering capabilities for the portfolio.
 * If the database has not been seeded yet, returns empty arrays so the client
 * can seamlessly fall back to INITIAL_PROJECTS / INITIAL_CAPABILITIES.
 */
export const getPortfolioData = query({
  args: {},
  handler: async (ctx) => {
    const [projects, capabilities] = await Promise.all([
      ctx.db.query("projects").withIndex("by_order").collect(),
      ctx.db.query("capabilities").withIndex("by_order").collect(),
    ]);

    return {
      projects,
      capabilities,
      deploymentStatus: "connected" as const,
      timestamp: Date.now(),
    };
  },
});

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_order").collect();
  },
});

/**
 * Non-destructive, idempotent seed function.
 * Preserves all existing documents and only inserts missing projects/capabilities by slug.
 */
export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    let insertedProjects = 0;
    let insertedCapabilities = 0;
    const now = Date.now();

    for (const project of INITIAL_PROJECTS) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .unique();

      if (!existing) {
        await ctx.db.insert("projects", {
          ...project,
          updatedAt: now,
        });
        insertedProjects += 1;
      }
    }

    for (const capability of INITIAL_CAPABILITIES) {
      const existing = await ctx.db
        .query("capabilities")
        .withIndex("by_slug", (q) => q.eq("slug", capability.slug))
        .unique();

      if (!existing) {
        await ctx.db.insert("capabilities", capability);
        insertedCapabilities += 1;
      }
    }

    return {
      insertedProjects,
      insertedCapabilities,
      preservedExisting: true,
    };
  },
});
