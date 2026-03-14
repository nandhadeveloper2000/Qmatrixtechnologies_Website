"use client";

import { BriefcaseBusiness, Clock3 } from "lucide-react";
import type { Course } from "@/app/types/course";

export default function CourseDetailsBanner({
  course,
}: {
  course: Course;
}) {
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
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_10%_20%,rgba(255,255,255,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_90%_20%,rgba(255,255,255,0.08),transparent_70%)]" />

        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <BriefcaseBusiness className="h-4 w-4" />
            {course.placementSupport
              ? "Industry-Ready Training with Placement Support"
              : "Industry-Ready Training Program"}
          </div>

          <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
            {course.title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
            Practical training with real-time projects, expert mentorship, and career-focused learning to help you confidently build your IT career.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <Clock3 className="h-4 w-4" />
              <span>{course.duration || "Flexible Duration"}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <BriefcaseBusiness className="h-4 w-4" />
              <span>
                {course.placementSupport ? "100% Placement Assistance" : "Career Guidance"}
              </span>
            </div>
          </div>

          {typeof course.admissionFee === "number" && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white px-8 py-3.5 text-sm font-semibold text-[#082a5e] shadow-[0_18px_45px_rgba(255,255,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(255,255,255,0.24)]"
              >
                <span className="relative z-10">
                  Admission Fee Just
                  <span className="mx-2 text-[#9116a1]">★</span>
                  ₹{course.admissionFee}
                  <span className="mx-2 text-[#9116a1]">★</span>
                </span>

                <span className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.65),transparent)] transition-transform duration-1000 group-hover:translate-x-[130%]" />
              </button>
            </div>
          )}

          <div className="mt-16 h-8 md:h-12" />
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
  );
}