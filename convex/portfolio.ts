import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_CAPABILITIES,
  INITIAL_PROJECTS,
} from "../lib/portfolio-data";

const ALLOWED_ADMIN_EMAIL = "onyekwelochiedozie1@gmail.com";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateRandomHex(byteLength = 24): string {
  const arr = new Uint8Array(byteLength);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function assertValidAdminToken(
  ctx: QueryCtx | MutationCtx,
  adminToken?: string
) {
  const adminRecord = await ctx.db
    .query("adminAuth")
    .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
    .unique();

  // If the admin account has been configured, require a valid unexpired session token
  if (adminRecord) {
    if (!adminToken) {
      throw new Error("Unauthorized: Please sign in to the Admin Dashboard.");
    }
    const now = Date.now();
    const validSession = adminRecord.sessionTokens.some(
      (s) => s.token === adminToken && s.expiresAt > now
    );
    if (!validSession) {
      throw new Error("Session expired or invalid. Please sign in again.");
    }
  }
}

/**
 * Check whether the admin password has been created yet (never exposes the email).
 */
export const getAdminAuthStatus = query({
  args: {},
  handler: async (ctx) => {
    const adminRecord = await ctx.db
      .query("adminAuth")
      .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
      .unique();
    return {
      isConfigured: Boolean(adminRecord),
    };
  },
});

/**
 * Verify an existing session token stored in the browser.
 */
export const verifyAdminSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const adminRecord = await ctx.db
      .query("adminAuth")
      .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
      .unique();

    if (!adminRecord) {
      return { valid: false, isConfigured: false };
    }

    const now = Date.now();
    const isValid = adminRecord.sessionTokens.some(
      (s) => s.token === args.token && s.expiresAt > now
    );

    return {
      valid: isValid,
      isConfigured: true,
      email: isValid ? adminRecord.email : undefined,
    };
  },
});

/**
 * First-time Admin Setup: only allows onyekwelochiedozie1@gmail.com to create and confirm a password.
 */
export const setupAdminAccount = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    confirmPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      throw new Error("Unauthorized email address.");
    }

    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords do not match. Please confirm your password.");
    }

    const existing = await ctx.db
      .query("adminAuth")
      .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
      .unique();

    if (existing) {
      throw new Error(
        "Admin password is already created. Please switch to Sign In."
      );
    }

    const now = Date.now();
    const salt = generateRandomHex(16);
    const passwordHash = await sha256Hex(`${salt}:${args.password}`);
    const token = generateRandomHex(32);

    await ctx.db.insert("adminAuth", {
      email: ALLOWED_ADMIN_EMAIL,
      passwordHash,
      salt,
      sessionTokens: [{ token, expiresAt: now + SESSION_DURATION_MS }],
      updatedAt: now,
    });

    return {
      token,
      email: ALLOWED_ADMIN_EMAIL,
    };
  },
});

/**
 * Sign in with onyekwelochiedozie1@gmail.com and password.
 */
export const loginAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      throw new Error("Invalid email or password.");
    }

    const adminRecord = await ctx.db
      .query("adminAuth")
      .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
      .unique();

    if (!adminRecord) {
      throw new Error(
        "Admin password has not been created yet. Use 'Create Password' first."
      );
    }

    const candidateHash = await sha256Hex(
      `${adminRecord.salt}:${args.password}`
    );
    if (candidateHash !== adminRecord.passwordHash) {
      throw new Error("Invalid email or password.");
    }

    const now = Date.now();
    const token = generateRandomHex(32);
    const activeTokens = adminRecord.sessionTokens
      .filter((s) => s.expiresAt > now)
      .slice(-9);

    await ctx.db.patch(adminRecord._id, {
      sessionTokens: [
        ...activeTokens,
        { token, expiresAt: now + SESSION_DURATION_MS },
      ],
      updatedAt: now,
    });

    return {
      token,
      email: adminRecord.email,
    };
  },
});

/**
 * Sign out and invalidate the current session token.
 */
export const logoutAdmin = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const adminRecord = await ctx.db
      .query("adminAuth")
      .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
      .unique();

    if (adminRecord) {
      await ctx.db.patch(adminRecord._id, {
        sessionTokens: adminRecord.sessionTokens.filter(
          (s) => s.token !== args.token
        ),
        updatedAt: Date.now(),
      });
    }
    return { loggedOut: true };
  },
});

/**
 * Change admin password while signed in.
 */
export const changeAdminPassword = mutation({
  args: {
    adminToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
    confirmPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);

    if (args.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }
    if (args.newPassword !== args.confirmPassword) {
      throw new Error("New password and confirmation do not match.");
    }

    const adminRecord = await ctx.db
      .query("adminAuth")
      .withIndex("by_email", (q) => q.eq("email", ALLOWED_ADMIN_EMAIL))
      .unique();

    if (!adminRecord) {
      throw new Error("Admin account not found.");
    }

    const currentHash = await sha256Hex(
      `${adminRecord.salt}:${args.currentPassword}`
    );
    if (currentHash !== adminRecord.passwordHash) {
      throw new Error("Current password is incorrect.");
    }

    const newSalt = generateRandomHex(16);
    const newPasswordHash = await sha256Hex(`${newSalt}:${args.newPassword}`);

    await ctx.db.patch(adminRecord._id, {
      salt: newSalt,
      passwordHash: newPasswordHash,
      updatedAt: Date.now(),
    });

    return { updated: true };
  },
});

/**
 * Fetch published projects, engineering capabilities, and hero/DP/CV site settings.
 */
export const getPortfolioData = query({
  args: {},
  handler: async (ctx) => {
    const [rawProjects, capabilities, rawSettings] = await Promise.all([
      ctx.db.query("projects").withIndex("by_order").collect(),
      ctx.db.query("capabilities").withIndex("by_order").collect(),
      ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", "main"))
        .unique(),
    ]);

    const projects = await Promise.all(
      rawProjects.map(async (proj) => {
        const resolvedImage = proj.imageStorageId
          ? await ctx.storage.getUrl(proj.imageStorageId)
          : null;
        return {
          ...proj,
          imageUrl: resolvedImage ?? proj.imageUrl,
        };
      })
    );

    let siteSettings = DEFAULT_SITE_SETTINGS;
    if (rawSettings) {
      const resolvedDpUrl = rawSettings.dpStorageId
        ? await ctx.storage.getUrl(rawSettings.dpStorageId)
        : null;
      const resolvedSecondaryUrl = rawSettings.secondaryStorageId
        ? await ctx.storage.getUrl(rawSettings.secondaryStorageId)
        : null;
      const resolvedCvUrl = rawSettings.cvStorageId
        ? await ctx.storage.getUrl(rawSettings.cvStorageId)
        : null;
      const resolvedEducationUrl = rawSettings.educationStorageId
        ? await ctx.storage.getUrl(rawSettings.educationStorageId)
        : null;

      siteSettings = {
        heroDisplayWord: rawSettings.heroDisplayWord,
        dpImageUrl: resolvedDpUrl ?? rawSettings.dpImageUrl,
        dpCategory: rawSettings.dpCategory,
        dpTitle: rawSettings.dpTitle,
        dpSubtitle: rawSettings.dpSubtitle,
        secondaryImageUrl: resolvedSecondaryUrl ?? rawSettings.secondaryImageUrl,
        secondaryCategory: rawSettings.secondaryCategory,
        secondaryTitle: rawSettings.secondaryTitle,
        secondarySubtitle: rawSettings.secondarySubtitle,
        cvUrl: resolvedCvUrl ?? rawSettings.cvUrl ?? DEFAULT_SITE_SETTINGS.cvUrl,
        cvFileName:
          rawSettings.cvFileName ?? DEFAULT_SITE_SETTINGS.cvFileName,
        educationImageUrl:
          resolvedEducationUrl ??
          rawSettings.educationImageUrl ??
          DEFAULT_SITE_SETTINGS.educationImageUrl,
        educationCaption:
          rawSettings.educationCaption ??
          DEFAULT_SITE_SETTINGS.educationCaption,
        updatedAt: rawSettings.updatedAt,
      };
    }

    return {
      projects,
      capabilities,
      siteSettings,
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

export const listMessages = query({
  args: { adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    return await ctx.db
      .query("messages")
      .withIndex("by_created_at")
      .order("desc")
      .take(100);
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("messages"), adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});

/**
 * Generate a short-lived Convex Storage upload URL for uploading a DP photo,
 * project cover image, or CV PDF directly from the dashboard.
 */
export const generateUploadUrl = mutation({
  args: { adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Update the hero DP image (or remove it), editorial card, CV file, and display typography.
 */
export const updateSiteSettings = mutation({
  args: {
    adminToken: v.optional(v.string()),
    heroDisplayWord: v.optional(v.string()),
    dpImageUrl: v.optional(v.string()),
    dpStorageId: v.optional(v.id("_storage")),
    clearDpStorageId: v.optional(v.boolean()),
    removeDp: v.optional(v.boolean()),
    dpCategory: v.optional(v.string()),
    dpTitle: v.optional(v.string()),
    dpSubtitle: v.optional(v.string()),
    secondaryImageUrl: v.optional(v.string()),
    secondaryStorageId: v.optional(v.id("_storage")),
    clearSecondaryStorageId: v.optional(v.boolean()),
    removeSecondary: v.optional(v.boolean()),
    secondaryCategory: v.optional(v.string()),
    secondaryTitle: v.optional(v.string()),
    secondarySubtitle: v.optional(v.string()),
    cvUrl: v.optional(v.string()),
    cvStorageId: v.optional(v.id("_storage")),
    cvFileName: v.optional(v.string()),
    removeCv: v.optional(v.boolean()),
    educationImageUrl: v.optional(v.string()),
    educationStorageId: v.optional(v.id("_storage")),
    clearEducationStorageId: v.optional(v.boolean()),
    removeEducation: v.optional(v.boolean()),
    educationCaption: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactWhatsapp: v.optional(v.string()),
    contactAddress: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    const now = Date.now();
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();

    // DP image resolution
    let nextDpStorageId =
      args.clearDpStorageId || args.removeDp
        ? undefined
        : (args.dpStorageId ?? existing?.dpStorageId);

    let resolvedDpUrl =
      args.dpImageUrl !== undefined
        ? args.dpImageUrl
        : (existing?.dpImageUrl ?? DEFAULT_SITE_SETTINGS.dpImageUrl);

    if (args.removeDp) {
      resolvedDpUrl = "";
      nextDpStorageId = undefined;
    } else if (args.dpStorageId) {
      const url = await ctx.storage.getUrl(args.dpStorageId);
      if (url) resolvedDpUrl = url;
    }

    // Secondary editorial image resolution
    let nextSecondaryStorageId =
      args.clearSecondaryStorageId || args.removeSecondary
        ? undefined
        : (args.secondaryStorageId ?? existing?.secondaryStorageId);

    let resolvedSecondaryUrl =
      args.secondaryImageUrl !== undefined
        ? args.secondaryImageUrl
        : (existing?.secondaryImageUrl ??
          DEFAULT_SITE_SETTINGS.secondaryImageUrl);

    if (args.removeSecondary) {
      resolvedSecondaryUrl = "";
      nextSecondaryStorageId = undefined;
    } else if (args.secondaryStorageId) {
      const url = await ctx.storage.getUrl(args.secondaryStorageId);
      if (url) resolvedSecondaryUrl = url;
    }

    // CV resolution
    let nextCvStorageId = args.removeCv
      ? undefined
      : (args.cvStorageId ?? existing?.cvStorageId);

    let resolvedCvUrl =
      args.cvUrl !== undefined
        ? args.cvUrl
        : (existing?.cvUrl ?? DEFAULT_SITE_SETTINGS.cvUrl);

    let resolvedCvFileName =
      args.cvFileName !== undefined
        ? args.cvFileName
        : (existing?.cvFileName ?? DEFAULT_SITE_SETTINGS.cvFileName);

    if (args.removeCv) {
      resolvedCvUrl = DEFAULT_SITE_SETTINGS.cvUrl;
      resolvedCvFileName = DEFAULT_SITE_SETTINGS.cvFileName;
      nextCvStorageId = undefined;
    } else if (args.cvStorageId) {
      const url = await ctx.storage.getUrl(args.cvStorageId);
      if (url) resolvedCvUrl = url;
    }

    // Education photo resolution
    let nextEducationStorageId =
      args.clearEducationStorageId || args.removeEducation
        ? undefined
        : (args.educationStorageId ?? existing?.educationStorageId);

    let resolvedEducationUrl =
      args.educationImageUrl !== undefined
        ? args.educationImageUrl
        : (existing?.educationImageUrl ??
          DEFAULT_SITE_SETTINGS.educationImageUrl);

    if (args.removeEducation) {
      resolvedEducationUrl = "";
      nextEducationStorageId = undefined;
    } else if (args.educationStorageId) {
      const url = await ctx.storage.getUrl(args.educationStorageId);
      if (url) resolvedEducationUrl = url;
    }

    const payload = {
      key: "main" as const,
      heroDisplayWord:
        args.heroDisplayWord?.trim() ||
        existing?.heroDisplayWord ||
        DEFAULT_SITE_SETTINGS.heroDisplayWord,
      dpImageUrl: resolvedDpUrl,
      dpStorageId: nextDpStorageId,
      dpCategory:
        args.dpCategory?.trim() ||
        existing?.dpCategory ||
        DEFAULT_SITE_SETTINGS.dpCategory,
      dpTitle:
        args.dpTitle?.trim() ||
        existing?.dpTitle ||
        DEFAULT_SITE_SETTINGS.dpTitle,
      dpSubtitle:
        args.dpSubtitle?.trim() ||
        existing?.dpSubtitle ||
        DEFAULT_SITE_SETTINGS.dpSubtitle,
      secondaryImageUrl: resolvedSecondaryUrl,
      secondaryStorageId: nextSecondaryStorageId,
      secondaryCategory:
        args.secondaryCategory?.trim() ||
        existing?.secondaryCategory ||
        DEFAULT_SITE_SETTINGS.secondaryCategory,
      secondaryTitle:
        args.secondaryTitle?.trim() ||
        existing?.secondaryTitle ||
        DEFAULT_SITE_SETTINGS.secondaryTitle,
      secondarySubtitle:
        args.secondarySubtitle?.trim() ||
        existing?.secondarySubtitle ||
        DEFAULT_SITE_SETTINGS.secondarySubtitle,
      cvUrl: resolvedCvUrl,
      cvStorageId: nextCvStorageId,
      cvFileName: resolvedCvFileName,
      educationImageUrl: resolvedEducationUrl,
      educationStorageId: nextEducationStorageId,
      educationCaption:
        args.educationCaption?.trim() ||
        existing?.educationCaption ||
        DEFAULT_SITE_SETTINGS.educationCaption,
      contactPhone:
        args.contactPhone?.trim() ||
        existing?.contactPhone ||
        DEFAULT_SITE_SETTINGS.contactPhone,
      contactWhatsapp:
        args.contactWhatsapp?.trim() ||
        existing?.contactWhatsapp ||
        DEFAULT_SITE_SETTINGS.contactWhatsapp,
      contactAddress:
        args.contactAddress?.trim() ||
        existing?.contactAddress ||
        DEFAULT_SITE_SETTINGS.contactAddress,
      contactEmail:
        args.contactEmail?.trim() ||
        existing?.contactEmail ||
        DEFAULT_SITE_SETTINGS.contactEmail,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return { id: existing._id, ...payload };
    } else {
      const id = await ctx.db.insert("siteSettings", payload);
      return { id, ...payload };
    }
  },
});

/**
 * Create a new work/project or update an existing one from the Admin Dashboard.
 */
export const upsertProject = mutation({
  args: {
    adminToken: v.optional(v.string()),
    id: v.optional(v.id("projects")),
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
    removeImage: v.optional(v.boolean()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    const now = Date.now();
    const existingById = args.id ? await ctx.db.get(args.id) : null;
    const existingBySlug = !existingById
      ? await ctx.db
          .query("projects")
          .withIndex("by_slug", (q) => q.eq("slug", args.slug.trim()))
          .unique()
      : null;
    const existing = existingById ?? existingBySlug;

    let nextImageStorageId = args.removeImage
      ? undefined
      : (args.imageStorageId ?? existing?.imageStorageId);

    let resolvedImageUrl = args.removeImage
      ? undefined
      : (args.imageUrl ?? existing?.imageUrl);

    if (args.imageStorageId) {
      const url = await ctx.storage.getUrl(args.imageStorageId);
      if (url) resolvedImageUrl = url;
    }

    const payload = {
      slug: args.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-|-$/g, ""),
      title: args.title.trim(),
      subtitle: args.subtitle.trim(),
      category: args.category,
      year: args.year.trim() || new Date().getFullYear().toString(),
      status: args.status.trim() || "Production",
      summary: args.summary.trim(),
      problem: args.problem.trim() || args.summary.trim(),
      architecture: args.architecture.trim() || "Full-stack production architecture.",
      outcome: args.outcome.trim() || "Deployed and running in production.",
      metrics: args.metrics.filter((m) => m.trim().length > 0),
      stack: args.stack.filter((s) => s.trim().length > 0),
      imageUrl: resolvedImageUrl,
      imageStorageId: nextImageStorageId,
      liveUrl: args.liveUrl?.trim() || undefined,
      repoUrl: args.repoUrl?.trim() || undefined,
      themeColor: args.themeColor?.trim() || existing?.themeColor || "green",
      featured: args.featured,
      order: args.order,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return { id: existing._id, ...payload };
    } else {
      const id = await ctx.db.insert("projects", payload);
      return { id, ...payload };
    }
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects"), adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});

/**
 * Non-destructive, idempotent seed function.
 */
export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    let insertedProjects = 0;
    let insertedCapabilities = 0;
    let initializedSettings = false;
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
      } else {
        const legacyTitles = [
          "KollaTunez Tours & Ticketing Platform",
          "Followpoint — Client Follow-Up & Pipeline Workspace",
          "NogaData JSAP Central Administration Portal",
          "TechFasta — High-Velocity Digital Product & Content Platform",
        ];
        const needsTitleClean = legacyTitles.includes(existing.title);
        const needsLiveUrl = !existing.liveUrl && Boolean(project.liveUrl);
        if (needsTitleClean || needsLiveUrl) {
          await ctx.db.patch(existing._id, {
            ...(needsTitleClean ? { title: project.title } : {}),
            ...(needsLiveUrl ? { liveUrl: project.liveUrl } : {}),
            updatedAt: now,
          });
        }
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

    const existingSettings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();

    if (!existingSettings) {
      await ctx.db.insert("siteSettings", {
        key: "main",
        ...DEFAULT_SITE_SETTINGS,
        updatedAt: now,
      });
      initializedSettings = true;
    }

    return {
      insertedProjects,
      insertedCapabilities,
      initializedSettings,
      preservedExisting: true,
    };
  },
});
