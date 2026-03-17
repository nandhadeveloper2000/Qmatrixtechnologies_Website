"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { motion, MotionConfig, type Variants, useInView } from "framer-motion";

import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";

type CourseCategory = "New One" | "Recommended" | "Most Placed";

type Course = {
  _id: string;
  title: string;
  slug: string;
  category: CourseCategory;
  duration: string;
  modulesCount: string;
  rating: number;
  createdAt?: string;
  coverImage?: {
    url: string;
    alt?: string;
  };
};

type CoursesResponse = {
  data?: Course[];
  courses?: Course[];
};

type Filter = "All Courses" | CourseCategory;

const filters: Filter[] = ["All Courses", "New One", "Recommended", "Most Placed"];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 28 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

function getObjectIdTimestamp(id?: string) {
  if (!id || id.length < 8) return 0;

  const hex = id.slice(0, 8);
  const timestamp = Number.parseInt(hex, 16);

  return Number.isNaN(timestamp) ? 0 : timestamp * 1000;
}

function sortCoursesOldestFirst(list: Course[]) {
  return [...list].sort((a, b) => {
    const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (aCreatedAt && bCreatedAt) {
      return aCreatedAt - bCreatedAt;
    }

    return getObjectIdTimestamp(a._id) - getObjectIdTimestamp(b._id);
  });
}

function getBadgeClass(category: CourseCategory) {
  switch (category) {
    case "Recommended":
      return "bg-violet-600";
    case "Most Placed":
      return "bg-emerald-600";
    case "New One":
    default:
      return "bg-secondary";
  }
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("All Courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

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

        const data: CoursesResponse = await res.json();
        const rawCourses = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.courses)
          ? data.courses
          : [];

        const sortedCourses = sortCoursesOldestFirst(rawCourses);

        if (!ignore) {
          setCourses(sortedCourses);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load courses", err);
          setCourses([]);
          setError(err instanceof Error ? err.message : "Something went wrong");
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
    if (activeFilter === "All Courses") return courses;
    return courses.filter((course) => course.category === activeFilter);
  }, [activeFilter, courses]);

  return (
    <MotionConfig reducedMotion="never">
      <section className="bg-[#f5f6fa] py-16">
        <div ref={sectionRef} className="mx-auto max-w-6xl px-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <motion.div variants={fadeUp}>
              <p className="mb-3 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary">
                10+ Unique Online & Offline Courses
              </p>

              <h2 className="text-3xl font-bold text-gray-800">
                Our <span className="text-secondary">Featured</span> Courses
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-6 text-sm font-medium"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`border-b-2 pb-1 transition ${
                    activeFilter === filter
                      ? "border-secondary text-secondary"
                      : "border-transparent text-gray-600 hover:text-secondary"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {loading && (
            <div className="py-12 text-center text-gray-500">Loading courses...</div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 py-12 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
              No courses found.
            </div>
          )}

          {!loading && !error && filteredCourses.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCourses.map((course, index) => (
                <motion.article
                  key={course._id}
                  variants={popIn}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl"
                >
                  <Link href={`/course-detail/${course.slug}`} className="block">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={course.coverImage?.url || "/placeholder.jpg"}
                        alt={course.coverImage?.alt || course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />

                      <span
                        className={`absolute bottom-4 left-4 rounded-md px-3 py-1 text-xs text-white shadow ${getBadgeClass(
                          course.category
                        )}`}
                      >
                        {course.category}
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{course.modulesCount}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <h3 className="mb-2 text-base font-semibold text-[#082A5E]">
                      <Link href={`/course-detail/${course.slug}`}>{course.title}</Link>
                    </h3>

                    <div className="mb-2 text-sm text-yellow-400">
                      ★★★★★
                      <span className="ml-2 text-xs text-gray-500">({course.rating})</span>
                    </div>

                    <p className="mb-4 text-xs text-gray-500">
                      🏆 100% Placement assistance
                    </p>

                    <div className="mt-auto text-center">
                      <Link
                        href={`/course-detail/${course.slug}`}
                        className="text-sm font-medium text-secondary hover:underline"
                      >
                        See More →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}