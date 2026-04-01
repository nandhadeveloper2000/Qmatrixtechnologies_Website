// app/courses/page.tsx
import type { Metadata } from "next";
import CoursesSection from "@/app/components/Courses/CoursesSection";
import CoursesBanner from "@/app/components/Courses/CoursesBanner";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import { getPageSEO, buildStaticMetadata } from "@/app/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("courses");

  return buildStaticMetadata(seo, {
    title: "Software Courses in Chennai | Qmatrix Technologies",
    description:
      "Explore software training courses in Chennai with real-time projects, expert mentors, and placement support.",
    canonical: "https://www.qmatrixtech.com/courses",
    keywords: [
      "software courses in chennai",
      "IT courses in chennai",
      "best software training institute",
    ],
  });
}

export default function Page() {
  return (
    <>
      <CoursesBanner />
      <CoursesSection />
      <NewsletterCTA />
    </>
  );
}