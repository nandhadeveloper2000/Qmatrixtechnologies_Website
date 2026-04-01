"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuPlus, LuMinus } from "react-icons/lu";
import { faqCategories } from "@/app/(site)/data/faqData";

export default function FAQSection() {
  const [activeCatId, setActiveCatId] = useState(faqCategories[0]?.id ?? "");
  const [activeQ, setActiveQ] = useState<number | null>(0);

  const activeCategory = useMemo(() => {
    return faqCategories.find((c) => c.id === activeCatId) ?? faqCategories[0];
  }, [activeCatId]);

  const onCategoryChange = (id: string) => {
    setActiveCatId(id);
    setActiveQ(0);
  };

  const onQuestionClick = (index: number) => {
    setActiveQ((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f8fc_0%,#f5f7ff_32%,#f3f6ff_100%)] px-4 py-14 sm:px-6 md:py-16">
      {/* Ambient premium background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-4rem] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),rgba(255,255,255,0.45),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center rounded-full border border-white/60 bg-white/55 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            Frequently Asked Questions
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl"
          >
            Everything you need,
            <span className="bg-gradient-to-r from-primary via-fuchsia-600 to-secondary bg-clip-text text-transparent">
              {" "}
              beautifully answered
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base"
          >
            Explore training, support, learning paths, and placement guidance
            through a refined premium experience.
          </motion.p>
        </div>

        {/* Main glass shell */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative mt-10 overflow-hidden rounded-[30px] border border-white/50 bg-white/40 shadow-[0_30px_90px_rgba(15,23,42,0.12)] ring-1 ring-white/30 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.45),rgba(255,255,255,0.12))]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-[31%] hidden w-px bg-gradient-to-b from-transparent via-white/60 to-transparent lg:block" />

          <div className="relative grid gap-5 p-4 md:p-5 lg:grid-cols-[260px_1fr] lg:gap-5 lg:p-6">
            {/* Categories */}
            <div className="rounded-[24px] border border-white/45 bg-white/38 p-3 shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-white/40 backdrop-blur-2xl">
              <div className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Categories
              </div>

              <div className="space-y-2.5">
                {faqCategories.map((cat) => {
                  const active = cat.id === activeCatId;

                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => onCategoryChange(cat.id)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.985 }}
                      className={[
                        "group relative flex w-full items-center justify-between overflow-hidden rounded-[20px] border px-3.5 py-3 text-left transition-all duration-300",
                        active
                          ? "border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,255,255,0.22))] shadow-[0_12px_28px_rgba(145,22,161,0.14)] ring-1 ring-primary/10"
                          : "border-white/45 bg-white/35 hover:bg-white/45 shadow-[0_6px_22px_rgba(15,23,42,0.04)]",
                      ].join(" ")}
                    >
                      {active && (
                        <>
                          <motion.span
                            layoutId="faqActiveCategoryBg"
                            className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-primary/14 via-fuchsia-400/10 to-secondary/14"
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                          />
                          <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-gradient-to-b from-primary to-fuchsia-500" />
                        </>
                      )}

                      <span
                        className={[
                          "relative z-10 text-[14px] font-semibold transition-colors",
                          active
                            ? "text-slate-900"
                            : "text-slate-700 group-hover:text-slate-900",
                        ].join(" ")}
                      >
                        {cat.label}
                      </span>

                      <span
                        className={[
                          "relative z-10 grid h-8 w-8 place-items-center rounded-xl border text-sm transition-all",
                          active
                            ? "border-white/70 bg-white/70 text-primary shadow-sm"
                            : "border-white/60 bg-white/50 text-slate-500 group-hover:text-primary",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Questions */}
            <div className="rounded-[24px] border border-white/45 bg-white/38 p-3 shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-white/40 backdrop-blur-2xl md:p-4">
              {/* Top meta panel */}
              <div className="mb-4 rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.22))] px-4 py-3.5 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Selected Category
                    </p>
                    <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900">
                      {activeCategory?.label}
                    </h3>
                  </div>

                  <div className="inline-flex rounded-full border border-white/60 bg-white/60 px-3.5 py-1.5 text-[11px] font-bold text-primary shadow-sm backdrop-blur-xl">
                    {activeCategory?.items?.length ?? 0} Questions
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {activeCategory?.items?.map((faq, index) => {
                  const isOpen = activeQ === index;

                  return (
                    <motion.div
                      key={`${activeCategory.id}-${index}`}
                      layout
                      transition={{ duration: 0.32, ease: "easeInOut" }}
                      className={[
                        "relative overflow-hidden rounded-[22px] border backdrop-blur-xl transition-all duration-300",
                        isOpen
                          ? "border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0.28))] shadow-[0_16px_40px_rgba(145,22,161,0.12)] ring-1 ring-primary/10"
                          : "border-white/50 bg-white/34 shadow-[0_6px_24px_rgba(15,23,42,0.04)] hover:bg-white/44",
                      ].join(" ")}
                    >
                      {isOpen && (
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                      )}

                      <button
                        type="button"
                        onClick={() => onQuestionClick(index)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left md:px-5"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[15px] font-semibold leading-7 text-slate-800 md:text-base">
                          {faq.q}
                        </span>

                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.05 : 1 }}
                          transition={{ duration: 0.24 }}
                          className={[
                            "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border transition-all",
                            isOpen
                              ? "border-white/70 bg-white/75 text-primary shadow-[0_8px_18px_rgba(145,22,161,0.12)]"
                              : "border-white/60 bg-white/55 text-slate-600",
                          ].join(" ")}
                        >
                          {isOpen ? (
                            <LuMinus className="text-[17px]" />
                          ) : (
                            <LuPlus className="text-[17px]" />
                          )}
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.34, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 md:px-5 md:pb-5">
                              <div className="h-px w-full bg-gradient-to-r from-primary/15 via-slate-200/80 to-transparent" />
                              <p className="pt-3 text-[14px] leading-7 text-slate-600 md:text-[15px]">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}