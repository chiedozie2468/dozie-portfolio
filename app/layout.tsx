import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AntigravityTiles } from "@/components/motion/antigravity-tiles";
import { BubbleRopeScroll } from "@/components/motion/bubble-rope-scroll";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { HeroThemeProvider } from "@/components/providers/hero-theme-provider";
import { SectionFocusProvider } from "@/components/providers/section-focus-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dozie-portfolio.vercel.app";

const seoTitle =
  "Chiedozie Onyekwelu (Dozie) — Full-Stack Software Developer & Web Engineer";
const seoDescription =
  "Official portfolio of Chiedozie Onyekwelu (Dozie) — Full-Stack Software Developer, Web & Mobile App Engineer building fast, scalable digital products with React, Next.js, TypeScript, React Native, Node.js, and Convex.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Chiedozie Onyekwelu",
      alternateName: ["Dozie", "Chiedozie", "Onyekwelu Chiedozie"],
      url: siteUrl,
      jobTitle: "Full-Stack Software Developer & Web Engineer",
      description: seoDescription,
      email: "mailto:chiedozieonyekwelu989@gmail.com",
      telephone: "+2349153251972",
      address: {
        "@type": "PostalAddress",
        streetAddress: "20 Abeokuta, Owode Onirin",
        addressLocality: "Lagos",
        addressRegion: "Lagos State",
        addressCountry: "NG",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Miva Open University",
      },
      knowsAbout: [
        "Software Development",
        "Full-Stack Web Development",
        "Mobile App Development",
        "JavaScript",
        "TypeScript",
        "React",
        "React Native",
        "Next.js",
        "Tailwind CSS",
        "Node.js",
        "Convex",
        "Firebase",
        "Clerk",
        "UI/UX Engineering",
      ],
      sameAs: [
        "https://github.com/chiedozie2468",
        "https://linkedin.com/in/chiedozie-onyekwelu",
        "https://instagram.com/chiedozie",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Chiedozie Onyekwelu (Dozie) — Software Developer Portfolio",
      description: seoDescription,
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: seoTitle,
      description: seoDescription,
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seoTitle,
    template: "%s — Chiedozie Onyekwelu (Dozie)",
  },
  description: seoDescription,
  applicationName: "Chiedozie Onyekwelu Portfolio",
  authors: [{ name: "Chiedozie Onyekwelu", url: siteUrl }],
  creator: "Chiedozie Onyekwelu",
  publisher: "Chiedozie Onyekwelu",
  category: "technology",
  keywords: [
    "Chiedozie Onyekwelu",
    "Dozie",
    "Chiedozie",
    "Onyekwelu Chiedozie",
    "Dozie Portfolio",
    "Chiedozie Onyekwelu Portfolio",
    "Software Developer",
    "Full-Stack Developer",
    "Full Stack Software Engineer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile App Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "React Native Developer",
    "Convex Developer",
    "Software Developer in Nigeria",
    "Software Developer in Lagos",
    "Web Developer in Lagos",
    "Web Developer in Nigeria",
    "Enugu Software Developer",
    "Hire Software Developer",
    "Freelance Software Developer",
    "Freelance Web Developer",
    "Miva Open University Computer Science",
    "KollaTunez Tours",
    "Followpoint",
    "NogaData JSAP",
    "TechFasta",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Chiedozie Onyekwelu (Dozie) — Software Developer",
    title: seoTitle,
    description: seoDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    creator: "@chiedozie",
  },
  verification: {
    other: {
      "me": ["mailto:chiedozieonyekwelu989@gmail.com", siteUrl],
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <SectionFocusProvider>
              <HeroThemeProvider>
                <AntigravityTiles />
                <BubbleRopeScroll />
                <Navbar />
                <main className="relative flex-1">{children}</main>
                <Footer />
              </HeroThemeProvider>
            </SectionFocusProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
