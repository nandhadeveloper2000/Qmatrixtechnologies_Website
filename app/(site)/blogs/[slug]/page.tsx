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
import type {
  Blog,
  BlogFaq,
  BlogResponse,
  BlogSection,
  BlogSectionPoint,
  BlogSectionSubpoint,
} from "@/app/types/blogs";
import RichTextContent from "@/app/components/common/RichTextContent";
import BlogDetailsBanner from "@/app/components/Blogs/BlogDetailsBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string;
};

type MongoDateLike = {
  $date?: string;
};

type SafeImage = {
  url?: string;
  alt?: string;
  public_id?: string;
};

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const safeSlug = encodeURIComponent(slug);
    const endpoint = SummaryApi.public_blog_by_slug(safeSlug);
    const fullUrl = `${baseURL}${endpoint.url}`;

    const res = await fetch(fullUrl, {
      method: endpoint.method,
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("Blog fetch failed:", {
        slug,
        url: fullUrl,
        status: res.status,
        statusText: res.statusText,
      });
      return null;
    }

    const data: BlogResponse = await res.json();
    const blog = data?.blog ?? data?.data ?? null;

    if (!blog || typeof blog !== "object") {
      console.error("Invalid blog response:", data);
      return null;
    }

    return blog;
  } catch (error) {
    console.error("Blog fetch error:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | QMatrix Technologies",
      description: "The requested blog could not be found.",
    };
  }

  const title =
    safeText(blog?.seo?.metaTitle) ||
    safeText(blog?.title) ||
    "Blog Details | QMatrix Technologies";

  const description =
    safeText(blog?.seo?.metaDescription) ||
    stripHtml(blog?.excerpt) ||
    stripHtml(blog?.introDescription) ||
    "Read the latest insights from QMatrix Technologies.";

  const ogImage =
    safeImageUrl(blog?.seo?.ogImage) ||
    safeImageUrl(blog?.coverImage) ||
    "";

  return {
    title,
    description,
    keywords: safeArray<string>(blog?.seo?.keywords),
    alternates: safeText(blog?.seo?.canonicalUrl)
      ? { canonical: safeText(blog?.seo?.canonicalUrl) }
      : undefined,
    robots: safeText(blog?.seo?.robots) || undefined,
    openGraph: {
      title: safeText(blog?.seo?.ogTitle) || title,
      description: safeText(blog?.seo?.ogDescription) || description,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

function safeText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function safeImageObject(image?: unknown): SafeImage | null {
  if (!image || typeof image !== "object") return null;

  const imageObj = image as Record<string, unknown>;

  return {
    url: typeof imageObj.url === "string" ? imageObj.url : "",
    alt: typeof imageObj.alt === "string" ? imageObj.alt : "",
    public_id:
      typeof imageObj.public_id === "string" ? imageObj.public_id : "",
  };
}

function safeImageUrl(image?: unknown): string {
  if (!image || typeof image !== "object") return "";
  const imageObj = image as Record<string, unknown>;
  return typeof imageObj.url === "string" ? imageObj.url : "";
}

function safeImageAlt(image?: unknown, fallback = "Image"): string {
  if (!image || typeof image !== "object") return fallback;

  const imageObj = image as Record<string, unknown>;
  return typeof imageObj.alt === "string" && imageObj.alt.trim()
    ? imageObj.alt
    : fallback;
}

function normalizeDate(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (
    typeof value === "object" &&
    value !== null &&
    "$date" in value &&
    typeof (value as MongoDateLike).$date === "string"
  ) {
    return (value as MongoDateLike).$date || "";
  }

  return "";
}

function formatDate(value: unknown): string {
  const dateString = normalizeDate(value);
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function stripHtml(html?: unknown): string {
  if (typeof html !== "string" || !html) return "";

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

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0
  );
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

function FaqCard({ faq, index }: { faq: BlogFaq; index: number }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_16px_50px_rgba(2,8,23,0.06)] ring-1 ring-slate-200/60 backdrop-blur-xl sm:p-7">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#082a5e] via-[#9116a1] to-[#8121fb] text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(129,33,251,0.22)]">
          {index + 1}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-700">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>

          <h3 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
            {safeText(faq?.question, `Question ${index + 1}`)}
          </h3>

          <div className="mt-3 prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-8">
            <RichTextContent html={faq?.answer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || blog?.isPublished === false) {
    notFound();
  }

  const heroPreview =
    stripHtml(blog?.excerpt) ||
    stripHtml(blog?.introDescription) ||
    "Read the latest insights from QMatrix Technologies.";

  const publishedDate = formatDate(blog?.publishedAt || blog?.createdAt);
  const sections = safeArray<BlogSection>(blog?.sections);
  const faqs = safeArray<BlogFaq>(blog?.faqs);
  const tags = normalizeTags(blog?.tags);
  const coverImage = safeImageObject(blog?.coverImage);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fcfbff_0%,#f7f8fc_24%,#f4f7fb_55%,#f7fbff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-300/12 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-[30rem] w-[30rem] rounded-full bg-violet-300/12 blur-3xl" />
        <div className="absolute left-1/2 top-[34rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.18]" />
      </div>

      <BlogDetailsBanner
        category={safeText(blog?.category)}
        title={safeText(blog?.title, "Blog Details")}
        heroPreview={heroPreview}
        authorName={safeText(blog?.authorName, "Admin")}
        publishedDate={publishedDate}
        readTime={safeNumber(blog?.readTime, 2)}
        views={safeNumber(blog?.views, 0)}
        location={safeText(blog?.location)}
        coverImage={coverImage}
      />

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <article className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/72 shadow-[0_35px_120px_rgba(2,8,23,0.10)] ring-1 ring-slate-200/70 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,36,228,0.06),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_32%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />

          <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14 xl:px-16 xl:py-16">
            {(safeText(blog?.introTitle) || safeText(blog?.introDescription)) && (
              <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(252,245,255,0.98)_48%,rgba(244,250,255,0.98)_100%)] p-6 shadow-[0_20px_70px_rgba(2,8,23,0.06)] ring-1 ring-slate-100/70 sm:p-8 lg:p-10 xl:p-12">
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-sky-300/20 blur-3xl" />

                <div className="relative">
                  <PremiumBadge className="border-fuchsia-200/80 bg-white/80 text-fuchsia-700 shadow-sm">
                    <ChevronRight className="h-3.5 w-3.5" />
                    Introduction
                  </PremiumBadge>

                  {safeText(blog?.introTitle) ? (
                    <h2 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                      {safeText(blog?.introTitle)}
                    </h2>
                  ) : null}

                  <div className="prose prose-slate mt-6 max-w-none prose-headings:font-bold prose-headings:text-slate-950 prose-p:text-[16px] prose-p:leading-8 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-950">
                    <RichTextContent html={blog?.introDescription} />
                  </div>
                </div>
              </div>
            )}

            {sections.length > 0 && (
              <div className="mt-12 space-y-8 lg:mt-14 lg:space-y-10">
                {sections.map((section, index) => {
                  const sectionImageUrl = safeImageUrl(section?.image);
                  const sectionImageAlt = safeImageAlt(
                    section?.image,
                    safeText(section?.title, "Blog section image")
                  );
                  const points = safeArray<BlogSectionPoint>(section?.points);
                  const subpoints = safeArray<BlogSectionSubpoint>(
                    section?.subpoints
                  );

                  return (
                    <SectionCard
                      key={`${safeText(section?.title, "section")}-${index}`}
                      index={index}
                      title={safeText(section?.title, `Section ${index + 1}`)}
                    >
                      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-950 prose-p:text-[16px] prose-p:leading-8 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-950">
                        <RichTextContent html={section?.description} />
                      </div>

                      {points.length > 0 && (
                        <div className="mt-8 grid gap-5 lg:grid-cols-2">
                          {points.map((point, idx) => (
                            <div
                              key={`${safeText(point?.title, "point")}-${idx}`}
                              className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 ring-1 ring-white/80"
                            >
                              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Star className="h-4 w-4 text-fuchsia-600" />
                                {safeText(point?.title, `Point ${idx + 1}`)}
                              </div>
                              <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-7">
                                <RichTextContent html={point?.description} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {subpoints.length > 0 && (
                        <div className="mt-8 grid gap-4">
                          {subpoints.map((item, idx) => (
                            <div
                              key={`${safeText(item?.subtitle, "subpoint")}-${idx}`}
                              className="rounded-[22px] border border-slate-200/70 bg-white/80 p-5 shadow-sm"
                            >
                              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                                <CircleDot className="h-4 w-4 text-sky-600" />
                                {safeText(item?.subtitle, `Subpoint ${idx + 1}`)}
                              </div>
                              <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-7">
                                <RichTextContent html={item?.subdescription} />
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
                              alt={sectionImageAlt}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                              unoptimized
                            />
                          </div>
                        </div>
                      ) : null}
                    </SectionCard>
                  );
                })}
              </div>
            )}

            {faqs.length > 0 && (
              <div className="mt-12 lg:mt-14">
                <div className="mb-6 sm:mb-8">
                  <PremiumBadge className="border-violet-200/80 bg-white/80 text-violet-700 shadow-sm">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Frequently Asked Questions
                  </PremiumBadge>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Common questions about this topic
                  </h2>
                </div>

                <div className="grid gap-5">
                  {faqs.map((faq, index) => (
                    <FaqCard
                      key={`${safeText(faq?.question, "faq")}-${index}`}
                      faq={faq}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="mt-12 lg:mt-14">
                <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.06)] ring-1 ring-slate-200/60 sm:p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(167,36,228,0.08),transparent_30%)]" />

                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-fuchsia-700">
                      <Tags className="h-3.5 w-3.5" />
                      Related Tags
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {tags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="inline-flex items-center rounded-full border border-fuchsia-200/80 bg-fuchsia-50/80 px-4 py-2 text-sm font-semibold text-fuchsia-700 shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}