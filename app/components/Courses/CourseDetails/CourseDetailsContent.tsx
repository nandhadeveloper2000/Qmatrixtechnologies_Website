"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Course } from "@/app/(site)/data/courses";
import { ChevronDown } from "lucide-react";

type TabKey = "overview" | "modules" | "features" | "trainers" | "review";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "modules", label: "Modules" },
  { key: "features", label: "Features" },
  { key: "trainers", label: "Trainers" },
  { key: "review", label: "Review" },
];

export default function CourseDetailsContent({ course }: { course: Course }) {
  const [active, setActive] = useState<TabKey>("overview");
  const [showMore, setShowMore] = useState(false);

  const sectionIds = useMemo(() => tabs.map((t) => t.key), []);
  const tabBarRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (id: TabKey) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = (tabBarRef.current?.offsetHeight ?? 64) + 110; // ✅ header+tabs offset
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  // auto-active tab on scroll
  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id as TabKey);
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-160px 0px -55% 0px",
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds]);

  return (
    <section className="bg-[#F4F5FB] z-50">
      <div className="mx-auto -mt-28 grid max-w-7xl gap-6 px-4 pb-12 md:grid-cols-[340px_1fr]">
        {/* SIDEBAR */}
        <aside
          className="h-fit rounded-[26px] border border-black/10 bg-white p-6
          shadow-[0_18px_60px_rgba(16,24,40,0.14)]
          md:sticky md:top-24"
        >
          <button className="w-full rounded-2xl bg-linear-to-r from-[#7C3AED] to-[#A21CAF] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]">
            APPLY NOW
          </button>

          <p className="mt-2 text-center text-xs text-gray-500">
            🧡 100% Placement assistance 🧡
          </p>

          <div className="mt-5 space-y-3 text-sm">
            <SideRow label="Duration" value={course.duration} />
            <SideRow label="Session Duration" value="2 Hours/day" />
            <SideRow label="Class Schedule" value="Monday to Friday" />
            <SideRow label="Mode" value="Offline/Online" />

            {showMore && (
              <>
                <SideRow label="Enrolled" value="1800+" />
                <SideRow label="Batch Size" value="Limited" />
              </>
            )}
          </div>

          <button
            onClick={() => setShowMore((s) => !s)}
            className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#6D28D9] hover:underline"
          >
            {showMore ? "Show Less" : "Show More"}
            <ChevronDown className={`h-4 w-4 transition ${showMore ? "rotate-180" : ""}`} />
          </button>

          <div className="my-6 h-px bg-gray-200" />

          <div className="rounded-2xl bg-[#F1EDFF] p-4 text-center ring-1 ring-black/5">
            <p className="text-xs text-gray-600">For details about the course</p>
            <p className="mt-1 text-sm font-semibold text-[#4C1D95]">
              Call Us: +91 80 86 651 651
            </p>
          </div>

          <button className="mt-5 w-full rounded-2xl bg-linear-to-r from-[#6D28D9] to-[#7C3AED] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]">
            DOWNLOAD BROCHURE
          </button>
        </aside>

        {/* CONTENT */}
        <div className="min-w-0 z-10">
          {/* Big OUTER CARD */}
          <div className="rounded-[28px] border border-black/10 bg-white shadow-[0_18px_55px_rgba(16,24,40,0.12)]">
            {/* TABS */}
            <div
              ref={tabBarRef}
              className="sticky top-20 z-20 rounded-t-[28px] bg-white/92 px-5 pt-5 backdrop-blur"
            >
              <div className="rounded-full bg-[#F3F4F8] p-1.5 ring-1 ring-black/5 overflow-x-auto">
                <div className="flex min-w-max gap-1">
                  {tabs.map((t) => {
                    const isActive = active === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => scrollTo(t.key)}
                        className={[
                          "rounded-full px-6 py-2.5 text-sm font-medium transition whitespace-nowrap",
                          isActive
                            ? "bg-linear-to-r from-[#7C3AED] to-[#A21CAF] text-white shadow-sm"
                            : "text-gray-600 hover:bg-white/70",
                        ].join(" ")}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="px-5 pb-8 pt-5 z-50">
              {/* Overview */}
              <ContentSection id="overview" title="What you’ll learn">
                <p className="text-sm leading-7 text-gray-600">
                  {course.overview ??
                    "This program focuses on fundamentals and practical job-ready skills with hands-on projects, real-world use cases, and interview preparation."}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(course.features ?? []).slice(0, 8).map((item) => (
                    <LearnChip key={item} text={item} />
                  ))}
                  {(course.support ?? []).map((item) => (
                    <LearnChip key={item} text={item} />
                  ))}
                </div>
              </ContentSection>

              {/* Modules */}
              <ContentSection id="modules" title="Course Content">
                <div className="space-y-3">
                  {(course.curriculum ?? []).map((m) => (
                    <details
                      key={m.title}
                      className="group rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {m.title}
                        </span>

                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F3F4F8] text-gray-700 ring-1 ring-black/5 transition group-open:rotate-180">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </summary>

                      <div className="mt-3 space-y-2 pl-1">
                        {m.topics.map((t) => (
                          <div key={t} className="text-sm text-gray-600">
                            • {t}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}

                  {!course.curriculum?.length && (
                    <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-gray-600">
                      Curriculum will be updated soon.
                    </div>
                  )}
                </div>
              </ContentSection>

              {/* Features */}
              <ContentSection id="features" title="Features">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(course.features ?? []).map((f) => (
                    <div
                      key={f}
                      className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-gray-900">{f}</p>
                      <p className="mt-1 text-xs leading-6 text-gray-600">
                        Hands-on tasks + real scenarios to make this skill production-ready.
                      </p>
                    </div>
                  ))}
                </div>

                {!!course.support?.length && (
                  <>
                    <h3 className="mt-7 text-base font-semibold text-gray-900">
                      Support & Career
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {course.support.map((s) => (
                        <LearnChip key={s} text={s} />
                      ))}
                    </div>
                  </>
                )}
              </ContentSection>

              {/* Trainers */}
              <ContentSection id="trainers" title="Trainers">
                <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-gray-600 shadow-sm">
                  Add trainer cards here (name, role, experience, LinkedIn, etc.).
                </div>
              </ContentSection>

              {/* Review */}
              <ContentSection id="review" title="Review">
                <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-gray-600 shadow-sm">
                  Add reviews/ratings component here (stars, testimonials, Google reviews).
                </div>
              </ContentSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Premium Sidebar Row ---------- */
function SideRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F3F4F8] px-3.5 py-2.5 ring-1 ring-black/5">
      <span className="text-gray-600">{label}</span>
      <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-black/5">
        {value}
      </span>
    </div>
  );
}

/* ---------- Content Section inside big card ---------- */
function ContentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mb-7 rounded-[22px] border border-black/10 bg-white p-6
      shadow-[0_10px_30px_rgba(16,24,40,0.06)]"
    >
      <h2 className="text-[18px] font-semibold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ---------- Overview chip like screenshot ---------- */
function LearnChip({ text }: { text: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-[18px]
      border border-black/10 bg-white px-4 py-3
      shadow-[0_10px_22px_rgba(16,24,40,0.06)]"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#16BB05]" />
      <p className="text-sm font-medium text-gray-800">{text}</p>
    </div>
  );
}