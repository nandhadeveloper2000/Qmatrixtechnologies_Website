"use client";

import React, { useMemo, useState } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { faqCategories } from "@/app/(site)/data/faqData";

export default function FAQSection() {
  const [activeCatId, setActiveCatId] = useState(faqCategories[0]?.id ?? "");
  const [activeQ, setActiveQ] = useState<number | null>(0); // default open first

  const activeCategory = useMemo(() => {
    return faqCategories.find((c) => c.id === activeCatId) ?? faqCategories[0];
  }, [activeCatId]);

  const activeItem =
    activeQ !== null ? activeCategory?.items?.[activeQ] : null;

  const onCategoryChange = (id: string) => {
    setActiveCatId(id);
    setActiveQ(0); // open first question for new category (like screenshot)
  };

  const onQuestionClick = (index: number) => {
    setActiveQ((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-[#f3f6fb] px-6 py-24">
      {/* background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background:radial-gradient(circle_at_1px_1px,rgba(17,24,39,.10)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            Everything you need to know about our courses, training approach, and
            placement support.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative mt-12 overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-secondary/10 via-sky-200/10 to-primary/10" />

          <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[300px_1fr]">
            {/* LEFT: Categories */}
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-wide text-gray-500">
                CATEGORIES
              </div>

              <div className="space-y-3">
                {faqCategories.map((cat) => {
                  const active = cat.id === activeCatId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onCategoryChange(cat.id)}
                      className={[
                        "group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                        active
                          ? "border-secondary/30 bg-white shadow-sm"
                          : "border-gray-200/70 bg-white/60 hover:bg-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "text-sm font-medium transition",
                          active
                            ? "text-primary"
                            : "text-gray-700 group-hover:text-primary",
                        ].join(" ")}
                      >
                        {cat.label}
                      </span>

                      <span
                        className={[
                          "grid h-7 w-7 place-items-center rounded-lg transition",
                          active
                            ? "bg-secondary/15 text-secondary"
                            : "bg-gray-100 text-gray-500",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Top answer + question list */}
            <div className="rounded-2xl border border-gray-200/60 bg-white/75 p-5 shadow-sm md:p-7">
              {/* TOP Answer Card (shows selected question) */}
              {activeItem && (
                <div className="mb-6 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold tracking-wide text-gray-500">
                        {activeCategory?.label}
                      </div>

                      <div className="mt-1 text-sm font-semibold text-primary md:text-base">
                        {activeItem.q}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        {activeItem.a}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveQ(null)}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-primary"
                      aria-label="Close answer"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* QUESTIONS LIST (no duplicate answers) */}
              <div className="divide-y divide-gray-200/70">
                {activeCategory?.items?.map((faq, index) => {
                  const isOpen = activeQ === index;
                  return (
                    <button
                      key={`${activeCategory.id}-${index}`}
                      type="button"
                      onClick={() => onQuestionClick(index)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-gray-800 transition hover:text-primary md:text-base">
                        {faq.q}
                      </span>

                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600">
                        {isOpen ? (
                          <LuMinus className="text-lg text-secondary" />
                        ) : (
                          <LuPlus className="text-lg" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Note */}
              <div className="mt-6 rounded-2xl bg-linear-to-r from-secondary/10 to-primary/10 p-4">
                <p className="text-xs leading-6 text-gray-600">
                  Still have questions? Contact our support team and we’ll help
                  you choose the right course.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8" />
      </div>
    </section>
  );
}