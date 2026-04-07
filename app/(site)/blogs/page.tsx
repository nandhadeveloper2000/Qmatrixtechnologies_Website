// app/blogs/page.tsx
import type { Metadata } from "next";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type { Blog, BlogsResponse } from "@/app/types/blogs";
import BlogsClientView from "@/app/components/Blogs/BlogsClientView";
import BlogsBanner from "@/app/components/Blogs/BlogsBanner";
import {
  SITE_URL,
  getPageSEO,
  buildStaticMetadata,
  buildJsonLd,
} from "@/app/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BLOGS_FALLBACK = {
  title: "Latest Blogs | Qmatrix Technologies",
  description:
    "Read the latest Qmatrix Technologies blogs on Cloud, Data Engineering, Snowflake, Azure, AWS, Databricks, ETL Testing, and career growth in IT.",
  canonical: `${SITE_URL}/blogs`,
  keywords: [
    "qmatrix technologies blogs",
    "software training blogs",
    "data engineering blogs",
    "snowflake blogs",
    "azure blogs",
    "aws blogs",
    "databricks blogs",
    "etl testing blogs",
    "IT career blogs",
    "cloud computing blogs",
  ],
  ogImage:
    "https://res.cloudinary.com/dfbbnzwmc/image/upload/v1775550817/qmatrix/og-blogs.png",
  robots: "index,follow" as const,
  schemaType: "WebPage" as const,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("blogs");

  return buildStaticMetadata(seo, BLOGS_FALLBACK);
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.blogs.url}`, {
      method: SummaryApi.blogs.method,
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch blogs:", res.status, res.statusText);
      return [];
    }

    const data: BlogsResponse = await res.json();
    const rawBlogs = data?.blogs ?? data?.data ?? [];

    if (!Array.isArray(rawBlogs)) {
      console.error("Invalid blogs response:", data);
      return [];
    }

    return rawBlogs.filter(
      (blog): blog is Blog =>
        Boolean(blog && typeof blog === "object" && blog.isPublished !== false)
    );
  } catch (error) {
    console.error("Blog fetch error:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const [blogs, seo] = await Promise.all([getBlogs(), getPageSEO("blogs")]);
  const jsonLd = buildJsonLd("blogs", seo, BLOGS_FALLBACK);

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(90deg,#fdf2f8_0%,#ffffff_50%,#e0f2fe_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-0 h-44 w-44 rounded-full bg-fuchsia-200/30 blur-3xl" />
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <BlogsBanner />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <BlogsClientView blogs={blogs} />
      </section>
    </main>
  );
}