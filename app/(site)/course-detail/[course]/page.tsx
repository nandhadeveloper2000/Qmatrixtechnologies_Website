import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailsBanner from "@/app/components/Courses/CourseDetails/CourseDetailsBanner";
import { coursesData } from "@/app/(site)/data/courses";
import CourseDetailsContent from "@/app/components/Courses/CourseDetails/CourseDetailsContent";
import AlumniWorkSection from "@/app/components/About/AlumniWorkSection";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import { SITE_URL } from "@/app/lib/seo";

export function generateStaticParams() {
  return coursesData.map((c) => ({ course: c.path }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseParam } = await params;
  const course = coursesData.find((c) => c.path === courseParam);

  if (!course) {
    return {
      title: "Course Not Found | QMatrix Technologies",
      description: "The requested course could not be found.",
    };
  }

  const title = `${course.title} Course in Chennai | QMatrix Technologies`;
  const description =
    course.description ||
    `${course.title} training in Chennai with real-time projects and placement support.`;
  const canonical = `${SITE_URL}/course-detail/${course.path}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "QMatrix Technologies",
      images: course.image ? [{ url: course.image, alt: course.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: course.image ? [course.image] : [],
    },
    robots: "index,follow",
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseParam } = await params;
  const course = coursesData.find((c) => c.path === courseParam);

  if (!course) return notFound();

  return (
    <main className="bg-white">
      <CourseDetailsBanner course={course} />
      <CourseDetailsContent course={course} />
      <AlumniWorkSection />
      <NewsletterCTA />
    </main>
  );
}