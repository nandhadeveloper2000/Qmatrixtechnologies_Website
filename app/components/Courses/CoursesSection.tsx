"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, ChevronDown, LayoutGrid, List } from "lucide-react";
import { motion, MotionConfig, type Variants, useInView } from "framer-motion";

import { coursesData, filters, type Filter } from "@/app/(site)/data/courses";

type ViewMode = "grid" | "list";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function CoursesSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All Courses");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // dropdown
  const [open, setOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return coursesData.filter((c) => {
      const matchesFilter =
        activeFilter === "All Courses" ? true : c.category === activeFilter;

      const hay = [c.title, c.modules, c.duration, c.rating, c.category]
        .join(" ")
        .toLowerCase();

      const matchesQuery = q ? hay.includes(q) : true;
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const badgeClass = (cat: string) =>
    cat === "Recommended"
      ? "bg-fuchsia-600"
      : cat === "Most Placed"
      ? "bg-linear-to-r from-emerald-500 to-green-600"
      : "bg-linear-to-r from-primary to-secondary";

  return (
    <MotionConfig reducedMotion="never">
      <section className="bg-[#f5f6fa] py-14 sm:py-16">
        <div ref={sectionRef} className="mx-auto max-w-6xl px-4">
          {/* Heading + Controls */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mb-8 flex flex-col gap-4"
          >
            <motion.div variants={fadeUp}>
              <p className="mb-3 inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                10+ Unique Online &amp; Offline Courses
              </p>

              <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Our <span className="text-secondary">Featured</span> Courses
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Search */}
              <div className="w-full sm:max-w-md">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="h-11 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-secondary"
                />
              </div>

              {/* Dropdown + View toggle */}
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                {/* Dropdown */}
                <div ref={ddRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex h-11 min-w-[170px] items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-gray-400"
                    aria-haspopup="menu"
                    aria-expanded={open}
                  >
                    <span>{activeFilter}</span>
                    <ChevronDown
                      size={18}
                      className={`transition ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <div
                      role="menu"
                      className="absolute right-0 z-20 mt-2 w-[210px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl"
                    >
                      {filters.map((f) => {
                        const active = f === activeFilter;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              setActiveFilter(f);
                              setOpen(false);
                            }}
                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition ${
                              active
                                ? "bg-secondary text-white"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            role="menuitem"
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`grid place-items-center rounded-md border px-3 py-3 transition ${
                      viewMode === "grid"
                        ? "border-secondary bg-secondary text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`grid place-items-center rounded-md border px-3 py-3 transition ${
                      viewMode === "list"
                        ? "border-secondary bg-secondary text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* GRID VIEW */}
          {viewMode === "grid" ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={`${course.title}-${index}`}
                  variants={cardIn}
                  className="group"
                >
                  {/* ✅ CLICKABLE CARD */}
                  <Link
                    href={`/course-detail/${course.path}/`}
                    className="block"
                    aria-label={`Open ${course.title}`}
                  >
                    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        {/* shine overlay (keep your css class) */}
                        <div className="shine-card absolute inset-0 z-[3]" />

                        <motion.div
                          initial={{ opacity: 0, scale: 1.18 }}
                          animate={
                            inView
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 1.18 }
                          }
                          transition={{ duration: 1.0, ease: EASE_OUT }}
                          className="absolute inset-0 z-[1]"
                        >
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="course-img object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            priority={index < 3}
                          />
                        </motion.div>

                        {/* badge */}
                        <span
                          className={`absolute bottom-4 left-4 z-[5] overflow-hidden rounded-md px-3 py-1.5 text-xs font-semibold text-white ${badgeClass(
                            course.category
                          )}`}
                        >
                          <span className="absolute inset-0 w-[45%] bg-linear-to-r from-transparent via-white/70 to-transparent animate-badgeSweep" />
                          <span className="relative z-10">{course.category}</span>
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-3 text-base font-semibold text-[#082A5E]">
                          <span className="title-underline">{course.title}</span>
                        </h3>

                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {course.modules}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            ★{" "}
                            <span className="text-gray-600">
                              ({course.rating})
                            </span>
                          </div>
                        </div>

                        <p className="mb-4 text-xs text-gray-500">
                          🏆 100% Placement assistance
                        </p>

                        <div className="mt-auto text-center">
                          <span className="text-sm font-medium text-secondary transition group-hover:underline">
                            See More..
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* LIST VIEW */
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="flex flex-col gap-8"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={`${course.title}-${index}`}
                  variants={cardIn}
                >
                  {/* ✅ CLICKABLE LIST CARD */}
                  <Link
                    href={`/course-detail/${course.path}/`}
                    className="block"
                    aria-label={`Open ${course.title}`}
                  >
                    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start">
                        {/* left image */}
                        <div className="relative h-44 w-full overflow-hidden rounded-lg sm:h-36 sm:w-[260px]">
                          <div className="shine-card absolute inset-0 z-[3]" />

                          <motion.div
                            initial={{ opacity: 0, scale: 1.15 }}
                            animate={
                              inView
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 1.15 }
                            }
                            transition={{ duration: 0.95, ease: EASE_OUT }}
                            className="absolute inset-0 z-[1]"
                          >
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 260px"
                              className="course-img object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              priority={index < 2}
                            />
                          </motion.div>

                          <span
                            className={`absolute bottom-3 left-3 z-[5] overflow-hidden rounded-md px-3 py-1.5 text-xs font-semibold text-white ${badgeClass(
                              course.category
                            )}`}
                          >
                            <span className="absolute inset-0 w-[45%] bg-linear-to-r from-transparent via-white/70 to-transparent animate-badgeSweep" />
                            <span className="relative z-10">{course.category}</span>
                          </span>
                        </div>

                        {/* right content */}
                        <div className="flex flex-1 flex-col">
                          <h3 className="text-lg font-bold tracking-wide text-[#082A5E] sm:text-xl">
                            <span className="title-underline">{course.title}</span>
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BookOpen size={16} />
                              {course.modules}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              ★{" "}
                              <span className="text-gray-600">
                                ({course.rating})
                              </span>
                            </div>
                          </div>

                          <p className="mt-3 text-sm text-gray-500">
                            {course.description}
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            🏆 <span>100% Placement assistance</span>
                          </div>

                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <span className="text-sm font-semibold text-secondary group-hover:underline">
                              See More..
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* empty state */}
          {filteredCourses.length === 0 && (
            <div className="mt-10 rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
              No courses found.
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}