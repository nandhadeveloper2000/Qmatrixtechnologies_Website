"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { cldPublic } from "@/app/lib/cloudinary";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
} from "lucide-react";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";

type NavChild = {
  name: string;
  path: string;
  image?: string;
  alt?: string;
};

type NavItem = {
  name: string;
  path?: string;
  children?: NavChild[];
};

type HeaderVariant = "Qmatrix" | "luminar";

type ApiCourse = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
  position?: number;
  displayOrder?: number;
  coverImage?: {
    url?: string;
    public_id?: string;
    alt?: string;
  };
};

type CourseMenuItem = {
  id: string;
  name: string;
  path: string;
  image?: string;
  alt?: string;
};

const NAV_VARIANT =
  (process.env.NEXT_PUBLIC_HEADER_VARIANT as HeaderVariant) ?? "luminar";

const CALL_NUMBER = "+919943532532";
const MOBILE_HEADER_HEIGHT = 76;
const DESKTOP_HEADER_HEIGHT = 84;
const DESKTOP_HEADER_HEIGHT_SCROLLED = 72;
const DESKTOP_TOPBAR_HEIGHT = 40;

const cleanText = (value?: string): string =>
  typeof value === "string" ? value.replace(/^"+|"+$/g, "").trim() : "";

const getCourseImage = (course: ApiCourse): string | undefined => {
  const imageUrl = course.coverImage?.url;
  return typeof imageUrl === "string" && imageUrl.trim() ? imageUrl : undefined;
};

const getCourseImageAlt = (course: ApiCourse): string | undefined => {
  const imageAlt = course.coverImage?.alt;
  return typeof imageAlt === "string" && imageAlt.trim()
    ? imageAlt
    : cleanText(course.title || course.name || "Course image");
};

const getCourseSortValue = (course: ApiCourse): number => {
  if (typeof course.displayOrder === "number") return course.displayOrder;
  if (typeof course.order === "number") return course.order;
  if (typeof course.position === "number") return course.position;
  return Number.MAX_SAFE_INTEGER;
};

const sortCourses = (courses: ApiCourse[]): ApiCourse[] => {
  return [...courses].sort((a, b) => {
    const aOrder = getCourseSortValue(a);
    const bOrder = getCourseSortValue(b);

    if (aOrder !== bOrder) return aOrder - bOrder;

    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return aCreated - bCreated;
  });
};

const normalizeCourse = (
  course: ApiCourse,
  index: number
): CourseMenuItem | null => {
  const rawTitle = cleanText(course.title || course.name);
  const rawSlug = cleanText(course.slug);

  if (!rawTitle || !rawSlug) return null;

  return {
    id: course._id || course.id || `${rawSlug}-${index}`,
    name: rawTitle,
    path: `/course-detail/${rawSlug}`,
    image: getCourseImage(course),
    alt: getCourseImageAlt(course),
  };
};

export default function Navbar() {
  const pathname = usePathname();
  const variant = NAV_VARIANT;

  const [isOpen, setIsOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<string | null>(null);
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [courseMenuItems, setCourseMenuItems] = useState<NavChild[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  const navItems: NavItem[] = useMemo(
    () => [
      { name: "Home", path: "/" },
      {
        name: "Courses",
        path: "/courses",
        children: courseMenuItems,
      },
      { name: "Placements", path: "/placements" },
      { name: "Blogs", path: "/blogs" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact-us" },
    ],
    [courseMenuItems]
  );

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const SOCIALS = useMemo(
    () => [
      {
        name: "Instagram",
        href: "https://www.instagram.com/qmatrixtech/",
        Icon: Instagram,
      },
      { name: "Call", href: `tel:${CALL_NUMBER}`, Icon: Phone },
      { name: "Email", href: "mailto:info@qmatrixtechnologies.com", Icon: Mail },
    ],
    []
  );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!desktopNavRef.current) return;
      if (!desktopNavRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDesktopMenuOpen(null);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 20);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);

        const response = await fetch(`${baseURL}${SummaryApi.public_courses.url}`, {
          method: SummaryApi.public_courses.method,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        const result = await response.json();

        const rawList = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.courses)
              ? result.courses
              : Array.isArray(result?.data?.courses)
                ? result.data.courses
                : [];

        const sortedCourses = sortCourses(rawList as ApiCourse[]);

        const mappedCourses = sortedCourses
          .map((course: ApiCourse, index: number) =>
            normalizeCourse(course, index)
          )
          .filter(Boolean) as CourseMenuItem[];

        const dynamicChildren: NavChild[] = mappedCourses.map((course) => ({
          name: course.name,
          path: course.path,
          image: course.image,
          alt: course.alt,
        }));

        if (active) {
          setCourseMenuItems(dynamicChildren);
        }
      } catch (error) {
        console.error("Failed to fetch public courses:", error);
        if (active) setCourseMenuItems([]);
      } finally {
        if (active) setCoursesLoading(false);
      }
    };

    fetchCourses();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
          scrolled
            ? "bg-white/90 shadow-[0_16px_40px_rgba(2,6,23,0.10)] backdrop-blur-xl"
            : "bg-white/80 shadow-[0_10px_28px_rgba(2,6,23,0.06)] backdrop-blur-md",
        ].join(" ")}
      >
        <div
          className={[
            "hidden overflow-hidden transition-all duration-300 ease-out lg:block",
            scrolled
              ? "pointer-events-none max-h-0 -translate-y-2 opacity-0"
              : "max-h-12 translate-y-0 opacity-100",
          ].join(" ")}
        >
          <div
            className="h-10 bg-[linear-gradient(90deg,#082a5e_0%,#9116a1_100%)] text-white shadow-[0_6px_20px_rgba(8,42,94,0.18)]"
            style={{ height: DESKTOP_TOPBAR_HEIGHT }}
          >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6 text-[13px] font-medium">
                <a
                  href={`tel:${CALL_NUMBER}`}
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
                  aria-label="Call Qmatrix Technologies"
                >
                  <Phone size={14} />
                  <span>+91 99435 32532</span>
                </a>

                <a
                  href="mailto:info@qmatrixtechnologies.com"
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
                  aria-label="Email Qmatrix Technologies"
                >
                  <Mail size={14} />
                  <span>info@qmatrixtechnologies.com</span>
                </a>
              </div>

              <a
                href="https://www.instagram.com/qmatrixtech/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-90"
                aria-label="Open Instagram"
              >
                <Instagram size={14} />
                <span>@qmatrixtech</span>
              </a>
            </div>
          </div>
        </div>

        <div
          className={[
            "transition-all duration-300 ease-out",
            scrolled ? "border-b border-black/5" : "border-b border-transparent",
          ].join(" ")}
        >
          <div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            ref={desktopNavRef}
          >
            <div
              className={[
                "flex items-center gap-3 transition-all duration-300 ease-out lg:gap-4",
                scrolled ? "h-[72px]" : "h-[76px] lg:h-[84px]",
              ].join(" ")}
            >
              <Link href="/" className="flex min-w-0 shrink-0 items-center">
                <Image
                  src={cldPublic("qmatrix/logo.png", "f_auto,q_auto,w_1000")}
                  alt="Qmatrix Technologies Logo"
                  width={250}
                  height={70}
                  priority
                  className="h-auto w-[160px] object-contain xs:w-[170px] sm:w-[200px] md:w-[220px] lg:w-[280px]"
                />
              </Link>

              <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
                <nav className="min-w-0">
                  <ul className="flex items-center gap-1 xl:gap-2 whitespace-nowrap">
                    {navItems.map((item) => {
                      const active =
                        isActive(item.path) ||
                        item.children?.some((child) => isActive(child.path));
                      const isMegaOpen = desktopMenuOpen === item.name;
                      const hasChildren = !!item.children?.length;

                      if (item.name === "Courses") {
                        return (
                          <li
                            key={item.name}
                            className="relative"
                            onMouseEnter={() => setDesktopMenuOpen(item.name)}
                            onMouseLeave={() => setDesktopMenuOpen(null)}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setDesktopMenuOpen((prev) =>
                                  prev === item.name ? null : item.name
                                )
                              }
                              className={[
                                "group relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all duration-300",
                                active
                                  ? "bg-[color-mix(in_srgb,var(--tg-theme-primary)_10%,white)] text-[var(--tg-theme-primary)]"
                                  : "text-slate-800 hover:bg-slate-100/90 hover:text-[var(--tg-theme-primary)]",
                              ].join(" ")}
                            >
                              <span>{item.name}</span>

                              <ChevronDown
                                size={16}
                                className={[
                                  "transition-transform duration-300",
                                  isMegaOpen ? "rotate-180" : "rotate-0",
                                ].join(" ")}
                              />

                              <span
                                className={[
                                  "absolute left-1/2 -bottom-0.5 h-[3px] -translate-x-1/2 rounded-full bg-[var(--tg-theme-primary)] transition-all duration-300",
                                  active || isMegaOpen
                                    ? "w-8 opacity-100"
                                    : "w-0 opacity-0",
                                ].join(" ")}
                              />
                            </button>

                            <div
                              className={[
                                "absolute left-1/2 top-full z-50 mt-4 w-[960px] xl:w-[1100px] -translate-x-[34%] transition-all duration-300",
                                isMegaOpen
                                  ? "visible translate-y-0 opacity-100"
                                  : "invisible translate-y-3 opacity-0",
                              ].join(" ")}
                            >
                              <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_28px_80px_rgba(2,6,23,0.16)] backdrop-blur-xl">
                                <div className="grid grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
                                  <div className="bg-[linear-gradient(180deg,rgba(8,42,94,1)_0%,rgba(145,22,161,1)_100%)] p-7 text-white">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                                      Explore
                                    </p>
                                    <h3 className="mt-3 text-2xl font-bold leading-tight">
                                      Courses
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-white/80">
                                      Premium job-focused training paths,
                                      mentorship, and real-world learning
                                      modules.
                                    </p>

                                    <Link
                                      href="/courses"
                                      className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[rgba(8,42,94,1)] transition hover:scale-[1.02]"
                                    >
                                      View Courses
                                    </Link>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 p-6">
                                    {coursesLoading ? (
                                      <>
                                        {Array.from({ length: 6 }).map((_, index) => (
                                          <div
                                            key={index}
                                            className="rounded-2xl border border-slate-200 bg-white p-3"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="h-16 w-24 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                                              <div className="min-w-0 flex-1">
                                                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                                                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    ) : courseMenuItems.length > 0 ? (
                                      courseMenuItems.map((child) => {
                                        const childActive = isActive(child.path);

                                        return (
                                          <Link
                                            key={child.path}
                                            href={child.path}
                                            className={[
                                              "group rounded-2xl border bg-white p-3 transition-all duration-300",
                                              childActive
                                                ? "border-[var(--tg-theme-primary)] bg-[color-mix(in_srgb,var(--tg-theme-primary)_8%,white)]"
                                                : "border-slate-200 hover:-translate-y-0.5 hover:border-[var(--tg-theme-primary)] hover:shadow-[0_14px_30px_rgba(2,6,23,0.08)]",
                                            ].join(" ")}
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                {child.image ? (
                                                  <Image
                                                    src={child.image}
                                                    alt={child.alt || child.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                  />
                                                ) : (
                                                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(8,42,94,0.10),rgba(145,22,161,0.10))] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--tg-theme-primary)]">
                                                    QM
                                                  </div>
                                                )}
                                              </div>

                                              <div className="min-w-0 flex-1">
                                                <h4
                                                  className={[
                                                    "line-clamp-2 text-[15px] font-semibold leading-5 transition-colors duration-300",
                                                    childActive
                                                      ? "text-[var(--tg-theme-primary)]"
                                                      : "text-slate-900 group-hover:text-[var(--tg-theme-primary)]",
                                                  ].join(" ")}
                                                >
                                                  {child.name}
                                                </h4>
                                              </div>
                                            </div>
                                          </Link>
                                        );
                                      })
                                    ) : (
                                      <div className="col-span-2 flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                                        <div>
                                          <p className="text-sm font-semibold text-slate-700">
                                            No courses available
                                          </p>
                                          <p className="mt-1 text-sm text-slate-500">
                                            Published courses will appear here.
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      }

                      if (hasChildren) {
                        return (
                          <li
                            key={item.name}
                            className="relative"
                            onMouseEnter={() => setDesktopMenuOpen(item.name)}
                            onMouseLeave={() => setDesktopMenuOpen(null)}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setDesktopMenuOpen((prev) =>
                                  prev === item.name ? null : item.name
                                )
                              }
                              className={[
                                "group relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all duration-300",
                                active
                                  ? "bg-[color-mix(in_srgb,var(--tg-theme-primary)_10%,white)] text-[var(--tg-theme-primary)]"
                                  : "text-slate-800 hover:bg-slate-100/90 hover:text-[var(--tg-theme-primary)]",
                              ].join(" ")}
                            >
                              <span>{item.name}</span>

                              <ChevronDown
                                size={16}
                                className={[
                                  "transition-transform duration-300",
                                  isMegaOpen ? "rotate-180" : "rotate-0",
                                ].join(" ")}
                              />

                              <span
                                className={[
                                  "absolute left-1/2 -bottom-0.5 h-[3px] -translate-x-1/2 rounded-full bg-[var(--tg-theme-primary)] transition-all duration-300",
                                  active || isMegaOpen
                                    ? "w-8 opacity-100"
                                    : "w-0 opacity-0",
                                ].join(" ")}
                              />
                            </button>
                          </li>
                        );
                      }

                      return (
                        <li key={item.name}>
                          <Link
                            href={item.path!}
                            className={[
                              "group relative inline-flex items-center rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all duration-300",
                              active
                                ? "bg-[color-mix(in_srgb,var(--tg-theme-primary)_10%,white)] text-[var(--tg-theme-primary)]"
                                : "text-slate-800 hover:bg-slate-100/90 hover:text-[var(--tg-theme-primary)]",
                            ].join(" ")}
                          >
                            <span>{item.name}</span>

                            <span
                              className={[
                                "absolute left-1/2 -bottom-0.5 h-[3px] -translate-x-1/2 rounded-full bg-[var(--tg-theme-primary)] transition-all duration-300",
                                active
                                  ? "w-8 opacity-100"
                                  : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100",
                              ].join(" ")}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div className="hidden shrink-0 items-center lg:flex">
                {variant === "Qmatrix" ? (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenEnquiry(true);
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  >
                    ENQUIRE NOW
                  </Link>
                ) : (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenEnquiry(true);
                    }}
                    className="btn btn-shine"
                  >
                    ENQUIRE NOW
                  </Link>
                )}
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="ml-auto inline-flex items-center justify-center rounded-xl p-2.5 transition hover:bg-white/60 active:scale-[0.98] lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={28} style={{ color: "var(--tg-theme-primary)" }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={[
          "fixed right-0 top-0 z-50 h-dvh w-[92vw] max-w-[380px] bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-5">
            <Image
              src={cldPublic("qmatrix/logo.png", "f_auto,q_auto,w_1000")}
              alt="Qmatrix Technologies Logo"
              width={200}
              height={60}
              className="h-auto w-[135px] object-contain xs:w-[145px] sm:w-[160px]"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2.5 transition hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} style={{ color: "var(--tg-theme-primary)" }} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="px-4 py-5 sm:px-5">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  if (item.name === "Courses") {
                    return (
                      <div key={item.name} className="pt-1">
                        <Link
                          href="/courses"
                          onClick={() => setIsOpen(false)}
                          className={[
                            "block rounded-xl px-3 py-2.5 text-[16px] font-semibold transition hover:bg-black/5",
                            isActive("/courses") ||
                            item.children?.some((child) => isActive(child.path))
                              ? "text-[var(--tg-theme-primary)]"
                              : "text-slate-800",
                          ].join(" ")}
                        >
                          Courses
                        </Link>

                        <div className="mt-2 rounded-2xl bg-slate-50/90 p-2">
                          <p className="px-2 pb-2 text-[11px] font-bold tracking-[0.18em] text-slate-400">
                            COURSE LIST
                          </p>

                          {coursesLoading ? (
                            <div className="space-y-2 px-2 pb-2">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                  key={index}
                                  className="h-11 animate-pulse rounded-xl bg-slate-200/70"
                                />
                              ))}
                            </div>
                          ) : item.children && item.children.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.path}
                                  href={child.path}
                                  onClick={() => setIsOpen(false)}
                                  className={[
                                    "rounded-xl px-3 py-3 text-[15px] font-semibold leading-6 transition",
                                    isActive(child.path)
                                      ? "bg-white text-[var(--tg-theme-primary)] shadow-sm"
                                      : "text-slate-800 hover:bg-white",
                                  ].join(" ")}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="px-3 py-3 text-sm text-slate-500">
                              No courses available
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.path!}
                      onClick={() => setIsOpen(false)}
                      className={[
                        "rounded-xl px-3 py-2.5 text-[16px] font-semibold transition hover:bg-black/5",
                        isActive(item.path)
                          ? "text-[var(--tg-theme-primary)]"
                          : "text-slate-800",
                      ].join(" ")}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-black/5 bg-gradient-to-b from-white to-slate-50 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-4 sm:px-5">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                setOpenEnquiry(true);
              }}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--tg-theme-primary)] px-6 text-center text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(2,6,23,0.18)] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              ENQUIRE NOW
            </Link>

            <div className="mt-4">
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400">
                FOLLOW US
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(2,6,23,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300"
                    aria-label={name}
                    title={name}
                  >
                    <Icon size={19} style={{ color: "var(--tg-theme-primary)" }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <EnquiryPopup open={openEnquiry} onClose={() => setOpenEnquiry(false)} />

      <div
        className="h-[76px] lg:h-[124px]"
        style={{
          height: undefined,
        }}
      />
    </>
  );
}