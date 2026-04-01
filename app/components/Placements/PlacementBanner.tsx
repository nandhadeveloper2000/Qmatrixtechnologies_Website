"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  Trophy,
  Users,
} from "lucide-react";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";

export default function PlacementBanner() {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#082a5e]
            via-[#9116a1]
            to-[#8121fb]
            py-20 md:py-20 lg:py-20
          "
        >
          <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_10%_20%,rgba(255,255,255,0.10),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_90%_20%,rgba(255,255,255,0.08),transparent_70%)]" />

          <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Career-Focused Training & Placement Support
                </div>

                <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                  Placements That Turn
                  <span className="block bg-gradient-to-r from-white via-fuchsia-100 to-violet-100 bg-clip-text text-transparent">
                    Learning Into Careers
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg lg:mx-0">
                  At Qmatrix Technologies, we prepare students with
                  industry-ready skills, real-time project experience,
                  interview preparation, and strong placement assistance to help
                  them confidently step into top IT careers.
                </p>

                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                  <button
                    type="button"
                    onClick={() => setOpenEnquiry(true)}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#082a5e] shadow-[0_12px_35px_rgba(255,255,255,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(255,255,255,0.28)]"
                  >
                    Start Your Career Journey
                  </button>

                  <Link
                    href="/courses"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                  >
                    Explore Courses
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/80 lg:justify-start">
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                  <ChevronRight className="h-4 w-4 opacity-60" />
                  <span className="font-medium text-white">Placements</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">1500+</p>
                      <p className="text-sm text-white/75">Students Trained</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">Top Hiring</p>
                      <p className="text-sm text-white/75">
                        Interview & placement support
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <BriefcaseBusiness className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        Career Ready
                      </p>
                      <p className="text-sm text-white/75">
                        Resume, mock interview, guidance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

      <EnquiryPopup
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
      />
    </>
  );
}