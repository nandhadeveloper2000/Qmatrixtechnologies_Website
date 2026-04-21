"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  ArrowRight,
  Star,
} from "lucide-react";
import { motion, MotionConfig, type Variants, useInView } from "framer-motion";

import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import type { Course, CourseCategory, CoursesListResponse } from "@/app/types/course";

type ViewMode = "grid" | "list";
type Filter = "All Courses" | CourseCategory;

const filters: Filter[] = ["All Courses", "New One", "Recommended", "Most Placed"];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getCourseImage(course: Course) {
  return course.coverImage?.url || "/images/course-placeholder.webp";
}

function getCourseAlt(course: Course) {
  return course.coverImage?.alt || course.title;
}

function badgeClass(cat?: string) {
  if (cat === "Recommended") {
    return "bg-gradient-to-r from-fuchsia-600 to-violet-600";
  }

  if (cat === "Most Placed") {
    return "bg-gradient-to-r from-emerald-500 to-green-600";
  }

  return "bg-gradient-to-r from-[#082A5E] to-[#7C3AED]";
}

function formatRating(rating?: number) {
  if (typeof rating !== "number") return "4.8";
  return rating.toFixed(1);
}

function getObjectIdTimestamp(id?: string) {
  if (!id || id.length < 8) return 0;

  const hex = id.slice(0, 8);
  const timestamp = Number.parseInt(hex, 16);

  if (Number.isNaN(timestamp)) return 0;
  return timestamp * 1000;
}

function sortCoursesOldestFirst(list: Course[]) {
  return [...list].sort((a, b) => {
    const aCreatedAt =
      "createdAt" in a && a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
    const bCreatedAt =
      "createdAt" in b && b.createdAt ? new Date(b.createdAt as string).getTime() : 0;

    if (aCreatedAt && bCreatedAt) {
      return aCreatedAt - bCreatedAt;
    }

    const aIdTime = getObjectIdTimestamp(String(a._id ?? ""));
    const bIdTime = getObjectIdTimestamp(String(b._id ?? ""));

    return aIdTime - bIdTime;
  });
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState<Filter>("All Courses");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [open, setOpen] = useState(false);

  const ddRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.18 });

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const endpoint = SummaryApi.public_courses;

        const res = await fetch(`${baseURL}${endpoint.url}`, {
          method: endpoint.method,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load courses");
        }

        const data: CoursesListResponse = await res.json();
        const list = data.data || data.courses || [];
        const normalizedCourses = Array.isArray(list) ? sortCoursesOldestFirst(list) : [];

        if (!ignore) {
          setCourses(normalizedCourses);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setCourses([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchCourses();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return courses.filter((c) => {
      const matchesFilter =
        activeFilter === "All Courses" ? true : c.category === activeFilter;

      const hay = [
        c.title,
        c.modulesCount,
        c.duration,
        String(c.rating ?? ""),
        c.category,
        stripHtml(c.description),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = q ? hay.includes(q) : true;

      return matchesFilter && matchesQuery;
    });
  }, [courses, activeFilter, query]);

  return (
    <MotionConfig reducedMotion="never">
      <section className="relative overflow-hidden bg-[#f6f8fc] py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-80px] top-12 h-48 w-48 rounded-full bg-[#7C3AED]/10 blur-3xl sm:h-60 sm:w-60 lg:h-72 lg:w-72" />
          <div className="absolute right-[-60px] top-28 h-48 w-48 rounded-full bg-[#0EA5E9]/10 blur-3xl sm:h-60 sm:w-60 lg:h-72 lg:w-72" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#A724E4]/10 blur-3xl sm:h-60 sm:w-60 lg:h-72 lg:w-72" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,42,94,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(8,42,94,0.03)_1px,transparent_1px)] bg-[size:34px_34px] sm:bg-[size:42px_42px]" />
        </div>

        <div ref={sectionRef} className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mb-8 rounded-[20px] border border-white/70 bg-white/80 p-3 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:mb-10 sm:rounded-[24px] sm:p-4 lg:p-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, categories, duration..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10 sm:h-12"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div ref={ddRef} className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 sm:h-12 sm:min-w-[190px] sm:w-auto"
                    aria-haspopup="menu"
                    aria-expanded={open}
                  >
                    <span className="truncate">{activeFilter}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <div
                      role="menu"
                      className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:left-auto sm:right-0 sm:w-[220px]"
                    >
                      {filters.map((f) => {
                        const active = f === activeFilter;

                        return (
                          <button
                            key={f}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setActiveFilter(f);
                              setOpen(false);
                            }}
                            className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition ${
                              active
                                ? "bg-secondary text-white"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`grid h-11 w-11 place-items-center rounded-2xl border transition sm:h-12 sm:w-12 ${
                      viewMode === "grid"
                        ? "border-secondary bg-secondary text-white shadow-lg shadow-secondary/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`grid h-11 w-11 place-items-center rounded-2xl border transition sm:h-12 sm:w-12 ${
                      viewMode === "list"
                        ? "border-secondary bg-secondary text-white shadow-lg shadow-secondary/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {loading && (
            <div className="rounded-[20px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:rounded-[24px] sm:p-12">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-secondary" />
              <p className="mt-4 text-sm text-slate-600">Loading courses...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[20px] border border-red-200 bg-red-50 p-8 text-center shadow-sm sm:rounded-[24px] sm:p-12">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="rounded-[20px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:rounded-[24px] sm:p-12">
              <p className="text-sm text-slate-600">No courses found.</p>
            </div>
          )}

          {!loading && !error && filteredCourses.length > 0 && viewMode === "grid" && (
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id || course.slug || `${course.title}-${index}`}
                  variants={cardIn}
                  className="group"
                >
                  <Link
                    href={`/course-detail/${course.slug}`}
                    className="block h-full"
                    aria-label={`Open ${course.title}`}
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)] sm:rounded-[24px] xl:rounded-[26px]">
                      <div className="relative h-52 overflow-hidden sm:h-56 lg:h-60">
                        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#08152f]/60 via-[#08152f]/10 to-transparent" />
                        <div className="absolute inset-0 z-[3] translate-x-[-100%] bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.20)_35%,transparent_60%)] opacity-0 transition duration-500 group-hover:translate-x-[100%] group-hover:opacity-100" />

                        <Image
                          src={getCourseImage(course)}
                          alt={getCourseAlt(course)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                          priority={index < 3}
                        />

                        {course.category && (
                          <span
                            className={`absolute left-3 top-3 z-[4] rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-lg sm:left-4 sm:top-4 sm:px-3.5 ${badgeClass(
                              course.category
                            )}`}
                          >
                            {course.category}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                            <BookOpen size={13} />
                            {course.modulesCount || "Modules TBA"}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                            <Clock size={13} />
                            {course.duration || "Flexible"}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                            <Star size={13} className="fill-current" />
                            {formatRating(course.rating)}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#082A5E] transition-colors duration-300 group-hover:text-secondary sm:text-lg">
                          {course.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                          {stripHtml(course.description) ||
                            "Practical industry-ready course with expert mentorship and strong career guidance."}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <span className="inline-flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                            🏆 {course.placementSupport ? "Placement assistance" : "Career guidance"}
                          </span>

                          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-secondary">
                            Explore
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && !error && filteredCourses.length > 0 && viewMode === "list" && (
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="flex flex-col gap-5 sm:gap-6"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id || course.slug || `${course.title}-${index}`}
                  variants={cardIn}
                >
                  <Link
                    href={`/course-detail/${course.slug}`}
                    className="block"
                    aria-label={`Open ${course.title}`}
                  >
                    <article className="group overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.13)] sm:rounded-[24px] xl:rounded-[26px]">
                      <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-6 lg:p-6">
                        <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-[18px] sm:h-56 sm:rounded-[20px] lg:h-44 lg:w-[300px] xl:w-[320px] xl:rounded-[22px]">
                          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#08152f]/45 via-transparent to-transparent" />

                          <Image
                            src={getCourseImage(course)}
                            alt={getCourseAlt(course)}
                            fill
                            sizes="(max-width: 1024px) 100vw, 320px"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            priority={index < 2}
                          />

                          {course.category && (
                            <span
                              className={`absolute left-3 top-3 z-[4] rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-lg sm:left-4 sm:top-4 sm:px-3.5 ${badgeClass(
                                course.category
                              )}`}
                            >
                              {course.category}
                            </span>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                              <BookOpen size={13} />
                              {course.modulesCount || "Modules TBA"}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                              <Clock size={13} />
                              {course.duration || "Flexible"}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                              <Star size={13} className="fill-current" />
                              {formatRating(course.rating)}
                            </span>
                          </div>

                          <h3 className="mt-4 text-lg font-bold tracking-tight text-[#082A5E] transition-colors duration-300 group-hover:text-secondary sm:text-xl">
                            {course.title}
                          </h3>

                          <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-7 text-slate-500">
                            {stripHtml(course.description) ||
                              "Practical industry-ready course with expert mentorship and strong career guidance."}
                          </p>

                          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                              🏆{" "}
                              {course.placementSupport
                                ? "100% Placement assistance"
                                : "Career guidance support"}
                            </span>

                            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-secondary">
                              View Course Details
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
        </div>
      </section>
    </MotionConfig>
  );
}