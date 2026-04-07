import type { Metadata } from "next";

import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import GoogleReviews from "@/app/components/Home/GoogleReviews";
import PlacementBanner from "@/app/components/Placements/PlacementBanner";
import PlacementHiring from "@/app/components/Placements/PlacementHiring";
import PlacementSection from "@/app/components/Placements/PlacementSection";
import PlacementsFaq from "@/app/components/Placements/PlacementsFaq";

import {
  buildJsonLd,
  buildStaticMetadata,
  getPageSEO,
  SITE_URL,
} from "@/app/lib/seo";

/* =========================
   SEO FALLBACK CONFIG
========================= */
const PLACEMENTS_FALLBACK = {
  title: "Placements at Qmatrix Technologies | 100% Job Assistance",
  description:
    "Explore placement success at Qmatrix Technologies. Get trained with real-time projects and achieve job placements in top IT companies with expert guidance.",
  canonical: `${SITE_URL}/placements`,
  keywords: [
    "Qmatrix placements",
    "software training placement Chennai",
    "IT job placement support",
    "data engineering placement training",
    "best institute with placement Chennai",
  ],
  ogImage: `${SITE_URL}/og-placements.png`, // REQUIRED (fixes TS error)
  robots: "index,follow" as const,
  schemaType: "WebPage" as const,
};

/* =========================
   METADATA
========================= */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("placements");
  return buildStaticMetadata(seo, PLACEMENTS_FALLBACK);
}

/* =========================
   PAGE
========================= */
export default async function PlacementsPage() {
  const seo = await getPageSEO("placements");
  const jsonLd = buildJsonLd("placements", seo, PLACEMENTS_FALLBACK);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        <PlacementBanner />
        <PlacementSection />
        <PlacementHiring />
        <GoogleReviews />
        <PlacementsFaq />
        <NewsletterCTA />
      </main>
    </>
  );
}