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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chiedozie Onyekwelu — Full-Stack Software Engineer",
    template: "%s — Chiedozie Onyekwelu",
  },
  description:
    "Chiedozie Onyekwelu (Dozie) — Full-Stack Software Engineer building calm, reliable software systems with Next.js, TypeScript, and Convex.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Chiedozie Onyekwelu",
    title: "Chiedozie Onyekwelu — Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer building calm, reliable software systems with Next.js, TypeScript, and Convex.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiedozie Onyekwelu — Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer building calm, reliable software systems with Next.js, TypeScript, and Convex.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F4F6" },
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
