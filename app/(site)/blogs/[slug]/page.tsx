import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Sparkles,
  Star,
  CircleDot,
  HelpCircle,
  Tags,
} from "lucide-react";

import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type { Blog, BlogImage, BlogResponse } from "@/app/types/blogs";
import { imageToUrl, SITE_URL } from "@/app/lib/seo";
import RichTextContent from "@/app/components/common/RichTextContent";
import BlogDetailsBanner from "@/app/components/Blogs/BlogDetailsBanner";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getSafeSiteUrl() {
  const fallback = "https://qmatrixtechnologies-website.vercel.app";

  if (!SITE_URL || typeof SITE_URL !== "string") {
    return fallback;
  }

  const trimmed = SITE_URL.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return fallback;
  }

  try {
    new URL(trimmed);
    return trimmed.replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

function getSafeAbsoluteUrl(url?: string | null) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString();
    } catch {
      return null;
    }
  }

  return null;
}

function getSafeImageUrl(value?: string | BlogImage | null): string | null {
  if (!value) return null;

  const raw = typeof value === "string" ? value : value.url;

  if (!raw || typeof raw !== "string") return null;

  const converted = imageToUrl(raw);
  return getSafeAbsoluteUrl(converted);
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const endpoint = SummaryApi.public_blog_by_slug(slug);
    const url = `${baseURL}${endpoint.url}`;

    console.log("Fetching blog detail:", url, "slug:", slug);

    const res = await fetch(url, {
      method: endpoint.method,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        "Blog detail fetch failed:",
        res.status,
        res.statusText,
        "slug:",
        slug
      );
      return null;
    }

    const data: BlogResponse = await res.json();
    const blog = data.blog || data.data || null;

    if (!blog) {
      console.error("Blog detail response empty for slug:", slug);
      return null;
    }

    return blog;
  } catch (error) {
    console.error("Blog detail fetch error for slug:", slug, error);
    return null;
  }
}

function formatDate(date?: string | null) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function stripHtml(html?: string) {
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog || blog.isPublished === false) {
      return {
        title: "Blog Not Found | QMatrix Technologies",
        description: "The requested blog could not be found.",
      };
    }

    const safeSiteUrl = getSafeSiteUrl();

    const descriptionSource =
      stripHtml(blog.seo?.metaDescription) ||
      stripHtml(blog.excerpt) ||
      stripHtml(blog.introDescription) ||
      "Read the latest blog from QMatrix Technologies.";

    const title =
      blog.seo?.metaTitle || `${blog.title} | QMatrix Technologies Blog`;

    const canonical =
      getSafeAbsoluteUrl(blog.seo?.canonicalUrl) ||
      `${safeSiteUrl}/blogs/${blog.slug}`;

    const ogImage =
      getSafeImageUrl(blog.seo?.ogImage) ||
      getSafeImageUrl(blog.coverImage) ||
      undefined;

    return {
      metadataBase: new URL(safeSiteUrl),
      title,
      description: descriptionSource,
      keywords: Array.isArray(blog.seo?.keywords)
        ? blog.seo.keywords
        : Array.isArray(blog.tags)
        ? blog.tags
        : [],
      alternates: {
        canonical,
      },
      openGraph: {
        title: blog.seo?.ogTitle || title,
        description: blog.seo?.ogDescription || descriptionSource,
        url: canonical,
        siteName: "QMatrix Technologies",
        images: ogImage ? [{ url: ogImage, alt: title }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: blog.seo?.ogTitle || title,
        description: blog.seo?.ogDescription || descriptionSource,
        images: ogImage ? [ogImage] : [],
      },
      robots: blog.seo?.robots || "index,follow",
    };
  } catch (error) {
    console.error("generateMetadata blog error:", error);

    return {
      title: "Blog | QMatrix Technologies",
      description: "Read the latest blog from QMatrix Technologies.",
    };
  }
}

function PremiumBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function SectionCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  const serial = String(index + 1).padStart(2, "0");

  return (
    <section className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_20px_80px_rgba(2,8,23,0.07)] ring-1 ring-slate-200/60 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_90px_rgba(2,8,23,0.10)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,36,228,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/70 to-transparent" />

      <div className="relative p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="mb-7 flex items-start gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#082a5e] via-[#9116a1] to-[#8121fb] text-base font-extrabold text-white shadow-[0_16px_40px_rgba(129,33,251,0.28)]">
            {serial}
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-fuchsia-700">
              <Sparkles className="h-3.5 w-3.5" />
              Content Section
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-[32px]">
              {title}
            </h2>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

export default async function BlogDetailPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    console.log("Rendering blog detail page for slug:", slug);

    const blog = await getBlog(slug);

    if (!blog || blog.isPublished === false) {
      notFound();
    }

    const heroPreview =
      stripHtml(blog.excerpt) ||
      stripHtml(blog.introDescription) ||
      "Read the latest insights from QMatrix Technologies.";

    const publishedDate = formatDate(blog.publishedAt || blog.createdAt);

    return (
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fcfbff_0%,#f7f8fc_24%,#f4f7fb_55%,#f7fbff_100%)] text-slate-900">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8rem] top-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-300/12 blur-3xl" />
          <div className="absolute right-[-8rem] top-40 h-[30rem] w-[30rem] rounded-full bg-violet-300/12 blur-3xl" />
          <div className="absolute left-1/2 top-[34rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.18]" />
        </div>

        <BlogDetailsBanner
          category={blog.category}
          title={blog.title}
          heroPreview={heroPreview}
          authorName={blog.authorName || "Admin"}
          publishedDate={publishedDate}
          readTime={blog.readTime || 2}
          views={blog.views || 0}
          location={blog.location}
          coverImage={blog.coverImage}
        />

        <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <article className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/72 shadow-[0_35px_120px_rgba(2,8,23,0.10)] ring-1 ring-slate-200/70 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,36,228,0.06),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_32%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />

            <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14 xl:px-16 xl:py-16">
              {(blog.introTitle || blog.introDescription) && (
                <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(252,245,255,0.98)_48%,rgba(244,250,255,0.98)_100%)] p-6 shadow-[0_20px_70px_rgba(2,8,23,0.06)] ring-1 ring-slate-100/70 sm:p-8 lg:p-10 xl:p-12">
                  <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-3xl" />
                  <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-sky-300/20 blur-3xl" />

                  <div className="relative">
                    <PremiumBadge className="border-fuchsia-200/80 bg-white/80 text-fuchsia-700 shadow-sm">
                      <ChevronRight className="h-3.5 w-3.5" />
                      Introduction
                    </PremiumBadge>

                    {blog.introTitle ? (
                      <h2 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                        {blog.introTitle}
                      </h2>
                    ) : null}

                    <div className="prose prose-slate mt-6 max-w-none prose-headings:font-bold prose-headings:text-slate-950 prose-p:text-[16px] prose-p:leading-8 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-950">
                      <RichTextContent html={blog.introDescription} />
                    </div>
                  </div>
                </div>
              )}

              {!!blog.sections?.length && (
                <div className="mt-12 space-y-8 lg:mt-14 lg:space-y-10">
                  {blog.sections.map((section, index) => {
                    const sectionImageUrl = getSafeImageUrl(section.image);

                    return (
                      <SectionCard
                        key={`${section.title}-${index}`}
                        index={index}
                        title={section.title}
                      >
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-950 prose-p:text-[16px] prose-p:leading-8 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-950">
                          <RichTextContent html={section.description} />
                        </div>

                        {!!section.points?.length && (
                          <div className="mt-8 grid gap-5 lg:grid-cols-2">
                            {section.points.map((point, idx) => (
                              <div
                                key={`${point.title || "point"}-${idx}`}
                                className="group relative overflow-hidden rounded-[26px] border border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcff_100%)] p-5 shadow-[0_12px_34px_rgba(2,8,23,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(2,8,23,0.08)] sm:p-6"
                              >
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#082a5e] via-[#9116a1] to-[#8121fb]" />

                                <div className="mb-3 flex items-center gap-2 text-fuchsia-700">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-[11px] font-bold uppercase tracking-[0.22em]">
                                    Highlight Point
                                  </span>
                                </div>

                                {point.title ? (
                                  <h3 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                                    {point.title}
                                  </h3>
                                ) : null}

                                <div className="prose prose-slate mt-3 max-w-none prose-p:text-slate-700 prose-p:leading-7">
                                  <RichTextContent html={point.description} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {!!section.subpoints?.length && (
                          <div className="mt-8 grid gap-4">
                            {section.subpoints.map((item, idx) => (
                              <div
                                key={`${item.subtitle || "subpoint"}-${idx}`}
                                className="rounded-[24px] border border-slate-200/70 bg-white/95 p-5 shadow-[0_10px_24px_rgba(2,8,23,0.04)] ring-1 ring-slate-100/60 sm:p-6"
                              >
                                <div className="mb-3 flex items-center gap-2 text-sky-700">
                                  <CircleDot className="h-4 w-4" />
                                  <span className="text-[11px] font-bold uppercase tracking-[0.22em]">
                                    Sub Topic
                                  </span>
                                </div>

                                {item.subtitle ? (
                                  <h4 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                                    {item.subtitle}
                                  </h4>
                                ) : null}

                                <div className="prose prose-slate mt-3 max-w-none prose-p:text-slate-700 prose-p:leading-7">
                                  <RichTextContent html={item.subdescription} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {sectionImageUrl ? (
                          <div className="relative mt-8 overflow-hidden rounded-[30px] border border-slate-200/70 bg-white p-2 shadow-[0_20px_60px_rgba(2,8,23,0.08)]">
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-slate-100">
                              <Image
                                src={sectionImageUrl}
                                alt={section.image?.alt || section.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
                            </div>
                          </div>
                        ) : null}
                      </SectionCard>
                    );
                  })}
                </div>
              )}

              {!!blog.faqs?.length && (
                <div className="relative mt-14 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(252,246,255,0.98)_46%,rgba(244,250,255,0.98)_100%)] p-6 shadow-[0_20px_70px_rgba(2,8,23,0.06)] ring-1 ring-slate-100/70 sm:p-8 lg:p-10 xl:p-12">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-fuchsia-300/15 blur-3xl" />
                  <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-300/15 blur-3xl" />

                  <div className="relative">
                    <PremiumBadge className="border-fuchsia-200/80 bg-white/80 text-fuchsia-700 shadow-sm">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Helpful Answers
                    </PremiumBadge>

                    <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                      Frequently Asked Questions
                    </h3>

                    <div className="mt-8 grid gap-4">
                      {blog.faqs.map((faq, index) => (
                        <div
                          key={`${faq.question}-${index}`}
                          className="group rounded-[24px] border border-slate-200/70 bg-white/92 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(2,8,23,0.08)] sm:p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#082a5e] via-[#9116a1] to-[#8121fb] text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(129,33,251,0.25)]">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                                {faq.question}
                              </h4>

                              <div className="prose prose-slate mt-3 max-w-none prose-p:text-slate-700 prose-p:leading-7 prose-strong:text-slate-950">
                                <RichTextContent html={faq.answer} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!!blog.tags?.length && (
                <div className="mt-12 rounded-[30px] border border-slate-200/70 bg-white/75 p-6 shadow-[0_16px_40px_rgba(2,8,23,0.04)] backdrop-blur-xl sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white shadow-md">
                      <Tags className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-950">
                        Related Topics
                      </h4>
                      <p className="text-sm text-slate-600">
                        Explore the main themes connected to this article.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-fuchsia-200/80 bg-[linear-gradient(135deg,#fff8ff_0%,#ffffff_48%,#f3fbff_100%)] px-4 py-2.5 text-sm font-bold text-fuchsia-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </section>
      </main>
    );
  } catch (error) {
    console.error("BlogDetailPage render error:", error);
    throw error;
  }
}