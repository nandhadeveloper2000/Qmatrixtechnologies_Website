import type { Metadata } from "next";
import ContactSections from "@/app/components/Contact/ContactSections";
import ContactBanner from "@/app/components/Contact/ContactBanner";
import OfficeLocations from "@/app/components/Contact/OfficeLocations";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import {
  buildJsonLd,
  buildStaticMetadata,
  getPageSEO,
  SITE_URL,
} from "@/app/lib/seo";

const CONTACT_FALLBACK = {
  title: "Contact Qmatrix Technologies | Chennai",
  description:
    "Contact Qmatrix Technologies for course details, counseling, batch timings, fees, and placement support in Chennai.",
  canonical: `${SITE_URL}/contact`,
  keywords: [
    "contact Qmatrix technologies",
    "course enquiry chennai",
    "IT training contact",
    "software institute contact chennai",
  ],
  robots: "index,follow" as const,
  schemaType: "WebPage" as const,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("contact");
  return buildStaticMetadata(seo, CONTACT_FALLBACK);
}

export default async function ContactPage() {
  const seo = await getPageSEO("contact");
  const jsonLd = buildJsonLd("contact", seo, CONTACT_FALLBACK);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-white">
        <ContactBanner />
        <ContactSections />
        <OfficeLocations />
        <NewsletterCTA />
      </main>
    </>
  );
}