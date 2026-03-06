"use client";

import Link from "next/link";

export default function ContactBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="
          relative
          py-20 md:py-24 lg:py-28
          bg-gradient-to-b
          from-[#9b51e0]
          via-[#a724e4]
          to-[#8121fb]
        "
      >
        {/* Top Light Highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(800px_300px_at_50%_0%,rgba(255,255,255,0.35),transparent_70%)]" />

        {/* Side Glows */}
        <div className="pointer-events-none absolute -left-32 top-[-120px] h-[300px] w-[300px] rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-[-150px] h-[350px] w-[350px] rounded-full bg-purple-300/30 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Contact
          </h1>

          <div className="mx-auto mt-4 h-[2px] w-20 rounded-full bg-white/40" />

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="opacity-50">›</span>
            <span className="font-medium text-white">Contact</span>
          </div>
        </div>

        {/* Premium Curved Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-[100px]"
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