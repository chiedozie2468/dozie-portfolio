import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chiedozie Onyekwelu (Dozie) — Software Developer Portfolio",
    short_name: "Dozie",
    description:
      "Full-Stack Software Developer, Web & Mobile App Engineer building digital products with React, Next.js, TypeScript, React Native, and Convex.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F8F6",
    theme_color: "#0D0D0D",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
