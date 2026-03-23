import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type { Blog, BlogsResponse } from "@/app/types/blogs";
import BlogsClientView from "@/app/components/Blogs/BlogsClientView";
import BlogsBanner from "@/app/components/Blogs/BlogsBanner";

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.blogs.url}`, {
      method: SummaryApi.blogs.method,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch blogs:", res.status, res.statusText);
      return [];
    }

    const data: BlogsResponse = await res.json();
    const blogs = data.blogs || data.data || [];

    return blogs.filter((blog) => blog.isPublished !== false);
  } catch (error) {
    console.error("Blog fetch error:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
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