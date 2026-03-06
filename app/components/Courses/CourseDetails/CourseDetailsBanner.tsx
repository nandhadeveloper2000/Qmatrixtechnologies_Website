"use client";

import Link from "next/link";
import type { Course } from "@/app/(site)/data/courses";

export default function CourseDetailsBanner({ course }: { course: Course }) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f6f1fa 0%, #d8b5ec 35%, #b26dd8 100%)",
        }}
      />
      <div className="relative mx-auto min-h-[500px] max-w-5xl px-4 pb-10 pt-24 md:px-6 md:pb-5 md:pt-10">
        {/* Title Section */}
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="text-[34px] font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            style={{
              color: "var(--tg-theme-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {course.title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-black/70">
            Training with 100% Job Placement assistance. Get trained from industry
            experts & start your IT career.
          </p>

          {/* Info Line */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-black/70">
            <span>{course.duration}</span>
            <span>🏆 100% Placement assistance</span>
          </div>

          {/* Admission Fee pill */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-full
                border border-white/35
                bg-linear-to-r from-[#9116a1] via-[#a724e4] to-[#7c1fc4]
                px-10 py-3.5 text-[13px] font-semibold text-white
                shadow-[0_20px_60px_rgba(0,0,0,0.22)]
                transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">
                Admission Fee Just <span className="mx-1 opacity-80">★</span> ₹1000{" "}
                <span className="mx-1 opacity-80">★</span>
              </span>

              {/* inner subtle border */}
              <span className="pointer-events-none absolute inset-[2px] rounded-full border border-white/15" />

              {/* AUTO shine sweep */}
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span
                  className="absolute -left-20 top-0 h-full w-20 -skew-x-12 bg-white/30
                    animate-[autoShine_2.2s_linear_infinite]"
                />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 h-10 md:h-16" />
      </div>
    </section>
  );
}