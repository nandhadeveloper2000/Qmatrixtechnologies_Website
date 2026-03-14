"use client";

import { useRouter } from "next/navigation";
import Protected from "@/app/components/admin/Protected";
import CourseForm from "@/app/components/admin/CourseForm";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";

export default function CreateCoursePage() {
  const router = useRouter();

  async function handleCreate(payload: any) {
await apiFetch(SummaryApi.create_course.url, {
  method: SummaryApi.create_course.method,
  json: payload,
});
    router.push("/admin/courses");
  }

  return (
    <Protected allow={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Create Course</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add a new course with image upload, publishing, and SEO settings.
          </p>
        </div>

        <CourseForm onSubmit={handleCreate} />
      </div>
    </Protected>
  );
}