"use client";

import React from "react";
import { whyMilestones, type WhyMilestone, type IconComponent } from "@/app/(site)/data/whyMilestones";
import Link from "next/link";

function Node({ Icon, tone }: { Icon: IconComponent; tone: string }) {
  return (
    <div className="relative">
      {/* glow */}
      <div
        className={[
          "absolute -inset-2 rounded-full blur-md opacity-60",
          "bg-linear-to-br",
          tone,
        ].join(" ")}
      />

      {/* core */}
      <div
        className={[
          "relative grid h-[74px] w-[74px] place-items-center rounded-full",
          "bg-linear-to-br",
          tone,
          "shadow-[0_18px_40px_rgba(2,6,23,0.22)]",
          "ring-4 ring-white/90",
        ].join(" ")}
      >
        <Icon className="text-[30px] text-white drop-shadow" />
      </div>
    </div>
  );
}

function FeatureCard({
  id,
  title,
  desc,
}: {
  id: WhyMilestone["id"];
  title: WhyMilestone["title"];
  desc: WhyMilestone["desc"];
}) {
  return (
    <div className="w-[600px] rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_55px_rgba(2,6,23,0.08)] backdrop-blur">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-700">
        <span className="h-2 w-2 rounded-full bg-linear-to-r from-secondary to-primary" />
        {id}
      </div>

      <h3 className="text-[17px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

export default function WhySection() {
  // ✅ already typed as WhyMilestone[] from data file
  const milestones = whyMilestones;

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20">
      {/* premium background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-white" />
        <div className="absolute -top-28 left-1/2 h-[460px] w-[980px] -translate-x-1/2 rounded-full bg-linear-to-r from-secondary/15 to-primary/15 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-linear-to-r from-sky-500/10 to-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[12px] font-semibold tracking-wide text-slate-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-secondary to-primary" />
            Career Outcomes First
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Why Choose{" "}
            <span className="bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent">
              Qmatrix Technologies
            </span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            Strong training, real projects, and placement support — built for your career outcomes.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[600px_minmax(0,1fr)] items-center gap-14">
            {/* LEFT: circle infographic */}
            <div className="relative flex justify-center">
              <div className="relative aspect-square w-full max-w-[560px] overflow-visible">
                <div className="absolute inset-[8%] rounded-full bg-slate-200/35 ring-1 ring-slate-300/40" />

                {/* center circle */}
                <div className="absolute left-[-5%] top-1/2 z-10 h-[40%] w-[40%] -translate-y-1/2 rounded-full bg-linear-to-r from-secondary to-primary shadow-[0_26px_70px_rgba(2,6,23,0.24)]">
                  <div className="flex h-full w-full items-center justify-center text-center">
                    <div className="px-6">
                      <div className="text-[35px] font-extrabold tracking-wide text-white">WHY</div>
                      <div className="mt-1 text-[30px] font-light text-white/95">CHOOSE</div>
                      <div className="mt-1 text-[30px] font-light text-white/95">US</div>
                      <div className="mt-4 text-[12px] font-medium text-white/85">
                        Job-ready learning
                      </div>
                    </div>
                  </div>
                </div>

                {/* inside ring text */}
                <div className="absolute left-[40%] top-1/2 w-[45%] -translate-y-1/2 text-left">
                  <p className="text-sm leading-6 text-slate-600">
                    Practical training + mentor guidance + placement support.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Learn job-ready skills with real projects and industry-level curriculum.
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Trusted by learners
                  </div>
                </div>

                {/* nodes */}
                <div className="whyNode whyNode--1">
                  <Node Icon={milestones[0].Icon} tone={milestones[0].tone} />
                </div>
                <div className="whyNode whyNode--2">
                  <Node Icon={milestones[1].Icon} tone={milestones[1].tone} />
                </div>
                <div className="whyNode whyNode--3">
                  <Node Icon={milestones[2].Icon} tone={milestones[2].tone} />
                </div>
                <div className="whyNode whyNode--4">
                  <Node Icon={milestones[3].Icon} tone={milestones[3].tone} />
                </div>
              </div>
            </div>

            {/* RIGHT: cards */}
            <div className="relative">
              <div className="absolute left-2 top-0 h-full w-[2px] bg-linear-to-b from-slate-200 via-slate-300/70 to-slate-200" />

              <div className="grid gap-5">
                {milestones.map((m) => (
                  <div key={m.id} className="relative pl-10">
                    <div className="absolute left-2 top-[28px] flex items-center">
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                      <span className="ml-2 h-[2px] w-10 bg-linear-to-r from-slate-300 to-slate-200" />
                    </div>

                    <FeatureCard id={m.id} title={m.title} desc={m.desc} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet */}
        <div className="lg:hidden">
          <div className="mx-auto max-w-3xl space-y-6">
            {milestones.map(({ id, title, desc, Icon, tone }) => (
              <div
                key={id}
                className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_18px_55px_rgba(2,6,23,0.08)] backdrop-blur"
              >
                <div className="shrink-0">
                  <Node Icon={Icon} tone={tone} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-linear-to-r from-secondary to-primary" />
                    {id}
                  </div>

                  <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
<Link
  href="/courses"
  className="btn btn-shine h-[48px] px-8 font-bold inline-flex items-center justify-center"
>
  EXPLORE OUR COURSES →
</Link>          <p className="mt-3 text-xs text-slate-500">
            Talk to our counselors for batch timings, fees, and placement support.
          </p>
        </div>
      </div>
    </section>
  );
}