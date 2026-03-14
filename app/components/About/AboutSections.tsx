"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MoveRight } from "lucide-react";

import { WHY_ITEMS, ABOUT_COLLAGE } from "@/app/(site)/data/aboutSection";

export default function AboutSections() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* Animated soft glows */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-30 h-80 w-[320px] rounded-full bg-[rgba(167,36,228,0.14)] blur-3xl"
        animate={{ y: [0, 18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-35 h-90 w-90 rounded-full bg-[rgba(8,42,94,0.10)] blur-3xl"
        animate={{ y: [0, -16, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-2">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-lg bg-[rgba(145,22,161,0.08)] px-4 py-2 text-sm font-semibold text-[rgba(145,22,161,1)]">
            Who we are
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[rgba(8,42,94,1)] md:text-4xl">
            Provide{" "}
            <span className="bg-[linear-gradient(90deg,#9116a1,#a724e4,#082a5e)] bg-clip-text text-transparent">
              Quality Education
            </span>{" "}
            Services For You
          </h2>

          <p className="mt-4 text-base leading-relaxed text-black/70 md:text-lg">
            QMatrix Technologies shapes future tech talent with cutting-edge courses, structured
            mentorship, and placement-focused training—so students step confidently into the IT
            world.
          </p>

          <p className="mt-4 text-black/70">
            <span className="font-semibold text-[rgba(8,42,94,0.9)]">Learn. Practice. Get Placed —</span>{" "}
            the QMatrix way: expert trainers, real-time projects, and career support.
          </p>

          <div className="mt-4">
            <Link href="/about" className="text-sm font-semibold text-[rgba(145,22,161,1)] hover:opacity-80">
              read more
            </Link>
          </div>

          {/* Accordion */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={open}
              aria-controls="qmatrix-why-panel"
            >
              <span className="text-lg font-bold text-[rgba(145,22,161,1)]">
                Why QMatrix Technologies
              </span>

              <span className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white">
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-5 w-5 text-[rgba(145,22,161,1)]" />
                </motion.span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id="qmatrix-why-panel"
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <ul className="divide-y divide-black/10">
                      {WHY_ITEMS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <li key={idx} className="flex items-center gap-4 py-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(145,22,161,0.08)]">
                              <Icon className="h-5 w-5 text-[rgba(145,22,161,1)]" />
                            </div>

                            <p className="text-sm font-medium text-[rgba(8,42,94,0.9)]">
                              {item.href ? (
                                <>
                                  {item.text}{" "}
                                  <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-[rgba(145,22,161,1)] underline underline-offset-4"
                                  >
                                    (view)
                                  </a>
                                </>
                              ) : (
                                item.text
                              )}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-xl bg-[linear-gradient(90deg,#9116a1,#a724e4,#7c1fc4)] px-6 py-4 text-sm font-bold text-white shadow-[0_18px_50px_rgba(145,22,161,0.25)] transition hover:scale-[1.02] active:scale-[0.98]"
            >
              BECOME A STUDENT
              <MoveRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLLAGE */}
        <motion.div
          className="relative self-start lg:sticky lg:top-24"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-bl-[48px] bg-[#27d5ff]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.10)]">
                <Image
                  src={ABOUT_COLLAGE.main}
                  alt="Office"
                  width={900}
                  height={700}
                  className="h-80 w-full object-cover md:h-95"
                  priority
                />
              </div>
            </div>

            <div className="col-span-5 flex flex-col gap-5">
              <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.10)]">
                <Image
                  src={ABOUT_COLLAGE.small1}
                  alt="Office"
                  width={700}
                  height={520}
                  className="h-42.5 w-full object-cover md:h-47.5"
                />
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.10)]">
                <Image
                  src={ABOUT_COLLAGE.small2}
                  alt="Office"
                  width={700}
                  height={520}
                  className="h-42.5 w-full object-cover md:h-47.5"
                />
              </div>
            </div>
          </div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-6 top-12 h-10 w-10 rounded-full bg-[rgba(145,22,161,0.25)] blur-md"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}