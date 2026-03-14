"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Protected from "@/app/components/admin/Protected";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { ICourse } from "@/app/types/course";

type ApiError = {
  message?: string;
};

type CourseCreator = {
  name?: string;
  role?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  ) {
    return (error as ApiError).message || fallback;
  }

  return fallback;
}

function isCourseCreator(value: unknown): value is CourseCreator {
  return typeof value === "object" && value !== null;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;

    return courses.filter((course) => {
      return (
        (course.title?.toLowerCase().includes(q) ?? false) ||
        (course.slug?.toLowerCase().includes(q) ?? false) ||
        (course.category?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [courses, query]);

  async function loadCourses() {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch<{ success: boolean; data: ICourse[] }>(
        SummaryApi.admin_courses.url,
        { method: SummaryApi.admin_courses.method }
      );

      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to fetch courses"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) {
      setError("Invalid course id");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this course?");
    if (!ok) return;

    try {
      setDeletingId(id);
      setError("");

      await apiFetch(SummaryApi.delete_course(id).url, {
        method: SummaryApi.delete_course(id).method,
      });

      await loadCourses();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to delete course"));
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    void loadCourses();
  }, []);

  return (
    <Protected allow={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-600">
                Premium Workspace
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">Courses</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage course listing, publishing, image assets, and content
                metadata.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, slug, category..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 sm:w-80"
              />
              <Link
                href="/admin/courses/create"
                className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                + Add Course
              </Link>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-sm text-slate-500">Loading courses...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">No courses found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Course</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Mode</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Featured</th>
                    <th className="px-5 py-4">Created By</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCourses.map((course, index) => {
                    const courseId = course._id ?? `${course.slug ?? "course"}-${index}`;
                    const creator = isCourseCreator(course.createdBy)
                      ? course.createdBy
                      : null;

                    return (
                      <tr
                        key={courseId}
                        className="border-b last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-4">
                            {course.coverImage?.url ? (
                              <div className="relative h-16 w-24 overflow-hidden rounded-2xl border">
                                <Image
                                  src={course.coverImage.url}
                                  alt={course.coverImage.alt || course.title || "Course image"}
                                  fill
                                  className="object-cover"
                                  sizes="96px"
                                />
                              </div>
                            ) : (
                              <div className="flex h-16 w-24 items-center justify-center rounded-2xl border bg-slate-100 text-xs text-slate-500">
                                No Image
                              </div>
                            )}

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {course.title || "-"}
                              </h3>
                              <p className="mt-1 text-xs text-slate-500">
                                {course.slug || "-"}
                              </p>
                              {course.shortDesc ? (
                                <p className="mt-1 max-w-xl text-sm text-slate-600">
                                  {course.shortDesc}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {course.category || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {course.mode || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              course.isPublished
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              course.isFeatured
                                ? "bg-violet-100 text-violet-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {course.isFeatured ? "Featured" : "No"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {creator ? (
                            <div>
                              <p className="font-medium text-slate-900">
                                {creator.name || "-"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {creator.role || "-"}
                              </p>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {course.createdAt
                            ? new Date(course.createdAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {course._id ? (
                              <Link
                                href={`/admin/courses/edit/${course._id}`}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </Link>
                            ) : (
                              <span className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-400">
                                Edit
                              </span>
                            )}

                            <button
                              onClick={() => handleDelete(course._id)}
                              disabled={deletingId === course._id || !course._id}
                              className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === course._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Protected>
  );
}