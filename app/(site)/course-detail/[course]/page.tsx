import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailsBanner from "@/app/components/Courses/CourseDetails/CourseDetailsBanner";
import CourseDetailsContent from "@/app/components/Courses/CourseDetails/CourseDetailsContent";
import AlumniWorkSection from "@/app/components/About/AlumniWorkSection";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import { SITE_URL } from "@/app/lib/seo";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type { Course, CourseSingleResponse, CoursesListResponse } from "@/app/types/course";

async function getPublishedCourses(): Promise<Course[]> {
  try {
    const endpoint = SummaryApi.public_courses;
    const res = await fetch(`${baseURL}${endpoint.url}`, {
      method: endpoint.method,
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data: CoursesListResponse = await res.json();
    return data.data || data.courses || [];
  } catch {
    return [];
  }
}

async function getCourse(slug: string): Promise<Course | null> {
  try {
    const endpoint = SummaryApi.public_course_by_slug(slug);
    const res = await fetch(`${baseURL}${endpoint.url}`, {
      method: endpoint.method,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: CourseSingleResponse = await res.json();
    return data.course || data.data || null;
  } catch {
    return null;
  }
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateStaticParams() {
  const courses = await getPublishedCourses();
  return courses.map((c) => ({ course: c.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseParam } = await params;
  const course = await getCourse(courseParam);

  if (!course) {
    return {
      title: "Course Not Found | QMatrix Technologies",
      description: "The requested course could not be found.",
    };
  }

  const title = `${course.title} Course in Chennai | QMatrix Technologies`;
  const description =
    stripHtml(course.description) ||
    `${course.title} training in Chennai with real-time projects and placement support.`;
  const canonical = `${SITE_URL}/course-detail/${course.slug}`;

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
      images: course.coverImage?.url
        ? [{ url: course.coverImage.url, alt: course.coverImage.alt || course.title }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: course.coverImage?.url ? [course.coverImage.url] : [],
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
  const course = await getCourse(courseParam);

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