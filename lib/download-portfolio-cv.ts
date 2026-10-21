import type { HeroColorTheme } from "@/lib/hero-themes";
import {
  DEFAULT_SITE_SETTINGS,
  DEVELOPER_PROFILE,
  INITIAL_PROJECTS,
  normalizePortfolioProject,
  type PortfolioProject,
  type PortfolioSiteSettings,
} from "@/lib/portfolio-data";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function parseColorToRgb(
  colorStr: string,
  fallback: RgbColor = { r: 0.05, g: 0.05, b: 0.05 }
): RgbColor {
  const trimmed = colorStr.trim();
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return { r, g, b };
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return { r, g, b };
    }
  }
  const rgbaMatch = trimmed.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
  );
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]) / 255,
      g: Number(rgbaMatch[2]) / 255,
      b: Number(rgbaMatch[3]) / 255,
    };
  }
  return fallback;
}

function fmtRgb(c: RgbColor): string {
  return `${c.r.toFixed(3)} ${c.g.toFixed(3)} ${c.b.toFixed(3)}`;
}

function sanitizePdfText(input: string): string {
  return input
    .replace(/[—–]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•|·/g, " | ")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const clean = text
    .replace(/[—–]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•|·/g, " | ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

  if (!clean) return [];
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxCharsPerLine) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function downloadPortfolioCv({
  activeTheme,
  projects = INITIAL_PROJECTS,
  siteSettings = DEFAULT_SITE_SETTINGS,
}: {
  activeTheme: HeroColorTheme;
  projects?: PortfolioProject[];
  siteSettings?: PortfolioSiteSettings;
}) {
  const PAGE_W = 595.28; // A4 width in pt
  const PAGE_H = 841.89; // A4 height in pt
  const MARGIN_X = 42;
  const CONTENT_W = PAGE_W - MARGIN_X * 2;

  const bgRgb = parseColorToRgb(activeTheme.bg, {
    r: 0.973,
    g: 0.973,
    b: 0.965,
  });
  const headingRgb = parseColorToRgb(activeTheme.heading, {
    r: 0.05,
    g: 0.05,
    b: 0.05,
  });
  const bodyRgb = parseColorToRgb(activeTheme.body, headingRgb);
  const accentRgb = parseColorToRgb(
    activeTheme.id === "editorial-ivory"
      ? activeTheme.heading
      : activeTheme.ringArc,
    headingRgb
  );
  const badgeRgb = parseColorToRgb(
    activeTheme.subtleBadgeBg,
    activeTheme.isDark
      ? { r: 0.24, g: 0.2, b: 0.18 }
      : { r: 0.92, g: 0.91, b: 0.89 }
  );

  const ops: string[] = [];

  // 1. Full-page background fill matching current Hero screen color
  ops.push(`${fmtRgb(bgRgb)} rg`);
  ops.push(`0 0 ${PAGE_W.toFixed(2)} ${PAGE_H.toFixed(2)} re f`);

  // 2. Top accent bar matching current Hero accent color
  ops.push(`${fmtRgb(accentRgb)} rg`);
  ops.push(`0 ${(PAGE_H - 6).toFixed(2)} ${PAGE_W.toFixed(2)} 6 re f`);

  let y = PAGE_H - 44;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    font: "F1" | "F2" | "F3",
    size: number,
    color: RgbColor
  ) => {
    ops.push("BT");
    ops.push(`/${font} ${size} Tf`);
    ops.push(`${fmtRgb(color)} rg`);
    ops.push(`1 0 0 1 ${x.toFixed(2)} ${yPos.toFixed(2)} Tm`);
    ops.push(`(${sanitizePdfText(text)}) Tj`);
    ops.push("ET");
  };

  const drawDivider = (yPos: number) => {
    ops.push("q");
    ops.push(`${fmtRgb(accentRgb)} RG`);
    ops.push("0.6 w");
    ops.push(
      `${MARGIN_X.toFixed(2)} ${yPos.toFixed(2)} m ${(PAGE_W - MARGIN_X).toFixed(2)} ${yPos.toFixed(2)} l S`
    );
    ops.push("Q");
  };

  const drawSectionHeading = (label: string) => {
    y -= 8;
    drawDivider(y + 10);
    drawText(label.toUpperCase(), MARGIN_X, y - 3, "F2", 9.5, accentRgb);
    y -= 18;
  };

  // --- HEADER: Name, Role, Contact & Address ---
  const fullName = siteSettings.dpTitle || DEVELOPER_PROFILE.name;
  drawText(fullName, MARGIN_X, y, "F2", 24, headingRgb);
  drawText(
    `Theme: ${activeTheme.label}`,
    PAGE_W - MARGIN_X - 95,
    y + 4,
    "F3",
    8,
    accentRgb
  );
  y -= 16;

  drawText(
    "Full-Stack Software Developer  |  Web & Mobile Product Engineering",
    MARGIN_X,
    y,
    "F1",
    10.5,
    accentRgb
  );
  y -= 15;

  const phone = siteSettings.contactPhone || DEVELOPER_PROFILE.phoneRaw;
  const email = siteSettings.contactEmail || DEVELOPER_PROFILE.email;
  const address = siteSettings.contactAddress || DEVELOPER_PROFILE.address;

  drawText(
    `Phone / WhatsApp: ${phone} (${DEVELOPER_PROFILE.phone})   |   Email: ${email}`,
    MARGIN_X,
    y,
    "F3",
    8.5,
    bodyRgb
  );
  y -= 12;

  drawText(`Address: ${address}`, MARGIN_X, y, "F3", 8.5, bodyRgb);
  y -= 12;

  drawText(
    "GitHub: github.com/chiedozie2468   |   LinkedIn: linkedin.com/in/chiedozie-onyekwelu-618991303",
    MARGIN_X,
    y,
    "F3",
    8.5,
    bodyRgb
  );
  y -= 12;

  // --- SECTION 1: PROFILE & WHAT I DO ---
  drawSectionHeading("Profile & What I Do");

  const heroDesc =
    siteSettings.heroDescription ||
    DEFAULT_SITE_SETTINGS.heroDescription ||
    "I build digital experiences that turn ideas into useful products, combining creativity, technology, and a focus on solving real problems.";
  const profileLead =
    siteSettings.aboutProfileLead ||
    DEFAULT_SITE_SETTINGS.aboutProfileLead ||
    "I'm Chiedozie Onyekwelu - a software developer building clean, fast, and reliable web and mobile products.";
  const profileSub =
    siteSettings.aboutProfileSub ||
    DEFAULT_SITE_SETTINGS.aboutProfileSub ||
    "Focused on turning real-world ideas into simple digital experiences people enjoy using.";

  const introLines = wrapText(
    `${heroDesc} ${profileLead} ${profileSub}`,
    98
  );
  for (const line of introLines) {
    drawText(line, MARGIN_X, y, "F1", 9.5, headingRgb);
    y -= 13;
  }
  y -= 2;

  // --- SECTION 2: CAPABILITIES & TOOLS I USE ---
  drawSectionHeading("Capabilities & Tools I Use");

  const capLead =
    siteSettings.aboutCapabilitiesLead ||
    DEFAULT_SITE_SETTINGS.aboutCapabilitiesLead ||
    "Full-stack web and mobile development - from clean interfaces to real-time databases and authentication.";
  drawText(capLead, MARGIN_X, y, "F1", 9.5, headingRgb);
  y -= 15;

  const toolsBarText = (
    siteSettings.aboutToolsText ||
    DEFAULT_SITE_SETTINGS.aboutToolsText ||
    "HTML, CSS, JavaScript, TypeScript, React, React Native, Next.js, Tailwind CSS, Convex, Firebase, Clerk, Git, GitHub, Node.js, Vercel"
  )
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .join("  |  ");

  // Subtle badge bar for tools
  ops.push(`${fmtRgb(badgeRgb)} rg`);
  ops.push(
    `${MARGIN_X.toFixed(2)} ${(y - 5).toFixed(2)} ${CONTENT_W.toFixed(2)} 18 re f`
  );
  drawText(toolsBarText, MARGIN_X + 8, y + 1, "F3", 7.8, headingRgb);
  y -= 16;

  // --- SECTION 3: EXPERIENCE & SELECTED PROJECTS ---
  drawSectionHeading("Experience & Selected Production Projects (2022 - Present)");

  const expLead =
    siteSettings.aboutExperienceLead ||
    DEFAULT_SITE_SETTINGS.aboutExperienceLead ||
    "2022 - Present  |  Building and shipping full-stack web apps, booking platforms, and management portals.";
  drawText(expLead, MARGIN_X, y, "F1", 9.2, bodyRgb);
  y -= 15;

  const normalizedProjects = (
    projects.length > 0 ? projects : INITIAL_PROJECTS
  )
    .slice(0, 5)
    .map(normalizePortfolioProject);

  for (const proj of normalizedProjects) {
    const headerLine = `${proj.title}  —  ${proj.category} (${proj.year} · ${proj.status})`;
    drawText(headerLine, MARGIN_X, y, "F2", 10, headingRgb);

    if (proj.liveUrl) {
      drawText(proj.liveUrl, PAGE_W - MARGIN_X - 155, y, "F3", 8.2, accentRgb);
    }
    y -= 12.5;

    const summaryLines = wrapText(proj.summary, 100).slice(0, 2);
    for (const sLine of summaryLines) {
      drawText(sLine, MARGIN_X, y, "F1", 9, bodyRgb);
      y -= 11.5;
    }

    if (proj.stack && proj.stack.length > 0) {
      drawText(
        `Stack: ${proj.stack.join(", ")}`,
        MARGIN_X,
        y,
        "F3",
        8,
        accentRgb
      );
      y -= 14;
    } else {
      y -= 4;
    }
  }

  // --- SECTION 4: EDUCATION ---
  drawSectionHeading("Education");

  drawText(
    siteSettings.educationCaption ||
      "Miva Open University  —  B.Sc. Computer Science",
    MARGIN_X,
    y,
    "F2",
    10,
    headingRgb
  );
  y -= 13;
  drawText(
    siteSettings.aboutEducationSecondary ||
      "Secondary School: Community High School, Enugu State.",
    MARGIN_X,
    y,
    "F3",
    8.8,
    bodyRgb
  );
  y -= 12;
  drawText(
    siteSettings.aboutEducationPrimary ||
      "Primary School: Community Primary School, Enugu State.",
    MARGIN_X,
    y,
    "F3",
    8.8,
    bodyRgb
  );
  y -= 12;

  // --- SECTION 5: ACHIEVEMENTS & MILESTONES ---
  drawSectionHeading("Achievements & Milestones");

  const achLead =
    siteSettings.aboutAchievementsLead ||
    DEFAULT_SITE_SETTINGS.aboutAchievementsLead ||
    "Shipped 4+ live production platforms serving real users, event bookings, and school exam records.";
  const achSub =
    siteSettings.aboutAchievementsSub ||
    DEFAULT_SITE_SETTINGS.aboutAchievementsSub ||
    "95+ performance scores, fast QR ticket verification, and dependable full-stack delivery.";

  const achLines = wrapText(`${achLead} ${achSub}`, 98);
  for (const line of achLines) {
    drawText(line, MARGIN_X, y, "F1", 9.2, headingRgb);
    y -= 12.5;
  }

  // Footer note at bottom of PDF page
  drawText(
    `Generated from Chiedozie Onyekwelu's Live Portfolio  |  ${email}  |  ${phone}`,
    MARGIN_X,
    24,
    "F3",
    7.8,
    bodyRgb
  );

  // Assemble valid PDF 1.4 document
  const contentStream = ops.join("\n");
  const objects: string[] = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W.toFixed(2)} ${PAGE_H.toFixed(2)}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n`,
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n",
    `7 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download =
    siteSettings.cvFileName ||
    DEFAULT_SITE_SETTINGS.cvFileName ||
    "Chiedozie-Onyekwelu-CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
}
