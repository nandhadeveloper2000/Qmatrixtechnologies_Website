"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { GraduationCap, Building2, Users, BadgeCheck } from "lucide-react";

type Stat = {
  icon: any;
  label: string;
  value: number; // ✅ number for animation
  suffix?: string;
  badge?: string;
};

const stats: Stat[] = [
  { icon: GraduationCap, label: "Students Trained", value: 10, suffix: "k+", badge: "Verified" },
  { icon: Building2, label: "Recruiting Companies", value: 100, suffix: "+", badge: "Trusted" },
  { icon: Users, label: "Expert Trainers", value: 50, suffix: "+", badge: "Certified" },
  { icon: BadgeCheck, label: "Placement Success", value: 100, suffix: "%", badge: "Proven" },
];

function AnimatedNumber({
  value,
  format = (n) => n.toString(),
  duration = 1.2,
  delay = 0,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;

    const controls = animate(mv, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // premium spring-like ease
    });

    return () => controls.stop();
  }, [inView, mv, value, duration, delay]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (!ref.current) return;
      ref.current.textContent = format(v);
    });
    return () => unsub();
  }, [rounded, format]);

  return <span ref={ref}>0</span>;
}

export default function QMatrixWayStats() {
  const maxValue = useMemo(() => Math.max(...stats.map((s) => s.value)), []);

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      {/* premium glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-[360px] w-[360px] rounded-full bg-[rgba(145,22,161,0.10)] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-[rgba(8,42,94,0.10)] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* glass container */}
        <div className="relative overflow-hidden rounded-[26px] border border-black/10 bg-white/70 shadow-[0_40px_120px_rgba(0,0,0,0.10)] backdrop-blur">
          {/* background gradient layer */}
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff,#f5f7fb)]" />
            <div className="absolute -left-10 top-0 h-[240px] w-[320px] rounded-[60px] bg-[rgba(145,22,161,0.08)] blur-2xl" />
            <div className="absolute -right-16 bottom-[-40px] h-[260px] w-[360px] rounded-[70px] bg-[rgba(8,42,94,0.07)] blur-2xl" />

            {/* subtle diagonal shine */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                clipPath: "polygon(55% 0, 70% 0, 45% 100%, 30% 100%)",
                background:
                  "linear-gradient(180deg, rgba(145,22,161,0.06), rgba(8,42,94,0.04))",
              }}
            />

            {/* top glossy line */}
            <div className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,rgba(145,22,161,0.35),rgba(8,42,94,0.25),rgba(145,22,161,0.35))] opacity-70" />
          </div>

          <div className="relative p-7 sm:p-10 lg:p-12">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-[rgba(8,42,94,0.85)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(145,22,161,0.9)]" />
                The QMatrix Way
              </p>

              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[rgba(8,42,94,1)] sm:text-3xl lg:text-4xl">
                Learn. Practice. Get Placed{" "}
                <span className="bg-[linear-gradient(90deg,#9116a1,#082a5e)] bg-clip-text text-transparent">
                  The QMatrix Way to Success
                </span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[rgba(8,42,94,0.75)] sm:text-base lg:text-lg">
                At QMatrix Technologies, we combine expert training, real-time projects, and career
                support to ensure every student learns with confidence, practices with purpose, and
                gets placed in top companies.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-4">
              {stats.map((s, idx) => {
                const Icon = s.icon;

                // ✅ formatting rules (k+ support etc.)
                const format = (n: number) => {
                  // if it's "k+" stat (10k+), show 0..10 only and suffix handles k+
                  // if you want 0..10000 instead, set value: 10000 and suffix: "+"
                  return n.toString();
                };

                // ✅ stagger duration slightly by size + index for premium feel
                const duration =
                  1.1 + (s.value / Math.max(1, maxValue)) * 0.45; // ~1.1s..1.55s

                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.06 }}
                    className="
                      group relative overflow-hidden rounded-2xl
                      border border-black/10 bg-white/75
                      shadow-[0_18px_60px_rgba(0,0,0,0.08)]
                      backdrop-blur
                      p-5 sm:p-6
                    "
                  >
                    {/* hover glow */}
                    <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-[rgba(145,22,161,0.14)] blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-[rgba(8,42,94,0.12)] blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* subtle moving shine on hover */}
                    <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-0 transition-all duration-500 group-hover:left-[110%] group-hover:opacity-70" />

                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(145,22,161,0.10)] ring-1 ring-black/10">
                        <Icon className="h-5 w-5 text-[rgba(145,22,161,1)]" />
                      </span>

                      {/* micro badge */}
                      <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-[rgba(8,42,94,0.75)]">
                        {s.badge ?? "Verified"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-end gap-1.5">
                        <span className="text-3xl font-extrabold tracking-tight text-[rgba(8,42,94,1)] sm:text-4xl">
                          <AnimatedNumber
                            value={s.value}
                            format={format}
                            duration={duration}
                            delay={0.08 + idx * 0.06}
                          />
                        </span>
                        {s.suffix ? (
                          <span className="pb-1 text-sm font-bold text-[rgba(145,22,161,1)] sm:text-base">
                            {s.suffix}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm font-semibold text-[rgba(8,42,94,0.70)]">
                        {s.label}
                      </p>
                    </div>

                    {/* bottom accent line */}
                    <div className="mt-4 h-[2px] w-full rounded-full bg-[linear-gradient(90deg,rgba(145,22,161,0.55),rgba(8,42,94,0.45))] opacity-70" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* border polish */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-black/10"
          />
        </div>
      </div>
    </section>
  );
}