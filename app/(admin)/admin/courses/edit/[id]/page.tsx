"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Protected from "@/app/components/admin/Protected";
import CourseForm from "@/app/components/admin/CourseForm";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { ICourse } from "@/app/types/course";

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCourse() {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch<{ success: boolean; data: ICourse }>(
        SummaryApi.admin_course_by_id(params.id).url,
        { method: SummaryApi.admin_course_by_id(params.id).method }
      );

      setCourse(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(payload: any) {
await apiFetch(SummaryApi.update_course(params.id).url, {
  method: SummaryApi.update_course(params.id).method,
  json: payload,
});
    router.push("/admin/courses");
  }

  useEffect(() => {
    if (params?.id) {
      loadCourse();
    }
  }, [params?.id]);

  return (
    <Protected allow={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Edit Course</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update course content, image, and publishing configuration.
          </p>
        </div>

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
      </div>
    </Protected>
  );
}