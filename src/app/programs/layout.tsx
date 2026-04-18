import type { Metadata } from "next";
import { programs } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Browse Affiliate Programs — OpenAffiliate",
  description:
    "Search and filter " + programs.length + "+ affiliate programs by category, commission type, and more. Curated, verified, and agent-ready.",
  openGraph: {
    title: "Browse Affiliate Programs — OpenAffiliate",
    description:
      "Search and filter " + programs.length + "+ affiliate programs by category, commission type, and more.",
    url: "https://openaffiliate.dev/programs",
    siteName: "OpenAffiliate",
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
