// app/courses/page.tsx
import type { Metadata } from "next";
import CoursesSection from "@/app/components/Courses/CoursesSection";
import CoursesBanner from "@/app/components/Courses/CoursesBanner";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import {
  SITE_URL,
  buildJsonLd,
  buildStaticMetadata,
  getPageSEO,
} from "@/app/lib/seo";

const COURSES_FALLBACK = {
  title: "Software Courses in Chennai | Qmatrix Technologies",
  description:
    "Explore software training courses in Chennai with real-time projects, expert mentors, and 100% placement support. Learn Cloud, Data Engineering, AI, and more at Qmatrix Technologies.",
  canonical: `${SITE_URL}/courses`,
  keywords: [
    "software courses in chennai",
    "IT courses in chennai",
    "best software training institute in chennai",
    "cloud computing course chennai",
    "data engineering course chennai",
    "snowflake training chennai",
    "aws training institute chennai",
    "azure training institute chennai",
    "databricks training chennai",
    "data analyst course chennai",
  ],
  ogImage:
    "https://res.cloudinary.com/dfbbnzwmc/image/upload/v1775550817/qmatrix/og-courses.png",
  robots: "index,follow" as const,
  schemaType: "WebPage" as const,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("courses");

  return buildStaticMetadata(seo, COURSES_FALLBACK);
}

export default async function Page() {
  const seo = await getPageSEO("courses");
  const jsonLd = buildJsonLd("courses", seo, COURSES_FALLBACK);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursesBanner />
      <CoursesSection />
      <NewsletterCTA />
    </>
  );
}