import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailsBanner from "@/app/components/Courses/CourseDetails/CourseDetailsBanner";
import CourseDetailsContent from "@/app/components/Courses/CourseDetails/CourseDetailsContent";
import AlumniWorkSection from "@/app/components/About/AlumniWorkSection";
import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import { SITE_URL } from "@/app/lib/seo";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type {
  Course,
  CourseSingleResponse,
  CoursesListResponse,
  SeoRobots,
} from "@/app/types/course";

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

function toAbsoluteUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function normalizeKeywords(keywords?: string[]) {
  if (!keywords?.length) return undefined;
  const cleaned = keywords.map((k) => k.trim()).filter(Boolean);
  return cleaned.length ? cleaned : undefined;
}

function mapRobots(robots?: SeoRobots) {
  switch (robots) {
    case "noindex,follow":
      return { index: false, follow: true };
    case "index,nofollow":
      return { index: true, follow: false };
    case "noindex,nofollow":
      return { index: false, follow: false };
    case "index,follow":
    default:
      return { index: true, follow: true };
  }
}

function getSeoData(course: Course) {
  const fallbackTitle = `${course.title} Course in Chennai | Qmatrix Technologies`;
  const fallbackDescription =
    stripHtml(course.shortDesc) ||
    stripHtml(course.description) ||
    `${course.title} training in Chennai with real-time projects and placement support.`;

  const seo = course.seo;

  const title = seo?.metaTitle?.trim() || fallbackTitle;
  const description = seo?.metaDescription?.trim() || fallbackDescription;
  const canonical =
    seo?.canonicalUrl?.trim() || `${SITE_URL}/course-detail/${course.slug}`;
  const ogTitle = seo?.ogTitle?.trim() || title;
  const ogDescription = seo?.ogDescription?.trim() || description;
  const ogImage =
    toAbsoluteUrl(seo?.ogImage?.url) || toAbsoluteUrl(course.coverImage?.url);
  const ogImageAlt =
    seo?.ogImage?.alt || course.coverImage?.alt || course.title;

  return {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt,
    keywords: normalizeKeywords(seo?.keywords),
    robots: mapRobots(seo?.robots),
  };
}

function buildCourseJsonLd(course: Course) {
  const seo = getSeoData(course);

  return {
    "@context": "https://schema.org",
    "@type": course.seo?.schemaType || "Course",
    name: course.title,
    description: seo.description,
    url: seo.canonical,
    image: seo.ogImage ? [seo.ogImage] : undefined,
    provider: {
      "@type": "Organization",
      name: "Qmatrix Technologies",
      url: SITE_URL,
    },
    courseMode: course.mode,
    timeRequired: course.duration,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.mode,
      instructor: {
        "@type": "Organization",
        name: "Qmatrix Technologies",
      },
    },
  };
}

export async function generateStaticParams() {
  const courses = await getPublishedCourses();

  return courses
    .filter((course) => course.slug)
    .map((course) => ({
      course: course.slug,
    }));
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
      title: "Course Not Found | Qmatrix Technologies",
      description: "The requested course could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seo = getSeoData(course);

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonical,
      siteName: "Qmatrix Technologies",
      type: "website",
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage,
              alt: seo.ogImageAlt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: seo.robots,
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

  const jsonLd = buildCourseJsonLd(course);

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <CourseDetailsBanner course={course} />
      <CourseDetailsContent course={course} />
      <AlumniWorkSection />
      <NewsletterCTA />
    </main>
  );
}