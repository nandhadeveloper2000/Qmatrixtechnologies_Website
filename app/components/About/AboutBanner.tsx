"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AboutBanner() {
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
        {/* Top light highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />

        {/* Glow effects */}
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.08] 
        [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] 
        [background-size:40px_40px]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            About Us
          </h1>

          <div className="mx-auto mt-4 h-[2px] w-20 rounded-full bg-white/40" />

          {/* Breadcrumb */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <ChevronRight className="h-4 w-4 opacity-60" />

            <span className="font-medium text-white">About Us</span>
          </div>
        </div>

        {/* Bottom wave */}
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