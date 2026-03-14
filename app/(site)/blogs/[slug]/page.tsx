import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  User2,
  ChevronRight,
} from "lucide-react";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type { Blog, BlogResponse } from "@/app/types/blogs";
import { imageToUrl, SITE_URL } from "@/app/lib/seo";
import RichTextContent from "@/app/components/common/RichTextContent";

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const endpoint = SummaryApi.public_blog_by_slug(slug);
    const res = await fetch(`${baseURL}${endpoint.url}`, {
      method: endpoint.method,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: BlogResponse = await res.json();
    return data.blog || data.data || null;
  } catch {
    return null;
  }
}

function formatDate(date?: string) {
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
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || blog.isPublished === false) {
    return {
      title: "Blog Not Found | QMatrix Technologies",
      description: "The requested blog could not be found.",
    };
  }

  const descriptionSource =
    stripHtml(blog.seo?.metaDescription) ||
    stripHtml(blog.excerpt) ||
    stripHtml(blog.introDescription) ||
    "Read the latest blog from QMatrix Technologies.";

  const title =
    blog.seo?.metaTitle || `${blog.title} | QMatrix Technologies Blog`;

  const canonical = blog.seo?.canonicalUrl || `${SITE_URL}/blogs/${blog.slug}`;
  const ogImage = imageToUrl(blog.seo?.ogImage || blog.coverImage);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: descriptionSource,
    keywords: blog.seo?.keywords || blog.tags || [],
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
}

function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="group inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-100 via-white to-sky-100 text-fuchsia-700 shadow-inner">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || blog.isPublished === false) {
    notFound();
  }

  const heroPreview =
    stripHtml(blog.excerpt) ||
    stripHtml(blog.introDescription) ||
    "Read the latest insights from QMatrix Technologies.";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb] text-slate-900">
      <section className="relative isolate border-b border-slate-200/70 bg-gradient-to-br from-[#fdf7ff] via-[#ffffff] to-[#eef7ff]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />
          <div className="absolute right-[-80px] top-10 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute bottom-[-100px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
              {blog.category || "General"}
            </div>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {blog.title}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              {heroPreview}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <MetaChip
                icon={<User2 className="h-4 w-4" />}
                label={blog.authorName || "Admin"}
              />
              <MetaChip
                icon={<CalendarDays className="h-4 w-4" />}
                label={formatDate(blog.publishedAt || blog.createdAt)}
              />
              <MetaChip
                icon={<Clock3 className="h-4 w-4" />}
                label={`${blog.readTime || 2} min read`}
              />
              <MetaChip
                icon={<Eye className="h-4 w-4" />}
                label={`${blog.views || 0} views`}
              />
              {blog.location ? (
                <MetaChip
                  icon={<MapPin className="h-4 w-4" />}
                  label={blog.location}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <article className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-100">
            <Image
              src={blog.coverImage?.url || "https://placehold.co/1400x700/png"}
              alt={blog.coverImage?.alt || blog.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-slate-900/5 to-transparent" />
          </div>

          <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            {blog.introTitle ? (
              <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  <ChevronRight className="h-3.5 w-3.5" />
                  Introduction
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {blog.introTitle}
                </h2>
              </div>
            ) : null}

            <div className="prose prose-slate max-w-none">
              <RichTextContent html={blog.introDescription} className="mt-4" />
            </div>

            {!!blog.sections?.length && (
              <div className="mt-12 space-y-10">
                {blog.sections.map((section, index) => (
                  <section
                    key={`${section.title}-${index}`}
                    className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/30 to-fuchsia-50/20 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-7 lg:p-8"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-fuchsia-500 to-sky-500" />
                      <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        {section.title}
                      </h3>
                    </div>

                    <div className="prose prose-slate max-w-none">
                      <RichTextContent
                        html={section.description}
                        className="mt-2"
                      />
                    </div>

                    {!!section.points?.length && (
                      <div className="mt-7 grid gap-4 md:grid-cols-2">
                        {section.points.map((point, idx) => (
                          <div
                            key={`${point.title || "point"}-${idx}`}
                            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                          >
                            {point.title ? (
                              <h4 className="text-lg font-semibold text-slate-900">
                                {point.title}
                              </h4>
                            ) : null}

                            <div className="prose prose-slate mt-2 max-w-none">
                              <RichTextContent
                                html={point.description}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!!section.subpoints?.length && (
                      <div className="mt-7 space-y-4">
                        {section.subpoints.map((item, idx) => (
                          <div
                            key={`${item.subtitle || "subpoint"}-${idx}`}
                            className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                          >
                            {item.subtitle ? (
                              <h4 className="text-lg font-semibold text-slate-900">
                                {item.subtitle}
                              </h4>
                            ) : null}

                            <div className="prose prose-slate mt-2 max-w-none">
                              <RichTextContent
                                html={item.subdescription}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.image?.url ? (
                      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
                        <Image
                          src={section.image.url}
                          alt={section.image.alt || section.title}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>
            )}

            {!!blog.faqs?.length && (
              <div className="mt-14 border-t border-slate-200 pt-10">
                <div className="mb-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-700">
                    <ChevronRight className="h-3.5 w-3.5" />
                    Helpful Answers
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-4">
                  {blog.faqs.map((faq, index) => (
                    <div
                      key={`${faq.question}-${index}`}
                      className="rounded-[24px] border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                    >
                      <h4 className="text-lg font-semibold text-slate-900">
                        {faq.question}
                      </h4>

                      <div className="prose prose-slate mt-2 max-w-none">
                        <RichTextContent html={faq.answer} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!!blog.tags?.length && (
              <div className="mt-12 border-t border-slate-200 pt-8">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-900">Tags</h4>
                </div>

                <div className="flex flex-wrap gap-3">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-sky-50 px-4 py-2 text-sm font-semibold text-fuchsia-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
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
}