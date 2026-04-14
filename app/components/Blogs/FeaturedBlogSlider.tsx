"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  User2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import type { Blog, MongoDateLike } from "@/app/types/blogs";

function normalizeDate(value?: MongoDateLike): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && typeof value.$date === "string") {
    return value.$date;
  }
  return "";
}

function formatDate(date?: MongoDateLike) {
  const normalized = normalizeDate(date);
  if (!normalized) return "";

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  autoPlayMs?: number;
};

export default function FeaturedBlogSlider({
  blogs,
  autoPlayMs = 5000,
}: Props) {
  const safeBlogs = useMemo(
    () =>
      (blogs ?? []).filter(
        (blog): blog is Blog => Boolean(blog && blog.title && blog.slug)
      ),
    [blogs]
  );

  const total = safeBlogs.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (total <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [total, autoPlayMs]);

  if (total === 0) return null;

  const safeIndex = index % total;
  const current = safeBlogs[safeIndex];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % total);
  };

  const imageSrc =
    current.coverImage?.url?.trim() || "https://placehold.co/1400x900/png";

  const imageAlt =
    current.coverImage?.alt?.trim() || current.title || "Featured blog image";

  const authorName = current.authorName?.trim() || "Admin";
  const publishedDate = formatDate(current.publishedAt || current.createdAt);
  const readTime =
    typeof current.readTime === "number" && current.readTime > 0
      ? current.readTime
      : 2;

  const previewText =
    htmlToText(current.excerpt) ||
    htmlToText(current.introDescription) ||
    "Read this article to explore more insights.";

  return (
    <section className="relative mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-700">
            Featured Stories
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Recent Articles
          </h2>
        </div>

        {total > 1 ? (
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous featured blog"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fuchsia-200 bg-white text-fuchsia-700 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next featured blog"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fuchsia-200 bg-white text-fuchsia-700 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[280px] bg-slate-100 sm:min-h-[360px] lg:min-h-[460px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />

            {current.category ? (
              <div className="absolute left-5 top-5 z-10">
                <span className="inline-flex rounded-full border border-white/30 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-800 backdrop-blur">
                  {current.category}
                </span>
              </div>
            ) : null}

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-fuchsia-800/90 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-fuchsia-900 sm:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-fuchsia-800/90 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-fuchsia-900 sm:hidden"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <User2 className="h-4 w-4 text-fuchsia-700" />
                {authorName}
              </span>

              {publishedDate ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-fuchsia-700" />
                  {publishedDate}
                </span>
              ) : null}

              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-fuchsia-700" />
                {readTime} min read
              </span>
            </div>

            <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {current.title}
            </h3>

            <p className="mt-5 line-clamp-4 text-base leading-7 text-slate-600">
              {previewText}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/blogs/${current.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-fuchsia-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(162,28,116,0.28)] transition hover:-translate-y-0.5 hover:bg-fuchsia-800"
              >
                Read Full Article
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact-us"
                className="inline-flex items-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700"
              >
                Enquire Now
              </Link>
            </div>

            {total > 1 ? (
              <div className="mt-8 flex items-center gap-2">
                {safeBlogs.map((blog, i) => (
                  <button
                    key={blog.slug}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-pressed={i === safeIndex}
                    className={`h-2.5 rounded-full transition-all ${
                      i === safeIndex
                        ? "w-8 bg-fuchsia-700"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}