import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  User2,
  ChevronRight,
  ArrowRight,
  Bookmark,
} from "lucide-react";

type BlogDetailsBannerProps = {
  category?: string;
  title: string;
  heroPreview: string;
  authorName?: string;
  publishedDate?: string;
  readTime?: number;
  views?: number;
  location?: string;
  coverImage?: string;
  coverImageAlt?: string;
};

function GlassStat({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/20">
          {icon}
        </span>
        <span className="text-sm font-semibold text-white/90">{label}</span>
      </div>
    </div>
  );
}

function SoftBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export default function BlogDetailsBanner({
  category,
  title,
  heroPreview,
  authorName,
  publishedDate,
  readTime,
  views,
  location,
  coverImage,
  coverImageAlt,
}: BlogDetailsBannerProps) {
  const bannerImage =
    typeof coverImage === "string" && coverImage.trim()
      ? coverImage
      : "https://placehold.co/1200x1400/png";

  const bannerAlt =
    typeof coverImageAlt === "string" && coverImageAlt.trim()
      ? coverImageAlt
      : title;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-br
          from-[#082a5e]
          via-[#9116a1]
          to-[#8121fb]
          py-16 md:py-20 lg:py-24
        "
      >
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_10%_20%,rgba(255,255,255,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_90%_20%,rgba(255,255,255,0.08),transparent_70%)]" />

        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SoftBadge className="border-white/20 bg-white/10 text-white/90">
                <span className="h-2 w-2 rounded-full bg-fuchsia-300" />
                {category || "General"}
              </SoftBadge>

              <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 opacity-60" />
                <Link href="/blogs" className="transition hover:text-white">
                  Blogs
                </Link>
                <ChevronRight className="h-4 w-4 opacity-60" />
                <span className="line-clamp-1 font-medium text-white">
                  {title}
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-3xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-4xl xl:text-4xl">
                {title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/80 sm:text-lg sm:leading-9">
                {heroPreview}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <GlassStat
                  icon={<User2 className="h-4 w-4" />}
                  label={authorName || "Admin"}
                />

                {!!publishedDate && (
                  <GlassStat
                    icon={<CalendarDays className="h-4 w-4" />}
                    label={publishedDate}
                  />
                )}

                <GlassStat
                  icon={<Clock3 className="h-4 w-4" />}
                  label={`${readTime || 2} min read`}
                />

                <GlassStat
                  icon={<Eye className="h-4 w-4" />}
                  label={`${views || 0} views`}
                />

                {location ? (
                  <GlassStat
                    icon={<MapPin className="h-4 w-4" />}
                    label={location}
                  />
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#082a5e] shadow-[0_16px_40px_rgba(255,255,255,0.22)] transition-all duration-300 hover:-translate-y-1"
                >
                  Explore More Blogs
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white/85 shadow-sm backdrop-blur-md">
                  <Bookmark className="h-4 w-4 text-fuchsia-200" />
                  Premium insights by QMatrix Technologies
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[36px] bg-white/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/20 bg-white/10 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-[28px] bg-white/10">
                  <Image
                    src={bannerImage}
                    alt={bannerAlt}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,23,0.68),rgba(2,6,23,0.16),transparent)]" />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="rounded-[24px] border border-white/20 bg-white/12 p-4 text-white backdrop-blur-xl">
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                        Featured Article
                      </div>
                      <div className="line-clamp-2 text-lg font-bold leading-snug sm:text-xl">
                        {title}
                      </div>
                      <div className="mt-2 text-sm text-white/80">
                        {publishedDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}