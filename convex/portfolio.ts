import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_CAPABILITIES,
  INITIAL_PROJECTS,
} from "../lib/portfolio-data";

const DEFAULT_ALLOWED_EMAIL_HASHES = [
  "be1b9922385afdb8b54500e11c913683d9e1ca6c74b699bb007d2373551157d8",
  "dca92296f11c4dff79054421ec62183902d7ac6bd7b8a94b413fb580794a0eee",
];
const DEFAULT_PASSWORD_SALT = "9f4a8c2e7b1d6f3a5e0c9b8a4d2f1e7c";
const DEFAULT_PASSWORD_HASH =
  "18d0df24f24b699e543cac26eae6a607a0ac189a7c71d4950e0609f7346f2ec2";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getAllowedEmailHashes(): string[] {
  const envHashes = process.env.ADMIN_EMAIL_HASHES;
  if (envHashes && envHashes.trim().length > 0) {
    return envHashes
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
  }
  return DEFAULT_ALLOWED_EMAIL_HASHES;
}

function getConfiguredPasswordSaltAndHash(): { salt: string; hash: string } {
  return {
    salt: process.env.ADMIN_PASSWORD_SALT || DEFAULT_PASSWORD_SALT,
    hash: process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH,
  };
}

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
  if (!adminToken || adminToken.trim().length < 32) {
    throw new Error("Unauthorized: Please sign in to the Admin Dashboard.");
  }

  const adminRecord = await ctx.db.query("adminAuth").first();
  if (!adminRecord) {
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

/**
 * Check whether the admin authentication guard is active (never exposes email or credentials).
 */
export const getAdminAuthStatus = query({
  args: {},
  handler: async () => {
    return {
      isConfigured: true,
    };
  },
});

/**
 * Verify an existing session token stored in the browser.
 * Never exposes email, passwordHash, salt, or sessionTokens.
 */
export const verifyAdminSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token || args.token.trim().length < 32) {
      return { valid: false, isConfigured: true };
    }

    const adminRecord = await ctx.db.query("adminAuth").first();
    if (!adminRecord) {
      return { valid: false, isConfigured: true };
    }

    const now = Date.now();
    const isValid = adminRecord.sessionTokens.some(
      (s) => s.token === args.token && s.expiresAt > now
    );

    return {
      valid: isValid,
      isConfigured: true,
    };
  },
});

/**
 * Sign in with authorized admin email and password.
 * Credentials are verified against SHA-256 salted hashes inside Convex; nothing is exposed.
 */
export const loginAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    const emailHash = await sha256Hex(normalizedEmail);

    const { salt: envSalt, hash: envHash } = getConfiguredPasswordSaltAndHash();
    const adminRecord = await ctx.db.query("adminAuth").first();
    const rawPassword = args.password;
    const trimmedPassword = args.password.trim();

    let isPasswordValid = false;
    let nextSalt = envSalt;
    let nextPasswordHash = envHash;

    // Check against Convex env / configured hash (supports both exact and trimmed password)
    const envCandidateHash = await sha256Hex(`${envSalt}:${rawPassword}`);
    const envTrimmedHash = await sha256Hex(`${envSalt}:${trimmedPassword}`);
    if (envCandidateHash === envHash || envTrimmedHash === envHash) {
      isPasswordValid = true;
    } else if (adminRecord) {
      // Also support password if changed via changeAdminPassword in Convex DB
      const dbCandidateHash = await sha256Hex(
        `${adminRecord.salt}:${rawPassword}`
      );
      const dbTrimmedHash = await sha256Hex(
        `${adminRecord.salt}:${trimmedPassword}`
      );
      if (
        dbCandidateHash === adminRecord.passwordHash ||
        dbTrimmedHash === adminRecord.passwordHash
      ) {
        isPasswordValid = true;
        nextSalt = adminRecord.salt;
        nextPasswordHash = adminRecord.passwordHash;
      }
    }

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const now = Date.now();
    const token = generateRandomHex(32);

    if (adminRecord) {
      const activeTokens = adminRecord.sessionTokens
        .filter((s) => s.expiresAt > now)
        .slice(-9);

      await ctx.db.patch(adminRecord._id, {
        email: emailHash,
        salt: nextSalt,
        passwordHash: nextPasswordHash,
        sessionTokens: [
          ...activeTokens,
          { token, expiresAt: now + SESSION_DURATION_MS },
        ],
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("adminAuth", {
        email: emailHash,
        salt: nextSalt,
        passwordHash: nextPasswordHash,
        sessionTokens: [{ token, expiresAt: now + SESSION_DURATION_MS }],
        updatedAt: now,
      });
    }

    return {
      token,
    };
  },
});

/**
 * Sign out and invalidate the current session token.
 */
export const logoutAdmin = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const adminRecord = await ctx.db.query("adminAuth").first();

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

    const adminRecord = await ctx.db.query("adminAuth").first();
    if (!adminRecord) {
      throw new Error("Admin account not found.");
    }

    const currentHash = await sha256Hex(
      `${adminRecord.salt}:${args.currentPassword}`
    );
    const { salt: envSalt, hash: envHash } = getConfiguredPasswordSaltAndHash();
    const envCurrentHash = await sha256Hex(
      `${envSalt}:${args.currentPassword}`
    );

    if (
      currentHash !== adminRecord.passwordHash &&
      envCurrentHash !== envHash
    ) {
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

      const rawDp = resolvedDpUrl ?? rawSettings.dpImageUrl ?? "";
      const rawSecondary =
        resolvedSecondaryUrl ?? rawSettings.secondaryImageUrl ?? "";

      let cleanDp =
        rawDp === "/images/hero-dp.jpg" ||
        rawDp === "/images/hero-editorial.jpg"
          ? ""
          : rawDp;
      let cleanSecondary =
        rawSecondary === "/images/hero-dp.jpg" ||
        rawSecondary === "/images/hero-editorial.jpg"
          ? ""
          : rawSecondary;

      // If either Hero slot lost its reference earlier, recover any uploaded Hero images from Convex _storage
      if (!cleanDp || !cleanSecondary) {
        const usedNonHeroIds = new Set<string>();
        for (const p of rawProjects) {
          if (p.imageStorageId) usedNonHeroIds.add(String(p.imageStorageId));
        }
        if (rawSettings.educationStorageId) {
          usedNonHeroIds.add(String(rawSettings.educationStorageId));
        }
        if (rawSettings.cvStorageId) {
          usedNonHeroIds.add(String(rawSettings.cvStorageId));
        }

        const recentFiles = await ctx.db.system
          .query("_storage")
          .order("desc")
          .take(20);
        const heroCandidateUrls: string[] = [];

        for (const file of recentFiles) {
          if (usedNonHeroIds.has(String(file._id))) continue;
          if (file.contentType && !file.contentType.startsWith("image/")) {
            continue;
          }
          const url = await ctx.storage.getUrl(file._id);
          if (url && !heroCandidateUrls.includes(url)) {
            heroCandidateUrls.push(url);
          }
        }

        if (!cleanDp && heroCandidateUrls.length > 0) {
          cleanDp =
            heroCandidateUrls.find((u) => u !== cleanSecondary) ??
            heroCandidateUrls[0];
        }
        if (!cleanSecondary && heroCandidateUrls.length > 0) {
          cleanSecondary =
            heroCandidateUrls.find((u) => u !== cleanDp) ??
            heroCandidateUrls[0];
        }
      }

      const effectiveDp = cleanDp || cleanSecondary;
      const effectiveSecondary = cleanSecondary || cleanDp;

      siteSettings = {
        heroDisplayWord: rawSettings.heroDisplayWord,
        heroDescription:
          rawSettings.heroDescription ?? DEFAULT_SITE_SETTINGS.heroDescription,
        dpImageUrl: effectiveDp,
        dpCategory: rawSettings.dpCategory,
        dpTitle: rawSettings.dpTitle,
        dpSubtitle: rawSettings.dpSubtitle,
        secondaryImageUrl: effectiveSecondary,
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
        aboutProfileLead:
          rawSettings.aboutProfileLead ??
          DEFAULT_SITE_SETTINGS.aboutProfileLead,
        aboutProfileSub:
          rawSettings.aboutProfileSub ??
          DEFAULT_SITE_SETTINGS.aboutProfileSub,
        aboutEducationLead:
          rawSettings.aboutEducationLead ??
          DEFAULT_SITE_SETTINGS.aboutEducationLead,
        aboutEducationSecondary:
          rawSettings.aboutEducationSecondary ??
          DEFAULT_SITE_SETTINGS.aboutEducationSecondary,
        aboutEducationPrimary:
          rawSettings.aboutEducationPrimary ??
          DEFAULT_SITE_SETTINGS.aboutEducationPrimary,
        aboutExperienceLead:
          rawSettings.aboutExperienceLead ??
          DEFAULT_SITE_SETTINGS.aboutExperienceLead,
        aboutExperienceSub:
          rawSettings.aboutExperienceSub ??
          DEFAULT_SITE_SETTINGS.aboutExperienceSub,
        aboutCapabilitiesLead:
          rawSettings.aboutCapabilitiesLead ??
          DEFAULT_SITE_SETTINGS.aboutCapabilitiesLead,
        aboutToolsText:
          rawSettings.aboutToolsText ?? DEFAULT_SITE_SETTINGS.aboutToolsText,
        aboutAchievementsLead:
          rawSettings.aboutAchievementsLead ??
          DEFAULT_SITE_SETTINGS.aboutAchievementsLead,
        aboutAchievementsSub:
          rawSettings.aboutAchievementsSub ??
          DEFAULT_SITE_SETTINGS.aboutAchievementsSub,
        contactPhone:
          rawSettings.contactPhone ?? DEFAULT_SITE_SETTINGS.contactPhone,
        contactWhatsapp:
          rawSettings.contactWhatsapp ?? DEFAULT_SITE_SETTINGS.contactWhatsapp,
        contactAddress:
          rawSettings.contactAddress ?? DEFAULT_SITE_SETTINGS.contactAddress,
        contactEmail:
          rawSettings.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail,
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
  args: { adminToken: v.string() },
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
  args: { id: v.id("messages"), adminToken: v.string() },
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
  args: { adminToken: v.string() },
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
    adminToken: v.string(),
    heroDisplayWord: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
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
    aboutProfileLead: v.optional(v.string()),
    aboutProfileSub: v.optional(v.string()),
    aboutEducationLead: v.optional(v.string()),
    aboutEducationSecondary: v.optional(v.string()),
    aboutEducationPrimary: v.optional(v.string()),
    aboutExperienceLead: v.optional(v.string()),
    aboutExperienceSub: v.optional(v.string()),
    aboutCapabilitiesLead: v.optional(v.string()),
    aboutToolsText: v.optional(v.string()),
    aboutAchievementsLead: v.optional(v.string()),
    aboutAchievementsSub: v.optional(v.string()),
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
    } else if (nextDpStorageId) {
      const url = await ctx.storage.getUrl(nextDpStorageId);
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
    } else if (nextSecondaryStorageId) {
      const url = await ctx.storage.getUrl(nextSecondaryStorageId);
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
      heroDescription:
        args.heroDescription !== undefined
          ? args.heroDescription.trim()
          : (existing?.heroDescription ??
            DEFAULT_SITE_SETTINGS.heroDescription),
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
      aboutProfileLead:
        args.aboutProfileLead !== undefined
          ? args.aboutProfileLead.trim()
          : (existing?.aboutProfileLead ??
            DEFAULT_SITE_SETTINGS.aboutProfileLead),
      aboutProfileSub:
        args.aboutProfileSub !== undefined
          ? args.aboutProfileSub.trim()
          : (existing?.aboutProfileSub ??
            DEFAULT_SITE_SETTINGS.aboutProfileSub),
      aboutEducationLead:
        args.aboutEducationLead !== undefined
          ? args.aboutEducationLead.trim()
          : (existing?.aboutEducationLead ??
            DEFAULT_SITE_SETTINGS.aboutEducationLead),
      aboutEducationSecondary:
        args.aboutEducationSecondary !== undefined
          ? args.aboutEducationSecondary.trim()
          : (existing?.aboutEducationSecondary ??
            DEFAULT_SITE_SETTINGS.aboutEducationSecondary),
      aboutEducationPrimary:
        args.aboutEducationPrimary !== undefined
          ? args.aboutEducationPrimary.trim()
          : (existing?.aboutEducationPrimary ??
            DEFAULT_SITE_SETTINGS.aboutEducationPrimary),
      aboutExperienceLead:
        args.aboutExperienceLead !== undefined
          ? args.aboutExperienceLead.trim()
          : (existing?.aboutExperienceLead ??
            DEFAULT_SITE_SETTINGS.aboutExperienceLead),
      aboutExperienceSub:
        args.aboutExperienceSub !== undefined
          ? args.aboutExperienceSub.trim()
          : (existing?.aboutExperienceSub ??
            DEFAULT_SITE_SETTINGS.aboutExperienceSub),
      aboutCapabilitiesLead:
        args.aboutCapabilitiesLead !== undefined
          ? args.aboutCapabilitiesLead.trim()
          : (existing?.aboutCapabilitiesLead ??
            DEFAULT_SITE_SETTINGS.aboutCapabilitiesLead),
      aboutToolsText:
        args.aboutToolsText !== undefined
          ? args.aboutToolsText.trim()
          : (existing?.aboutToolsText ?? DEFAULT_SITE_SETTINGS.aboutToolsText),
      aboutAchievementsLead:
        args.aboutAchievementsLead !== undefined
          ? args.aboutAchievementsLead.trim()
          : (existing?.aboutAchievementsLead ??
            DEFAULT_SITE_SETTINGS.aboutAchievementsLead),
      aboutAchievementsSub:
        args.aboutAchievementsSub !== undefined
          ? args.aboutAchievementsSub.trim()
          : (existing?.aboutAchievementsSub ??
            DEFAULT_SITE_SETTINGS.aboutAchievementsSub),
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
    adminToken: v.string(),
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
  args: {
    id: v.optional(v.id("projects")),
    slug: v.optional(v.string()),
    adminToken: v.string(),
  },
  handler: async (ctx, args) => {
    await assertValidAdminToken(ctx, args.adminToken);
    if (args.id) {
      await ctx.db.delete(args.id);
      return { deleted: true };
    }
    if (args.slug) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
        .unique();
      if (existing) {
        await ctx.db.delete(existing._id);
        return { deleted: true };
      }
    }
    return { deleted: false };
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
