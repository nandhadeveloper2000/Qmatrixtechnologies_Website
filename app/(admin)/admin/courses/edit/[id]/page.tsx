"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Protected from "@/app/components/admin/Protected";
import CourseForm, {
  type CourseSubmitPayload,
} from "@/app/components/admin/CourseForm";
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

  const courseId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const loadCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError("");

      const endpoint = SummaryApi.admin_course_by_id(courseId);

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
  }, [courseId]);

  async function handleUpdate(payload: CourseSubmitPayload) {
    if (!courseId) return;

    try {
      setError("");

      const endpoint = SummaryApi.update_course(courseId);

      const normalizedPayload: Partial<Course> = {
        ...payload,
        seo: payload.seo
          ? {
              ...payload.seo,
              schemaType: "Course",
            }
          : undefined,
      };

      await apiFetch(endpoint.url, {
        method: endpoint.method,
        json: normalizedPayload,
      });

      router.push("/admin/courses");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update course");
    }
  }

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

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