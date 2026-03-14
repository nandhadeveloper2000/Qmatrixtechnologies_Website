"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import {
  placementHighlights,
  placementProcessSteps,
  placementStats,
} from "@/app/(site)/data/placements-data";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";

export default function PlacementSection() {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8f5ff_35%,#f4f8ff_100%)] py-16 md:py-20 lg:py-24">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-[#a724e4]/15 blur-3xl" />
          <div className="absolute right-[-80px] top-24 h-80 w-80 rounded-full bg-[#8121fb]/15 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[#082a5e]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#d63384]/10 blur-3xl" />
        </div>

        {/* Grid Texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#082a5e_1px,transparent_1px),linear-gradient(to_bottom,#082a5e_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e9ddf7] bg-white/80 px-4 py-2 text-sm font-semibold text-[#9116a1] shadow-sm backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              Placement Support
            </div>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#082a5e] md:text-5xl lg:text-5xl">
              Empowering Students for
              <span className="mt-2 block bg-linear-to-r from-[#082a5e] via-[#9116a1] to-[#8121fb] bg-clip-text text-transparent">
                Successful Career Placements
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#39557e] md:text-lg">
              Our placement-focused training approach transforms learners into
              job-ready professionals through practical learning, portfolio
              building, interview preparation, and dedicated career guidance.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {placementStats.map((item, index) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_10px_40px_rgba(8,42,94,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(145,22,161,0.16)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#082a5e] via-[#9116a1] to-[#8121fb]" />
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#9116a1]/10 to-[#8121fb]/5 blur-2xl transition-all duration-300 group-hover:scale-125" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9116a1]/80">
                  0{index + 1}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[#082a5e] md:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-medium text-[#39557e]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Highlights */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_70px_rgba(8,42,94,0.08)] backdrop-blur-xl md:p-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-[#9116a1]/10 to-[#8121fb]/10 blur-3xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#9116a1] via-[#a724e4] to-[#8121fb] text-white shadow-lg shadow-[#9116a1]/25">
                  <BadgeCheck className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9116a1]">
                    Why Choose Us
                  </p>
                  <h3 className="text-2xl font-bold text-[#082a5e] md:text-3xl">
                    Placement Advantages
                  </h3>
                </div>
              </div>

              <div className="relative mt-8 grid gap-5">
                {placementHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-[24px] border border-[#edf2fb] bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d8c2ef] hover:shadow-[0_18px_40px_rgba(145,22,161,0.10)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f8eefe] to-[#eef2ff] text-[#9116a1] transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-6 w-6" />
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-[#082a5e]">
                            {item.title}
                          </h4>
                          <p className="mt-2 text-sm leading-7 text-[#39557e] md:text-[15px]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process */}
            <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#082a5e_0%,#0f3574_35%,#9116a1_100%)] p-8 text-white shadow-[0_25px_80px_rgba(8,42,94,0.22)] md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
              <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-0 top-1/3 h-52 w-52 rounded-full bg-[#d63384]/20 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Career Journey
                </p>
                <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                  Placement Process
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/75 md:text-base">
                  A structured path designed to help students build confidence,
                  strengthen technical skills, and prepare for real hiring
                  opportunities.
                </p>

                <div className="mt-8 space-y-5">
                  {placementProcessSteps.map((item) => (
                    <div
                      key={item.step}
                      className="group rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/15"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white font-extrabold text-[#9116a1] shadow-md">
                          {item.step}
                        </div>

                        <div>
                          <h4 className="text-base font-semibold md:text-lg">
                            {item.title}
                          </h4>
                          <p className="mt-2 text-sm leading-7 text-white/75">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-10 rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <h4 className="text-lg font-semibold">
                    Start Your Career Journey Today
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    Join our career-focused training programs and get guided
                    support for interviews, resumes, and job opportunities.
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setOpenEnquiry(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#082a5e] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      View Courses
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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