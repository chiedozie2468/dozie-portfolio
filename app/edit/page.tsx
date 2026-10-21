import type { Metadata } from "next";
import StudioDashboard from "./studio-dashboard";

export const metadata: Metadata = {
  title: "Studio Editor | Protected",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditPage() {
  return <StudioDashboard />;
}
