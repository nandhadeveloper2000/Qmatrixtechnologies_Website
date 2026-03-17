import type { Metadata } from "next";
import CompanyLogos from "@/app/components/Home/Companylogos";
import CoursesSection from "@/app/components/Home/CoursesSection";
import TrainingMethodology from "@/app/components/Home/TrainingMethodology";
import WhySection from "@/app/components/Home/WhySection";
import Futureoftech from "@/app/components/Home/Futureoftech";
import InstagramFeed from "@/app/components/Home/InstagramFeed";
import HeroSection from "@/app/components/Home/HeroSection";
import Ctawrapper from "@/app/components/Home/Ctawrapper";
import FAQSection from "@/app/components/Home/FAQSection";
import Hero from "@/app/components/Home/Hero";
import GoogleReviews from "@/app/components/Home/GoogleReviews";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import {
  buildJsonLd,
  buildStaticMetadata,
  getPageSEO,
  SITE_URL,
} from "@/app/lib/seo";
import HomePopupLauncher from "@/app/components/common/HomePopupLauncher";

const HOME_FALLBACK = {
  title: "Best Software Training Institute in Chennai | QMatrix Technologies",
  description:
    "QMatrix Technologies offers job-ready software training in Chennai with expert mentors, real-time projects, and placement support.",
  canonical: `${SITE_URL}/`,
  keywords: [
    "software training institute in chennai",
    "best IT training institute in chennai",
    "cloud computing course in chennai",
    "data engineering training in chennai",
    "qmatrix technologies",
  ],
  robots: "index,follow" as const,
  schemaType: "WebPage" as const,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("home");
  return buildStaticMetadata(seo, HOME_FALLBACK);
}

export default async function HomePage() {
  const seo = await getPageSEO("home");
  const jsonLd = buildJsonLd("home", seo, HOME_FALLBACK);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePopupLauncher delay={0} onlyOncePerSession />
      <Hero />
      <CompanyLogos />
      <CoursesSection />
      <TrainingMethodology />
      <WhySection />
      <Futureoftech />
      <InstagramFeed />
      <HeroSection />
      <GoogleReviews />
      <Ctawrapper />
      <FAQSection />
      <NewsletterCTA />
    </>
  );
}