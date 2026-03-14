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
  coverImage?: {
    url: string;
    alt?: string;
  };
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
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_OUT } },
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

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("All Courses");
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  /* ---------------- FETCH COURSES ---------------- */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const endpoint = SummaryApi.public_courses;

        const res = await fetch(`${baseURL}${endpoint.url}`, {
          method: endpoint.method,
          cache: "no-store",
        });

        const data = await res.json();

        const courseList = data?.data || data?.courses || [];

        setCourses(courseList);
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredCourses = useMemo(() => {
    if (activeFilter === "All Courses") return courses;
    return courses.filter((c) => c.category === activeFilter);
  }, [activeFilter, courses]);

  return (
    <MotionConfig reducedMotion="never">
      <section className="bg-[#f5f6fa] py-16">
        <div ref={sectionRef} className="mx-auto max-w-6xl px-4">

          {/* HEADER */}

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
                  onClick={() => setActiveFilter(filter)}
                  className={`transition pb-1 ${
                    activeFilter === filter
                      ? "text-secondary border-b-2 border-secondary"
                      : "text-gray-600 hover:text-secondary"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* LOADING */}

          {loading && (
            <div className="text-center text-gray-500 py-12">
              Loading courses...
            </div>
          )}

          {/* COURSES GRID */}

          {!loading && (
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

                  {/* IMAGE */}

                  <Link href={`/course-detail/${course.slug}`} className="block">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={course.coverImage?.url || "/placeholder.jpg"}
                        alt={course.coverImage?.alt || course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width:768px) 100vw, 33vw"
                        priority={index < 3}
                      />

                      {/* CATEGORY BADGE */}

                      <span className="absolute bottom-4 left-4 rounded-md bg-secondary px-3 py-1 text-xs text-white shadow">
                        {course.category}
                      </span>
                    </div>
                  </Link>

                  {/* CONTENT */}

                  <div className="flex flex-1 flex-col p-5">

                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {course.modulesCount}
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.duration}
                      </div>
                    </div>

                    <h3 className="mb-2 text-base font-semibold text-[#082A5E]">
                      <Link href={`/course-detail/${course.slug}`}>
                        {course.title}
                      </Link>
                    </h3>

                    <div className="mb-2 text-sm text-yellow-400">
                      ★★★★★
                      <span className="ml-2 text-xs text-gray-500">
                        ({course.rating})
                      </span>
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