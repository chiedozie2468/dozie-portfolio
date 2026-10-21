import type { Metadata } from "next";
import DashboardPage from "@/app/dashboard/page";

export const metadata: Metadata = {
  title: "Admin Studio | Protected",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <DashboardPage />;
}
