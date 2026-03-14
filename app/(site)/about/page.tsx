import type { Metadata } from "next";
import AboutBanner from "@/app/components/About/AboutBanner";
import AboutSections from "@/app/components/About/AboutSections";
import VisionMission from "@/app/components/About/VisionMission";
import QMatrixWayStats from "@/app/components/About/QMatrixWayStats";
import AlumniWorkSection from "@/app/components/About/AlumniWorkSection";
import WhyChooseSection from "@/app/components/About/WhyChooseSection";
import FloatingCertificateCard from "@/app/components/About/FloatingCertificateCard";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import {
  buildJsonLd,
  buildStaticMetadata,
  getPageSEO,
  SITE_URL,
} from "@/app/lib/seo";

const ABOUT_FALLBACK = {
  title: "About QMatrix Technologies",
  description:
    "Learn about QMatrix Technologies, our mission, expert mentors, placement-focused training model, and future-ready IT programs.",
  canonical: `${SITE_URL}/about`,
  keywords: [
    "about qmatrix technologies",
    "software institute in chennai",
    "IT training center in chennai",
    "placement support institute",
  ],
  robots: "index,follow" as const,
  schemaType: "WebPage" as const,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("about");
  return buildStaticMetadata(seo, ABOUT_FALLBACK);
}

export default async function AboutPage() {
  const seo = await getPageSEO("about");
  const jsonLd = buildJsonLd("about", seo, ABOUT_FALLBACK);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutBanner />
      <AboutSections />
      <WhyChooseSection />
      <FloatingCertificateCard />
      <QMatrixWayStats />
      <VisionMission />
      <AlumniWorkSection />
      <NewsletterCTA />
    </>
  );
}