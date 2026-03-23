"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Search,
  User2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Blog } from "@/app/types/blogs";
import FeaturedBlogSlider from "@/app/components/Blogs/FeaturedBlogSlider";

function formatDate(date?: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function htmlToText(html?: string) {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

type Props = {
  blogs: Blog[];
};

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function BlogsClientView({ blogs }: Props) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filteredBlogs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const haystack = [
        blog.title,
        htmlToText(blog.excerpt),
        htmlToText(blog.introDescription),
        blog.authorName,
        ...(Array.isArray(blog.tags) ? blog.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !keyword || haystack.includes(keyword);
    });
  }, [blogs, search]);

  const visibleBlogs = useMemo(
    () => filteredBlogs.slice(0, visibleCount),
    [filteredBlogs, visibleCount]
  );

  const featuredBlogs = useMemo(() => blogs.slice(0, 5), [blogs]);
  const hasMore = visibleCount < filteredBlogs.length;

  return (
    <>
      <FeaturedBlogSlider blogs={featuredBlogs} autoPlayMs={4500} />

      <section>
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-700">
              All Articles
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Explore Our Latest Insights
            </h2>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(INITIAL_COUNT);
                }}
                placeholder="Search blogs..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {visibleBlogs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {filteredBlogs.length}
            </span>{" "}
            blogs
          </p>
        </div>

        {filteredBlogs.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleBlogs.map((blog, i) => {
                const previewText =
                  htmlToText(blog.excerpt) ||
                  htmlToText(blog.introDescription) ||
                  "Read this article to explore more insights.";

                return (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]"
                  >
                    <Link href={`/blogs/${blog.slug}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <Image
                          src={
                            blog.coverImage?.url ||
                            "https://placehold.co/800x500/png"
                          }
                          alt={blog.coverImage?.alt || blog.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>

                      <div className="p-5">
                        <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <User2 className="h-3.5 w-3.5 text-fuchsia-700" />
                            {blog.authorName || "Admin"}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-fuchsia-700" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5 text-fuchsia-700" />
                            {blog.readTime || 2} min
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900 transition group-hover:text-fuchsia-700">
                          {blog.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {previewText}
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-700">
                          Read article
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {hasMore ? (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
                  }
                  className="inline-flex rounded-full bg-fuchsia-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(162,28,116,0.22)] transition hover:bg-fuchsia-800"
                >
                  Load More
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <h3 className="text-xl font-bold text-slate-900">
                No blogs found
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Try changing the search keyword to see more articles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setVisibleCount(INITIAL_COUNT);
                }}
                className="mt-6 inline-flex rounded-full bg-fuchsia-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-800"
              >
                Reset Search
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
