"use client";

import { ConvexHttpClient } from "convex/browser";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  Check,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { getConvexUrl } from "@/components/providers/convex-client-provider";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import {
  DEFAULT_SITE_SETTINGS,
  getProjectColorTheme,
  PROJECT_COLOR_THEME_LIST,
  type PortfolioProject,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type ProjectCategory =
  | "Full-Stack"
  | "Platform"
  | "Commerce & Booking"
  | "Enterprise Portal";

interface ContactMessageItem {
  _id: Id<"messages">;
  name: string;
  email: string;
  subject: string;
  projectType?: string;
  message: string;
  createdAt: number;
}

const ADMIN_SESSION_STORAGE_KEY = "dozie_admin_session_token";

export default function DashboardPage() {
  const { projects, siteSettings, connectionState, refresh } =
    usePortfolioData();

  // --- Admin Auth State ---
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<"profile" | "works" | "inbox">(
    "profile"
  );

  // --- Profile, DP, Website Text & Contact state ---
  const [heroDisplayWord, setHeroDisplayWord] = useState(
    siteSettings.heroDisplayWord
  );
  const [heroDescription, setHeroDescription] = useState(
    siteSettings.heroDescription ||
      DEFAULT_SITE_SETTINGS.heroDescription ||
      ""
  );
  const [dpImageUrl, setDpImageUrl] = useState(siteSettings.dpImageUrl);
  const [dpCategory, setDpCategory] = useState(siteSettings.dpCategory);
  const [dpTitle, setDpTitle] = useState(siteSettings.dpTitle);
  const [dpSubtitle, setDpSubtitle] = useState(siteSettings.dpSubtitle);

  const [secondaryImageUrl, setSecondaryImageUrl] = useState(
    siteSettings.secondaryImageUrl
  );
  const [secondaryCategory, setSecondaryCategory] = useState(
    siteSettings.secondaryCategory
  );
  const [secondaryTitle, setSecondaryTitle] = useState(
    siteSettings.secondaryTitle
  );
  const [secondarySubtitle, setSecondarySubtitle] = useState(
    siteSettings.secondarySubtitle
  );

  const [cvUrl, setCvUrl] = useState(
    siteSettings.cvUrl || DEFAULT_SITE_SETTINGS.cvUrl || ""
  );
  const [cvFileName, setCvFileName] = useState(
    siteSettings.cvFileName || DEFAULT_SITE_SETTINGS.cvFileName || ""
  );
  const [educationImageUrl, setEducationImageUrl] = useState(
    siteSettings.educationImageUrl ||
      DEFAULT_SITE_SETTINGS.educationImageUrl ||
      ""
  );
  const [educationCaption, setEducationCaption] = useState(
    siteSettings.educationCaption ||
      DEFAULT_SITE_SETTINGS.educationCaption ||
      "Miva Open University — B.Sc. Computer Science"
  );

  // About & Contact text states
  const [aboutProfileLead, setAboutProfileLead] = useState(
    siteSettings.aboutProfileLead ||
      DEFAULT_SITE_SETTINGS.aboutProfileLead ||
      ""
  );
  const [aboutProfileSub, setAboutProfileSub] = useState(
    siteSettings.aboutProfileSub || DEFAULT_SITE_SETTINGS.aboutProfileSub || ""
  );
  const [aboutEducationLead, setAboutEducationLead] = useState(
    siteSettings.aboutEducationLead ||
      DEFAULT_SITE_SETTINGS.aboutEducationLead ||
      ""
  );
  const [aboutEducationSecondary, setAboutEducationSecondary] = useState(
    siteSettings.aboutEducationSecondary ||
      DEFAULT_SITE_SETTINGS.aboutEducationSecondary ||
      ""
  );
  const [aboutEducationPrimary, setAboutEducationPrimary] = useState(
    siteSettings.aboutEducationPrimary ||
      DEFAULT_SITE_SETTINGS.aboutEducationPrimary ||
      ""
  );
  const [aboutExperienceLead, setAboutExperienceLead] = useState(
    siteSettings.aboutExperienceLead ||
      DEFAULT_SITE_SETTINGS.aboutExperienceLead ||
      ""
  );
  const [aboutExperienceSub, setAboutExperienceSub] = useState(
    siteSettings.aboutExperienceSub ||
      DEFAULT_SITE_SETTINGS.aboutExperienceSub ||
      ""
  );
  const [aboutCapabilitiesLead, setAboutCapabilitiesLead] = useState(
    siteSettings.aboutCapabilitiesLead ||
      DEFAULT_SITE_SETTINGS.aboutCapabilitiesLead ||
      ""
  );
  const [aboutToolsText, setAboutToolsText] = useState(
    siteSettings.aboutToolsText || DEFAULT_SITE_SETTINGS.aboutToolsText || ""
  );
  const [aboutAchievementsLead, setAboutAchievementsLead] = useState(
    siteSettings.aboutAchievementsLead ||
      DEFAULT_SITE_SETTINGS.aboutAchievementsLead ||
      ""
  );
  const [aboutAchievementsSub, setAboutAchievementsSub] = useState(
    siteSettings.aboutAchievementsSub ||
      DEFAULT_SITE_SETTINGS.aboutAchievementsSub ||
      ""
  );
  const [contactPhone, setContactPhone] = useState(
    siteSettings.contactPhone || DEFAULT_SITE_SETTINGS.contactPhone || ""
  );
  const [contactEmail, setContactEmail] = useState(
    siteSettings.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail || ""
  );
  const [contactAddress, setContactAddress] = useState(
    siteSettings.contactAddress || DEFAULT_SITE_SETTINGS.contactAddress || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingDp, setIsUploadingDp] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isUploadingEducation, setIsUploadingEducation] = useState(false);

  // --- Works / Projects Manager state ---
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState("");
  const [workSubtitle, setWorkSubtitle] = useState("");
  const [workSlug, setWorkSlug] = useState("");
  const [workCategory, setWorkCategory] =
    useState<ProjectCategory>("Full-Stack");
  const [workYear, setWorkYear] = useState(
    new Date().getFullYear().toString()
  );
  const [workStatus, setWorkStatus] = useState("Production");
  const [workSummary, setWorkSummary] = useState("");
  const [workProblem, setWorkProblem] = useState("");
  const [workArchitecture, setWorkArchitecture] = useState("");
  const [workOutcome, setWorkOutcome] = useState("");
  const [workMetricsText, setWorkMetricsText] = useState("");
  const [workStackText, setWorkStackText] = useState(
    "Next.js, TypeScript, Convex, Tailwind CSS"
  );
  const [workImageUrl, setWorkImageUrl] = useState("");
  const [workImageStorageId, setWorkImageStorageId] = useState<
    Id<"_storage"> | undefined
  >(undefined);
  const [workLiveUrl, setWorkLiveUrl] = useState("");
  const [workRepoUrl, setWorkRepoUrl] = useState("");
  const [workThemeColor, setWorkThemeColor] = useState("green");
  const [workOrder, setWorkOrder] = useState(projects.length + 1);
  const [isUploadingWorkImage, setIsUploadingWorkImage] = useState(false);
  const [isSavingWork, setIsSavingWork] = useState(false);

  // --- Inbox state ---
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // --- Status / Feedback ---
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dpFileInputRef = useRef<HTMLInputElement | null>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement | null>(null);
  const cvFileInputRef = useRef<HTMLInputElement | null>(null);
  const educationFileInputRef = useRef<HTMLInputElement | null>(null);
  const workImageInputRef = useRef<HTMLInputElement | null>(null);

  // Check admin session on mount
  useEffect(() => {
    let cancelled = false;
    async function checkAdminSession() {
      setIsCheckingAuth(true);
      try {
        const storedToken =
          typeof window !== "undefined"
            ? window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY)
            : null;

        if (storedToken) {
          const client = new ConvexHttpClient(getConvexUrl());
          const verification = await client.query(
            api.portfolio.verifyAdminSession,
            { token: storedToken }
          );
          if (!cancelled && verification.valid) {
            setAdminToken(storedToken);
            setIsAuthenticated(true);
          } else if (!cancelled) {
            window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
          }
        }
      } catch {
        // Ignore offline errors during initial check
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    }
    checkAdminSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      const client = new ConvexHttpClient(getConvexUrl());
      const res = await client.mutation(api.portfolio.loginAdmin, {
        email: authEmail,
        password: authPassword,
      });
      window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, res.token);
      setAdminToken(res.token);
      setIsAuthenticated(true);
      setAuthPassword("");
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please check your credentials."
      );
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (adminToken) {
        const client = new ConvexHttpClient(getConvexUrl());
        await client.mutation(api.portfolio.logoutAdmin, {
          token: adminToken,
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      }
      setAdminToken(null);
      setIsAuthenticated(false);
      setAuthPassword("");
    }
  };

  useEffect(() => {
    setHeroDisplayWord(siteSettings.heroDisplayWord);
    setHeroDescription(
      siteSettings.heroDescription ||
        DEFAULT_SITE_SETTINGS.heroDescription ||
        ""
    );
    setDpImageUrl(siteSettings.dpImageUrl);
    setDpCategory(siteSettings.dpCategory);
    setDpTitle(siteSettings.dpTitle);
    setDpSubtitle(siteSettings.dpSubtitle);
    setSecondaryImageUrl(siteSettings.secondaryImageUrl);
    setSecondaryCategory(siteSettings.secondaryCategory);
    setSecondaryTitle(siteSettings.secondaryTitle);
    setSecondarySubtitle(siteSettings.secondarySubtitle);
    setCvUrl(siteSettings.cvUrl || DEFAULT_SITE_SETTINGS.cvUrl || "");
    setCvFileName(
      siteSettings.cvFileName || DEFAULT_SITE_SETTINGS.cvFileName || ""
    );
    setEducationImageUrl(
      siteSettings.educationImageUrl ||
        DEFAULT_SITE_SETTINGS.educationImageUrl ||
        ""
    );
    setEducationCaption(
      siteSettings.educationCaption ||
        DEFAULT_SITE_SETTINGS.educationCaption ||
        "Miva Open University — B.Sc. Computer Science"
    );
    setAboutProfileLead(
      siteSettings.aboutProfileLead ||
        DEFAULT_SITE_SETTINGS.aboutProfileLead ||
        ""
    );
    setAboutProfileSub(
      siteSettings.aboutProfileSub ||
        DEFAULT_SITE_SETTINGS.aboutProfileSub ||
        ""
    );
    setAboutEducationLead(
      siteSettings.aboutEducationLead ||
        DEFAULT_SITE_SETTINGS.aboutEducationLead ||
        ""
    );
    setAboutEducationSecondary(
      siteSettings.aboutEducationSecondary ||
        DEFAULT_SITE_SETTINGS.aboutEducationSecondary ||
        ""
    );
    setAboutEducationPrimary(
      siteSettings.aboutEducationPrimary ||
        DEFAULT_SITE_SETTINGS.aboutEducationPrimary ||
        ""
    );
    setAboutExperienceLead(
      siteSettings.aboutExperienceLead ||
        DEFAULT_SITE_SETTINGS.aboutExperienceLead ||
        ""
    );
    setAboutExperienceSub(
      siteSettings.aboutExperienceSub ||
        DEFAULT_SITE_SETTINGS.aboutExperienceSub ||
        ""
    );
    setAboutCapabilitiesLead(
      siteSettings.aboutCapabilitiesLead ||
        DEFAULT_SITE_SETTINGS.aboutCapabilitiesLead ||
        ""
    );
    setAboutToolsText(
      siteSettings.aboutToolsText || DEFAULT_SITE_SETTINGS.aboutToolsText || ""
    );
    setAboutAchievementsLead(
      siteSettings.aboutAchievementsLead ||
        DEFAULT_SITE_SETTINGS.aboutAchievementsLead ||
        ""
    );
    setAboutAchievementsSub(
      siteSettings.aboutAchievementsSub ||
        DEFAULT_SITE_SETTINGS.aboutAchievementsSub ||
        ""
    );
    setContactPhone(
      siteSettings.contactPhone || DEFAULT_SITE_SETTINGS.contactPhone || ""
    );
    setContactEmail(
      siteSettings.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail || ""
    );
    setContactAddress(
      siteSettings.contactAddress || DEFAULT_SITE_SETTINGS.contactAddress || ""
    );
  }, [siteSettings]);

  const loadMessages = useCallback(async () => {
    if (!adminToken) return;
    setLoadingMessages(true);
    try {
      const client = new ConvexHttpClient(getConvexUrl());
      const list = await client.query(api.portfolio.listMessages, {
        adminToken,
      });
      setMessages(list as ContactMessageItem[]);
    } catch {
      // Ignore if offline
    } finally {
      setLoadingMessages(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (activeTab === "inbox" && isAuthenticated) {
      loadMessages();
    }
  }, [activeTab, isAuthenticated, loadMessages]);

  // Upload helper to Convex Storage
  const uploadToConvexStorage = async (file: File): Promise<Id<"_storage">> => {
    const client = new ConvexHttpClient(getConvexUrl());
    const postUrl = await client.mutation(api.portfolio.generateUploadUrl, {
      adminToken: adminToken || "",
    });
    const uploadResponse = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error("File upload failed. Please try again.");
    }
    const { storageId } = (await uploadResponse.json()) as {
      storageId: Id<"_storage">;
    };
    return storageId;
  };

  // 1. Upload DP, Secondary, or Education Image
  const handleHeroImageUpload = async (
    file: File,
    target: "dp" | "secondary" | "education"
  ) => {
    setErrorMessage(null);
    setStatusMessage(null);
    if (target === "dp") setIsUploadingDp(true);
    else if (target === "secondary") setIsUploadingSecondary(true);
    else setIsUploadingEducation(true);

    try {
      const storageId = await uploadToConvexStorage(file);
      const client = new ConvexHttpClient(getConvexUrl());
      const updated = await client.mutation(
        api.portfolio.updateSiteSettings,
        target === "dp"
          ? { adminToken: adminToken || "", dpStorageId: storageId }
          : target === "secondary"
            ? {
                adminToken: adminToken || "",
                secondaryStorageId: storageId,
              }
            : {
                adminToken: adminToken || "",
                educationStorageId: storageId,
              }
      );

      if (target === "dp") setDpImageUrl(updated.dpImageUrl);
      else if (target === "secondary")
        setSecondaryImageUrl(updated.secondaryImageUrl);
      else setEducationImageUrl(updated.educationImageUrl || "");

      await refresh();
      setStatusMessage(
        target === "dp"
          ? "DP portrait uploaded and live on Hero!"
          : target === "secondary"
            ? "Secondary editorial image uploaded and live!"
            : "Education / Matriculation photo uploaded and live in About -> Education!"
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not upload image."
      );
    } finally {
      setIsUploadingDp(false);
      setIsUploadingSecondary(false);
      setIsUploadingEducation(false);
    }
  };

  // 2. Remove DP Image
  const handleRemoveDp = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSaving(true);
    try {
      const client = new ConvexHttpClient(getConvexUrl());
      await client.mutation(api.portfolio.updateSiteSettings, {
        adminToken: adminToken || "",
        removeDp: true,
        removeSecondary: true,
      });
      setDpImageUrl("");
      setSecondaryImageUrl("");
      await refresh();
      setStatusMessage("DP portrait removed.");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not remove DP."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Upload CV File
  const handleCvUpload = async (file: File) => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsUploadingCv(true);
    try {
      const storageId = await uploadToConvexStorage(file);
      const client = new ConvexHttpClient(getConvexUrl());
      const updated = await client.mutation(api.portfolio.updateSiteSettings, {
        adminToken: adminToken || "",
        cvStorageId: storageId,
        cvFileName: file.name,
      });
      setCvUrl(updated.cvUrl || "");
      setCvFileName(updated.cvFileName || file.name);
      await refresh();
      setStatusMessage(
        `CV "${file.name}" uploaded! The Navbar "Download CV" button now downloads this file.`
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not upload CV."
      );
    } finally {
      setIsUploadingCv(false);
    }
  };

  // 4. Save Profile / Hero / CV Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const client = new ConvexHttpClient(getConvexUrl());
      await client.mutation(api.portfolio.updateSiteSettings, {
        adminToken: adminToken || "",
        heroDisplayWord,
        heroDescription,
        dpImageUrl,
        clearDpStorageId:
          dpImageUrl !== siteSettings.dpImageUrl &&
          !dpImageUrl.includes(".convex.cloud/api/storage/"),
        dpCategory,
        dpTitle,
        dpSubtitle,
        secondaryImageUrl,
        clearSecondaryStorageId:
          secondaryImageUrl !== siteSettings.secondaryImageUrl &&
          !secondaryImageUrl.includes(".convex.cloud/api/storage/"),
        secondaryCategory,
        secondaryTitle,
        secondarySubtitle,
        cvUrl,
        cvFileName,
        educationImageUrl,
        clearEducationStorageId:
          educationImageUrl !== siteSettings.educationImageUrl &&
          !educationImageUrl.includes(".convex.cloud/api/storage/"),
        educationCaption,
        aboutProfileLead,
        aboutProfileSub,
        aboutEducationLead,
        aboutEducationSecondary,
        aboutEducationPrimary,
        aboutExperienceLead,
        aboutExperienceSub,
        aboutCapabilitiesLead,
        aboutToolsText,
        aboutAchievementsLead,
        aboutAchievementsSub,
        contactPhone,
        contactEmail,
        contactAddress,
      });

      await refresh();
      setStatusMessage(
        "Hero images, website text & contact settings saved to Convex!"
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to save settings to Convex."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const client = new ConvexHttpClient(getConvexUrl());
      await client.mutation(api.portfolio.updateSiteSettings, {
        adminToken: adminToken || "",
        ...DEFAULT_SITE_SETTINGS,
        clearDpStorageId: true,
        clearSecondaryStorageId: true,
        removeCv: true,
      });
      await refresh();
      setStatusMessage("Restored default Hero, DP & CV settings.");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reset defaults."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --- Works / Projects Handlers ---
  const resetWorkForm = () => {
    setEditingProjectId(null);
    setWorkTitle("");
    setWorkSubtitle("");
    setWorkSlug("");
    setWorkCategory("Full-Stack");
    setWorkYear(new Date().getFullYear().toString());
    setWorkStatus("Production");
    setWorkSummary("");
    setWorkProblem("");
    setWorkArchitecture("");
    setWorkOutcome("");
    setWorkMetricsText("");
    setWorkStackText("Next.js, TypeScript, Convex, Tailwind CSS");
    setWorkImageUrl("");
    setWorkImageStorageId(undefined);
    setWorkLiveUrl("");
    setWorkRepoUrl("");
    setWorkThemeColor("green");
    setWorkOrder(projects.length + 1);
  };

  const handleEditWork = (project: PortfolioProject) => {
    setEditingProjectId(project._id ?? null);
    setWorkTitle(project.title);
    setWorkSubtitle(project.subtitle);
    setWorkSlug(project.slug);
    setWorkCategory(project.category);
    setWorkYear(project.year);
    setWorkStatus(project.status);
    setWorkSummary(project.summary);
    setWorkProblem(project.problem);
    setWorkArchitecture(project.architecture);
    setWorkOutcome(project.outcome);
    setWorkMetricsText(project.metrics.join("\n"));
    setWorkStackText(project.stack.join(", "));
    setWorkImageUrl(project.imageUrl || "");
    setWorkImageStorageId(undefined);
    setWorkLiveUrl(project.liveUrl || "");
    setWorkRepoUrl(project.repoUrl || "");
    setWorkThemeColor(
      getProjectColorTheme(project.themeColor, project.slug).id
    );
    setWorkOrder(project.order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWorkImageUpload = async (file: File) => {
    setErrorMessage(null);
    setIsUploadingWorkImage(true);
    try {
      const storageId = await uploadToConvexStorage(file);
      setWorkImageStorageId(storageId);
      setWorkImageUrl(URL.createObjectURL(file));
      setStatusMessage(
        "Project cover image uploaded! Click 'Save Project' below to publish."
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not upload project image."
      );
    } finally {
      setIsUploadingWorkImage(false);
    }
  };

  const handleSaveWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim() || !workSummary.trim()) {
      setErrorMessage("Please provide at least a Project Title and Summary.");
      return;
    }

    setIsSavingWork(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const generatedSlug =
        workSlug.trim() ||
        workTitle
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const client = new ConvexHttpClient(getConvexUrl());
      await client.mutation(api.portfolio.upsertProject, {
        adminToken: adminToken || "",
        id: editingProjectId ? (editingProjectId as Id<"projects">) : undefined,
        slug: generatedSlug,
        title: workTitle.trim(),
        subtitle: workSubtitle.trim() || workTitle.trim(),
        category: workCategory,
        year: workYear.trim() || new Date().getFullYear().toString(),
        status: workStatus.trim() || "Production",
        summary: workSummary.trim(),
        problem: workProblem.trim() || workSummary.trim(),
        architecture:
          workArchitecture.trim() || "Modern full-stack production architecture.",
        outcome: workOutcome.trim() || "Deployed and live in production.",
        metrics: workMetricsText
          .split("\n")
          .map((m) => m.trim())
          .filter(Boolean),
        stack: workStackText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        imageUrl: workImageStorageId ? undefined : workImageUrl.trim() || undefined,
        imageStorageId: workImageStorageId,
        removeImage: !workImageUrl.trim() && !workImageStorageId,
        liveUrl: workLiveUrl.trim() || undefined,
        repoUrl: workRepoUrl.trim() || undefined,
        themeColor: workThemeColor,
        featured: true,
        order: Number(workOrder) || projects.length + 1,
      });

      await refresh();
      setStatusMessage(
        editingProjectId
          ? `Updated project "${workTitle}"!`
          : `Added new project "${workTitle}" to your portfolio!`
      );
      resetWorkForm();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save project."
      );
    } finally {
      setIsSavingWork(false);
    }
  };

  const handleDeleteWork = async (project: PortfolioProject) => {
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const client = new ConvexHttpClient(getConvexUrl());
      await client.mutation(api.portfolio.deleteProject, {
        adminToken: adminToken || "",
        id: project._id ? (project._id as Id<"projects">) : undefined,
        slug: project.slug,
      });
      await refresh();
      setStatusMessage(`Removed "${project.title}" from your portfolio.`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not delete project."
      );
    }
  };

  const handleDeleteMessage = async (id: Id<"messages">) => {
    try {
      const client = new ConvexHttpClient(getConvexUrl());
      await client.mutation(api.portfolio.deleteMessage, {
        adminToken: adminToken || "",
        id,
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      // Ignore
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center py-16">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 text-sm font-medium text-heading">
          <Loader2 className="size-4 animate-spin" />
          <span>Verifying encrypted admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[82vh] items-center justify-center py-12">
        <Container className="max-w-md">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-body transition-colors hover:text-heading"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Portfolio</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary/70 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-heading uppercase">
                <Lock className="size-3" />
                Protected
              </span>
            </div>

            <div className="mb-6">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                Admin Sign In
              </h1>
              <p className="mt-1.5 text-xs leading-relaxed text-body">
                Sign in with your authorized email and password to access your
                protected Convex studio dashboard.
              </p>
            </div>

            {authError && (
              <div className="mb-5 rounded-xl border border-destructive/50 bg-background p-3.5 text-xs font-medium text-destructive">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-heading">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-heading focus:border-heading focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-heading">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pr-10 pl-3.5 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-body hover:text-heading"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-heading px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmittingAuth ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-14">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-body transition-colors hover:text-heading"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              Admin Studio Dashboard
            </h1>
            <p className="mt-1 text-sm text-body">
              Protected Convex session · Manage your DP portrait, CV download,
              and Projects live on Convex.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-heading">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>Protected Session</span>
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-heading">
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor:
                    connectionState === "live" ? "#22C55E" : "#6B7280",
                }}
              />
              {connectionState === "live"
                ? "Convex Live"
                : "Connecting..."}
            </span>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-heading transition-colors hover:border-destructive hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setStatusMessage(null);
              setErrorMessage(null);
            }}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all",
              activeTab === "profile"
                ? "bg-heading text-background"
                : "border border-border bg-card text-heading hover:bg-surface-secondary"
            )}
          >
            <Camera className="size-3.5" />
            <span>1. DP, Hero &amp; CV Download</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("works");
              setStatusMessage(null);
              setErrorMessage(null);
            }}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all",
              activeTab === "works"
                ? "bg-heading text-background"
                : "border border-border bg-card text-heading hover:bg-surface-secondary"
            )}
          >
            <Briefcase className="size-3.5" />
            <span>2. Upload &amp; Manage Projects ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("inbox");
              setStatusMessage(null);
              setErrorMessage(null);
            }}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all",
              activeTab === "inbox"
                ? "bg-heading text-background"
                : "border border-border bg-card text-heading hover:bg-surface-secondary"
            )}
          >
            <Inbox className="size-3.5" />
            <span>3. Contact Inbox</span>
          </button>
        </div>

        {/* Status & Error Banners */}
        {statusMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-heading/30 bg-card p-4 text-sm font-medium text-heading">
            <Check className="size-4 shrink-0 text-emerald-500" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-destructive/50 bg-card p-4 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {/* TAB 1: DP, HERO & CV */}
        {activeTab === "profile" && (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Live Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-heading uppercase">
                    <Sparkles className="size-3.5" />
                    Live Hero DP Preview
                  </span>
                  <span className="font-serif text-xl font-bold text-heading">
                    {heroDisplayWord || "chiedozie."}
                  </span>
                </div>

                <div className="grid grid-cols-2 items-center gap-5">
                  {/* Preview DP Card (Left on Desktop + Only image on Mobile) */}
                  <div className="flex flex-col">
                    <div className="relative aspect-[1/1.55] w-full overflow-hidden rounded-[3px] bg-surface-secondary">
                      {dpImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={dpImageUrl}
                          alt={dpTitle}
                          className="size-full object-cover object-top grayscale contrast-110 transition-all duration-300 hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center">
                          <User className="size-8 text-body/50" />
                          <span className="font-serif text-xs text-body">
                            No DP Uploaded
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="mt-3 text-[9px] font-medium tracking-[0.2em] text-body uppercase">
                      {dpCategory || "PORTRAIT"} · Mobile + Desktop Left
                    </span>
                    <p className="mt-1 pl-2 font-serif text-base text-heading">
                      {dpTitle || "Chiedozie Onyekwelu"}
                    </p>
                  </div>

                  {/* Preview Secondary Card (Right on Desktop Only) */}
                  <div className="flex flex-col">
                    <div className="relative aspect-[1/1.35] w-full overflow-hidden rounded-[3px] bg-surface-secondary">
                      {secondaryImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={secondaryImageUrl}
                          alt={secondaryTitle}
                          className="size-full object-cover object-left grayscale contrast-105 transition-all duration-300 hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center">
                          <User className="size-8 text-body/50" />
                          <span className="font-serif text-xs text-body">
                            No 2nd Image Uploaded
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="mt-3 text-[9px] font-medium tracking-[0.2em] text-body uppercase">
                      {secondaryCategory || "EDITORIAL"} · Desktop Right
                    </span>
                    <p className="mt-1 pl-2 font-serif text-base text-heading">
                      {secondaryTitle || "Untitled Res"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            <form
              onSubmit={handleSaveSettings}
              className="flex flex-col gap-6 lg:col-span-7"
            >
              {/* DP Image Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-heading">
                      1. Primary Portrait (DP) Image
                    </h2>
                    <p className="text-xs text-body">
                      Only the DP you upload here will be displayed on the Hero
                      section.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={dpFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroImageUpload(file, "dp");
                      }}
                    />
                    <button
                      type="button"
                      disabled={isUploadingDp}
                      onClick={() => dpFileInputRef.current?.click()}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-heading px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isUploadingDp ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-3.5" />
                          <span>Upload New DP</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSaving || !dpImageUrl}
                      onClick={handleRemoveDp}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface-secondary/70 px-3 py-2 text-xs font-medium text-heading transition-colors hover:border-destructive hover:text-destructive disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Remove DP</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      DP Image URL (Uploaded via Convex Storage)
                    </label>
                    <input
                      type="text"
                      value={dpImageUrl}
                      onChange={(e) => setDpImageUrl(e.target.value)}
                      placeholder="Upload your DP above (or paste image URL)"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={dpCategory}
                      onChange={(e) => setDpCategory(e.target.value)}
                      placeholder="PORTRAIT"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Hero Display Word (Bottom-Left)
                    </label>
                    <input
                      type="text"
                      value={heroDisplayWord}
                      onChange={(e) => setHeroDisplayWord(e.target.value)}
                      placeholder="dozie."
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 font-serif text-sm font-bold text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Portrait Title
                    </label>
                    <input
                      type="text"
                      value={dpTitle}
                      onChange={(e) => setDpTitle(e.target.value)}
                      placeholder="Chiedozie Onyekwelu"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Portrait Subtitle
                    </label>
                    <input
                      type="text"
                      value={dpSubtitle}
                      onChange={(e) => setDpSubtitle(e.target.value)}
                      placeholder="— STYLE. /47°"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Hero Intro Description Text
                    </label>
                    <textarea
                      rows={2}
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      placeholder="I build digital experiences that turn ideas into useful products..."
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CV Upload Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-heading">
                      2. CV / Resume Download (Upload PDF or Auto-Generate from Website)
                    </h2>
                    <p className="text-xs text-body">
                      Upload your own PDF CV here to serve that file when
                      visitors click &ldquo;Download CV&rdquo;, or leave it on
                      Auto-Generate to download your live website info in the
                      current Hero color.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={cvFileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCvUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      disabled={isUploadingCv}
                      onClick={() => cvFileInputRef.current?.click()}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-heading px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isUploadingCv ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Uploading CV...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="size-3.5" />
                          <span>Upload Custom CV PDF</span>
                        </>
                      )}
                    </button>

                    {cvUrl && cvUrl !== "/chiedozie-onyekwelu-cv.pdf" && (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsSaving(true);
                          try {
                            const client = new ConvexHttpClient(getConvexUrl());
                            await client.mutation(
                              api.portfolio.updateSiteSettings,
                              {
                                adminToken: adminToken || "",
                                removeCv: true,
                              }
                            );
                            setCvUrl("/chiedozie-onyekwelu-cv.pdf");
                            await refresh();
                            setStatusMessage(
                              "Switched back to Auto-Generated Live Website CV (Hero Theme Colored)!"
                            );
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface-secondary/70 px-3 py-2 text-xs font-medium text-heading hover:border-destructive hover:text-destructive"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Use Auto-Generated Website CV</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      CV Download File Name
                    </label>
                    <input
                      type="text"
                      value={cvFileName}
                      onChange={(e) => setCvFileName(e.target.value)}
                      placeholder="Chiedozie-Onyekwelu-CV.pdf"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      CV URL
                    </label>
                    <input
                      type="text"
                      value={cvUrl}
                      onChange={(e) => setCvUrl(e.target.value)}
                      placeholder="/chiedozie-onyekwelu-cv.pdf"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Editorial Slide Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-heading">
                      3. Secondary Editorial Slide Card
                    </h2>
                    <p className="text-xs text-body">
                      Configure the second image card at the extreme right of
                      the Hero.
                    </p>
                  </div>

                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleHeroImageUpload(file, "secondary");
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploadingSecondary}
                    onClick={() => secondaryFileInputRef.current?.click()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-secondary/70 px-3.5 py-2 text-xs font-medium text-heading transition-colors hover:border-heading disabled:opacity-50"
                  >
                    {isUploadingSecondary ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="size-3.5" />
                        <span>Upload Editorial Image</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Secondary Image URL
                    </label>
                    <input
                      type="text"
                      value={secondaryImageUrl}
                      onChange={(e) => setSecondaryImageUrl(e.target.value)}
                      placeholder="/images/hero-editorial.jpg"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={secondaryCategory}
                      onChange={(e) => setSecondaryCategory(e.target.value)}
                      placeholder="EDITORIAL"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Editorial Title
                    </label>
                    <input
                      type="text"
                      value={secondaryTitle}
                      onChange={(e) => setSecondaryTitle(e.target.value)}
                      placeholder="Untitled Res"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Editorial Subtitle
                    </label>
                    <input
                      type="text"
                      value={secondarySubtitle}
                      onChange={(e) => setSecondarySubtitle(e.target.value)}
                      placeholder="— PORT. GQ"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Education / Miva Open University Photo Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-heading">
                      4. Education Photo (Miva Open University — About Section)
                    </h2>
                    <p className="text-xs text-body">
                      Upload your matriculation or day-at-school picture for the
                      Education chapter in the About section.
                    </p>
                  </div>

                  <input
                    ref={educationFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleHeroImageUpload(file, "education");
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploadingEducation}
                    onClick={() => educationFileInputRef.current?.click()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-secondary/70 px-3.5 py-2 text-xs font-medium text-heading transition-colors hover:border-heading disabled:opacity-50"
                  >
                    {isUploadingEducation ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="size-3.5" />
                        <span>Upload School / Matriculation Photo</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Education Photo URL
                    </label>
                    <input
                      type="text"
                      value={educationImageUrl}
                      onChange={(e) => setEducationImageUrl(e.target.value)}
                      placeholder="/images/hero-dp.jpg"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-heading">
                      Education Caption
                    </label>
                    <input
                      type="text"
                      value={educationCaption}
                      onChange={(e) => setEducationCaption(e.target.value)}
                      placeholder="Miva Open University — B.Sc. Computer Science"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Website Text & Contact Info Editor */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-heading">
                    5. Website Text, Tools &amp; Contact Details
                  </h2>
                  <p className="text-xs text-body">
                    Edit the text displayed in the About section chapters, Tools
                    I Use, and Contact section (also automatically updates your
                    downloaded CV).
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Profile Lead Text
                    </label>
                    <textarea
                      rows={2}
                      value={aboutProfileLead}
                      onChange={(e) => setAboutProfileLead(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Profile Subtext
                    </label>
                    <input
                      type="text"
                      value={aboutProfileSub}
                      onChange={(e) => setAboutProfileSub(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Education Lead Text
                    </label>
                    <input
                      type="text"
                      value={aboutEducationLead}
                      onChange={(e) => setAboutEducationLead(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Secondary School Line
                    </label>
                    <input
                      type="text"
                      value={aboutEducationSecondary}
                      onChange={(e) =>
                        setAboutEducationSecondary(e.target.value)
                      }
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Primary School Line
                    </label>
                    <input
                      type="text"
                      value={aboutEducationPrimary}
                      onChange={(e) => setAboutEducationPrimary(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Experience Lead Text
                    </label>
                    <input
                      type="text"
                      value={aboutExperienceLead}
                      onChange={(e) => setAboutExperienceLead(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Experience Subtext
                    </label>
                    <input
                      type="text"
                      value={aboutExperienceSub}
                      onChange={(e) => setAboutExperienceSub(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Capabilities Lead Text
                    </label>
                    <input
                      type="text"
                      value={aboutCapabilitiesLead}
                      onChange={(e) => setAboutCapabilitiesLead(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Tools I Use (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={aboutToolsText}
                      onChange={(e) => setAboutToolsText(e.target.value)}
                      placeholder="HTML, CSS, JavaScript, TypeScript, React, React Native, Next.js..."
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Achievements Lead Text
                    </label>
                    <input
                      type="text"
                      value={aboutAchievementsLead}
                      onChange={(e) => setAboutAchievementsLead(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      About — Achievements Subtext
                    </label>
                    <input
                      type="text"
                      value={aboutAchievementsSub}
                      onChange={(e) => setAboutAchievementsSub(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Contact Studio Address
                    </label>
                    <input
                      type="text"
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  disabled={isSaving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-body transition-colors hover:text-heading"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset All to Defaults</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-heading px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving to Convex...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: UPLOAD & MANAGE WORKS */}
        {activeTab === "works" && (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left: Upload / Edit Work Form */}
            <form
              onSubmit={handleSaveWork}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 lg:col-span-7"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-heading">
                    {editingProjectId
                      ? "Edit Existing Work"
                      : "Upload a New Work / Project"}
                  </h2>
                  <p className="text-xs text-body">
                    Add works you&apos;ve built with cover image, stack, and
                    live deployment links.
                  </p>
                </div>

                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetWorkForm}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-heading hover:bg-surface-secondary"
                  >
                    + New Work Instead
                  </button>
                )}
              </div>

              {/* Work Cover Image Upload */}
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs font-semibold text-heading">
                      Work Cover Image
                    </span>
                    <span className="text-[11px] text-body">
                      Displays in the Hero slide &amp; Sample of Work section
                      (B&amp;W by default, color on click).
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={workImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleWorkImageUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      disabled={isUploadingWorkImage}
                      onClick={() => workImageInputRef.current?.click()}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-heading px-3.5 py-2 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
                    >
                      {isUploadingWorkImage ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-3.5" />
                          <span>Upload Image</span>
                        </>
                      )}
                    </button>

                    {workImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setWorkImageUrl("");
                          setWorkImageStorageId(undefined);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-border px-2.5 py-2 text-xs text-body hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                {workImageUrl && (
                  <div className="mt-3 aspect-[16/9] max-h-44 overflow-hidden rounded-lg border border-border bg-surface-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={workImageUrl}
                      alt="Work preview"
                      className="size-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-3">
                  <input
                    type="text"
                    value={workImageUrl}
                    onChange={(e) => {
                      setWorkImageUrl(e.target.value);
                      setWorkImageStorageId(undefined);
                    }}
                    placeholder="Or paste an image URL (/images/... or https://...)"
                    className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-heading focus:border-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    placeholder="e.g. KollaTunez Tours & Ticketing Platform"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Subtitle / One-Line Hook
                  </label>
                  <input
                    type="text"
                    value={workSubtitle}
                    onChange={(e) => setWorkSubtitle(e.target.value)}
                    placeholder="Real-time event booking, QR ticket verification & automated itinerary generation"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Category
                  </label>
                  <select
                    value={workCategory}
                    onChange={(e) =>
                      setWorkCategory(e.target.value as ProjectCategory)
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Commerce & Booking">
                      Commerce &amp; Booking
                    </option>
                    <option value="Enterprise Portal">Enterprise Portal</option>
                    <option value="Platform">Platform</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Year
                    </label>
                    <input
                      type="text"
                      value={workYear}
                      onChange={(e) => setWorkYear(e.target.value)}
                      placeholder="2026"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-heading">
                      Order
                    </label>
                    <input
                      type="number"
                      value={workOrder}
                      onChange={(e) => setWorkOrder(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-heading">
                    Project Theme Color (Light BG &amp; Text Color)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PROJECT_COLOR_THEME_LIST.map((theme) => {
                      const isSelected = workThemeColor === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setWorkThemeColor(theme.id)}
                          style={{
                            backgroundColor: theme.lightBg,
                            color: theme.textHex,
                            borderColor: isSelected
                              ? theme.accentHex
                              : theme.borderHex,
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all",
                            isSelected && "ring-2 ring-offset-1"
                          )}
                        >
                          <span
                            style={{ backgroundColor: theme.accentHex }}
                            className="size-2.5 shrink-0 rounded-full"
                          />
                          <span className="truncate">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Overview Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={workSummary}
                    onChange={(e) => setWorkSummary(e.target.value)}
                    placeholder="Describe what this project does and who it serves..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Live URL (optional)
                  </label>
                  <input
                    type="text"
                    value={workLiveUrl}
                    onChange={(e) => setWorkLiveUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-heading">
                    GitHub / Source URL (optional)
                  </label>
                  <input
                    type="text"
                    value={workRepoUrl}
                    onChange={(e) => setWorkRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={workStackText}
                    onChange={(e) => setWorkStackText(e.target.value)}
                    placeholder="Next.js 16, TypeScript, Convex, Tailwind CSS"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Key Highlights / Metrics (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={workMetricsText}
                    onChange={(e) => setWorkMetricsText(e.target.value)}
                    placeholder={
                      "Zero double-booking race conditions\n< 3s QR ticket verification\nAutomated PDF receipt dispatch"
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Problem Solved (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={workProblem}
                    onChange={(e) => setWorkProblem(e.target.value)}
                    placeholder="What operational problem did this solve?"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-heading focus:border-heading focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-heading">
                    Architecture &amp; Outcome (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={workArchitecture}
                    onChange={(e) => setWorkArchitecture(e.target.value)}
                    placeholder="How it was engineered..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-heading focus:border-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingWork}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-heading px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSavingWork ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Work...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      <span>
                        {editingProjectId
                          ? "Update Work"
                          : "Publish Work to Portfolio"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right: Existing Works List */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold text-heading">
                  Published Works ({projects.length})
                </h2>
                <p className="mt-1 text-xs text-body">
                  Click Edit to update any work or Delete to remove it.
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.slug}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background/60 p-3.5"
                    >
                      <div className="flex items-start gap-3">
                        {proj.imageUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="size-12 shrink-0 rounded-lg object-cover grayscale"
                          />
                        )}
                        <div>
                          <span className="font-mono text-[10px] text-body uppercase">
                            {proj.category} · {proj.year}
                          </span>
                          <h3 className="text-sm font-semibold text-heading">
                            {proj.title}
                          </h3>
                          <p className="line-clamp-1 text-xs text-body">
                            {proj.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditWork(proj)}
                          title="Edit work"
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-heading hover:bg-surface-secondary"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWork(proj)}
                          title="Delete work"
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-body hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT INBOX */}
        {activeTab === "inbox" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-semibold text-heading">
                  Contact Messages Inbox
                </h2>
                <p className="text-xs text-body">
                  Messages submitted via your portfolio contact form.
                </p>
              </div>
              <button
                type="button"
                onClick={loadMessages}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-heading hover:bg-surface-secondary"
              >
                Refresh
              </button>
            </div>

            {loadingMessages ? (
              <div className="flex items-center gap-2 py-8 text-sm text-body">
                <Loader2 className="size-4 animate-spin" />
                <span>Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <p className="py-8 text-sm text-body">
                No contact messages yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background/60 p-4 sm:flex-row sm:items-start"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-heading">
                          {msg.name}
                        </span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="font-mono text-xs text-body underline hover:text-heading"
                        >
                          {msg.email}
                        </a>
                        <span className="rounded-md bg-surface-secondary px-2 py-0.5 font-mono text-[10px] text-heading">
                          {msg.projectType || "Inquiry"}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-heading">
                        {msg.subject}
                      </p>
                      <p className="text-xs whitespace-pre-wrap text-body">
                        {msg.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-body hover:border-destructive hover:text-destructive"
                      title="Delete message"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
