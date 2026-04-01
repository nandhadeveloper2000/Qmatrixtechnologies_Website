"use client";

import React from "react";
import { futureSteps, type FutureStep } from "@/app/(site)/data/futureOfTech";

function StepCard({ step }: { step: FutureStep }) {
  const { id, title, desc, Icon, color } = step;

  return (
    <div
      className={[
        "group relative rounded-[26px] bg-white/85 backdrop-blur",
        "border shadow-[0_18px_50px_rgba(15,23,42,0.10)]",
        "px-7 pt-9 pb-7",
        "transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]",
      ].join(" ")}
      style={{ borderColor: `${color}33` }}
    >
      {/* top glow line */}
      <div
        className="absolute inset-x-6 -top-[1px] h-[2px] rounded-full opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      {/* hover light sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
        <div className="absolute -left-24 -top-24 h-56 w-56 rotate-12 bg-white/40 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* icon */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute -inset-2 rounded-full blur-xl opacity-40"
            style={{ backgroundColor: color }}
          />
          <div
            className="relative grid h-16 w-16 place-items-center rounded-full bg-white"
            style={{
              boxShadow: `0 14px 40px ${color}22`,
              border: `2px solid ${color}55`,
            }}
          >
            <span
              className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: color }}
              aria-label={`Step ${id}`}
              title={`Step ${id}`}
            >
              {id}
            </span>

            <Icon className="text-2xl" style={{ color }} />
          </div>
        </div>
      </div>

      {/* text */}
      <h3 className="mt-5 text-center text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-center text-sm leading-relaxed text-gray-600">{desc}</p>

      <div className="mt-6 flex justify-center">
        <div className="h-[3px] w-12 rounded-full opacity-70" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function Futureoftech() {
  const steps = futureSteps;

  return (
    <section className="relative overflow-hidden py-20">
      {/* background */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50 to-white" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-slate-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-[560px] rounded-full bg-slate-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Master the Future of Tech with Qmatrix Technologies
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Upskill in Cloud, Data Engineering, and Full-Stack Development with an
            industry-aligned curriculum designed for real outcomes.
          </p>
        </div>

        {/* ======================= DESKTOP (ROAD + CARDS) ======================= */}
        <div className="relative -mt-10 hidden lg:block">
          {/* fixed space so cards + road always fit */}
          <div className="relative min-h-[500px]">
            <svg
              className="absolute left-0 top-0 h-[300px] w-full"
              viewBox="0 0 1200 280"
              fill="none"
              aria-hidden="true"
            >
              {/* road base */}
              <path
                d="M120 205 C 260 205, 260 75, 420 75
                   C 580 75, 580 205, 740 205
                   C 900 205, 900 75, 1080 75"
                stroke="#000000"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* dashed center line */}
              <path
                d="M120 205 C 260 205, 260 75, 420 75
                   C 580 75, 580 205, 740 205
                   C 900 205, 900 75, 1080 75"
                stroke="#CBD5E1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 14"
                opacity="0.9"
              />

              {/* glow */}
              <defs>
                <linearGradient id="roadGlow" x1="120" y1="0" x2="1080" y2="0">
                  <stop stopColor={steps[0].color} stopOpacity="0.35" />
                  <stop offset="0.33" stopColor={steps[1].color} stopOpacity="0.28" />
                  <stop offset="0.66" stopColor={steps[2].color} stopOpacity="0.28" />
                  <stop offset="1" stopColor={steps[3].color} stopOpacity="0.32" />
                </linearGradient>
              </defs>

              <path
                d="M120 205 C 260 205, 260 75, 420 75
                   C 580 75, 580 205, 740 205
                   C 900 205, 900 75, 1080 75"
                stroke="url(#roadGlow)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.55"
              />

              {/* dots */}
              {[
                { x: 120, y: 205, c: steps[0].color },
                { x: 420, y: 75, c: steps[1].color },
                { x: 740, y: 205, c: steps[2].color },
                { x: 1080, y: 75, c: steps[3].color },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="22" fill="white" />
                  <circle cx={p.x} cy={p.y} r="14" fill={p.c} opacity="0.95" />
                  <circle cx={p.x} cy={p.y} r="22" stroke={p.c} strokeOpacity="0.25" />
                </g>
              ))}
            </svg>

            {/* cards area */}
            <div className="relative grid grid-cols-4 gap-10 pt-[210px]">
              {/* down (1) */}
              <div className="mt-10">
                <StepCard step={steps[0]} />
              </div>

              {/* up (2) */}
              <div className="-mt-15">
                <StepCard step={steps[1]} />
              </div>

              {/* down (3) */}
              <div className="mt-24">
                <StepCard step={steps[2]} />
              </div>

              {/* up (4) */}
              <div className="-mt-15">
                <StepCard step={steps[3]} />
              </div>
            </div>
          </div>
        </div>

        {/* ======================= MOBILE/TABLET ======================= */}
        <div className="mt-12 grid gap-6 lg:hidden">
          {steps.map((s) => (
            <div key={s.id}>
              <StepCard step={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}