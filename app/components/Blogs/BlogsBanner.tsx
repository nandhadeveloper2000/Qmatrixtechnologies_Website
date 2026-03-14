"use client";

import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

export default function BlogsBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-br
          from-[#082a5e]
          via-[#9116a1]
          to-[#8121fb]
          py-20 md:py-20 lg:py-20
        "
      >
        {/* top light */}
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_10%_20%,rgba(255,255,255,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_90%_20%,rgba(255,255,255,0.08),transparent_70%)]" />

        {/* glow blobs */}
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

        {/* premium grid */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <FileText className="h-4 w-4" />
            Insights, Articles & Career Updates
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Explore Our
            <span className="block bg-gradient-to-r from-white via-fuchsia-100 to-violet-100 bg-clip-text text-transparent">
              Blogs
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Read expert articles, industry updates, career guidance, and
            learning resources to stay ahead in your technology journey.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 opacity-60" />
            <span className="font-medium text-white">Blogs</span>
          </div>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block h-[110px] w-full"
            viewBox="0 0 1440 110"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,120 480,120 720,70 C960,20 1200,10 1440,80 L1440,110 L0,110 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}