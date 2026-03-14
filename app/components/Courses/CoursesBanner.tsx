"use client";

import Link from "next/link";

export default function CoursesBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div
        className="
          relative
          py-16 md:py-20 lg:py-24
          bg-linear-to-b
          from-[#9b51e0]
          via-[#a724e4]
          to-[#8121fb]        "
      >
        {/* Premium top light */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_50%_0%,rgba(255,255,255,0.55),transparent_70%)]" />

        {/* Soft brand glows */}
        <div className="pointer-events-none absolute -left-40 top-[-110px] h-[320px] w-[320px] rounded-full bg-[rgba(167,36,228,0.22)] blur-3xl" />
        <div className="pointer-events-none absolute -right-44 bottom-[-120px] h-[360px] w-[360px] rounded-full bg-[rgba(77,106,149,0.16)] blur-3xl" />

        {/* Subtle grid (premium) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(8,42,94,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(8,42,94,0.14) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage:
              "radial-gradient(60% 60% at 50% 30%, black 0%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 50% 30%, black 0%, transparent 72%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Courses
          </h1>

          <div className="mx-auto mt-4 h-[2px] w-20 rounded-full  bg-white/40" />

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80">
             <Link href="/" className="transition hover:text-white">
              Home
            </Link>

             <span className="opacity-50">›</span>
            <span className="font-medium text-white">Courses</span>
          </div>
        </div>

        {/* Curved Bottom (correct layout) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block h-[90px] w-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C480,120 960,0 1440,80 L1440,100 L0,100 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}