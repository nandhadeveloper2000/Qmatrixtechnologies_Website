"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Protected from "@/app/components/admin/Protected";
import CourseForm from "@/app/components/admin/CourseForm";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { Course } from "@/app/types/course";

type CourseResponse = {
  success: boolean;
  data?: Course;
  course?: Course;
};

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        if (!params?.id) return;

        setLoading(true);
        setError("");

        const endpoint = SummaryApi.admin_course_by_id(params.id);

        const res = await apiFetch<CourseResponse>(endpoint.url, {
          method: endpoint.method,
        });

        const courseData = res.data || res.course || null;
        setCourse(courseData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [params?.id]);

  async function handleUpdate(payload: Partial<Course>) {
    const endpoint = SummaryApi.update_course(params.id);

    await apiFetch(endpoint.url, {
      method: endpoint.method,
      json: payload,
    });

    router.push("/admin/courses");
  }

  return (
    <Protected allow={["ADMIN", "EDITOR"]}>
      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading course...
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : course ? (
        <CourseForm initialData={course} onSubmit={handleUpdate} />
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Course not found.
        </div>
      )}
    </Protected>
  );
}