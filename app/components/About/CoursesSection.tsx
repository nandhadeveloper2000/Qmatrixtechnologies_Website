// app/components/Home/CoursesSection.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { motion, MotionConfig, type Variants, useInView } from "framer-motion";

import { coursesData, filters, type Filter } from "@/app/(site)/data/courses";

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
  const [activeFilter, setActiveFilter] = useState<Filter>("All Courses");

  const filteredCourses = useMemo(() => {
    if (activeFilter === "All Courses") return coursesData;
    return coursesData.filter((c) => c.category === activeFilter);
  }, [activeFilter]);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <MotionConfig reducedMotion="never">
      <section className="bg-[#f5f6fa] py-16">
        <div ref={sectionRef} className="mx-auto max-w-6xl px-4">
          {/* Header */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <motion.div variants={fadeUp}>
              <p className="mb-3 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary">
                10+ Unique Online &amp; Offline Courses
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

          {/* Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCourses.map((course, index) => (
              <motion.article
                key={course.path}
                variants={popIn}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl"
              >
                {/* ✅ Make image area clickable */}
                <Link
                  href={`/course-detail/${course.path}`}
                  aria-label={`Open ${course.title} course detail`}
                  className="block"
                >
                  <div className="relative h-56 overflow-hidden">
                    {/* Shine overlay */}
                    <div className="shine-card absolute inset-0 z-2" />

                    {/* Image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 1.25 }}
                      animate={
                        inView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 1.25 }
                      }
                      transition={{ duration: 1.1, ease: EASE_OUT }}
                      className="absolute inset-0 z-1"
                    >
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="course-img object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        priority={index < 3}
                      />
                    </motion.div>

                    {/* Badge */}
                    <span
                      className={`absolute bottom-4 left-4 z-3 overflow-hidden rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium tracking-wide text-white shadow-lg backdrop-blur-md ${
                        course.category === "Recommended"
                          ? "bg-linear-to-r from-secondary to-[#a724e4]"
                          : course.category === "Most Placed"
                          ? "bg-linear-to-r from-emerald-500 to-green-600"
                          : "bg-linear-to-r from-primary to-secondary"
                      }`}
                    >
                      <span className="absolute inset-0 w-[40%] bg-linear-to-r from-transparent via-white/70 to-transparent animate-badgeSweep" />
                      <span className="relative z-10">{course.category}</span>
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                  className="flex flex-1 flex-col p-5"
                >
                  <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {course.modules}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                  </div>

                  {/* ✅ Make title clickable */}
                  <h3 className="mb-2 text-base font-semibold text-[#082A5E]">
                    <Link
                      href={`/course-detail/${course.path}`}
                      className="title-underline inline-block"
                    >
                      {course.title}
                    </Link>
                  </h3>

                  <div className="mb-2 flex items-center text-sm text-yellow-400">
                    ★★★★★
                    <span className="ml-2 text-xs text-gray-500">
                      ({course.rating})
                    </span>
                  </div>

                  <p className="mb-4 text-xs text-gray-500">
                    🏆 100% Placement assistance
                  </p>

                  <div className="mt-auto text-center">
                    {/* ✅ “See More” opens details */}
                    <Link
                      href={`/course-detail/${course.path}`}
                      className="text-sm font-medium text-secondary transition hover:underline"
                    >
                      See More →
                    </Link>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}