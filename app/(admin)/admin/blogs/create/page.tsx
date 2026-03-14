"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { BlogSubmitPayload } from "@/app/components/admin/BlogForm";

const BlogForm = dynamic(() => import("@/app/components/admin/BlogForm"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-slate-500">Loading blog editor...</div>
    </div>
  ),
});

export default function CreateBlogPage() {
  const router = useRouter();

  async function handleCreate(payload: BlogSubmitPayload) {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      SummaryApi.create_blog.url,
      {
        method: SummaryApi.create_blog.method,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res?.success) {
      throw new Error(res?.message || "Failed to create blog");
    }

    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-600">Admin / Blogs</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Create Blog
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new blog post with sections, FAQs, images, and publishing
          controls.
        </p>
      </div>

      <BlogForm onSubmit={handleCreate} />
    </div>
  );
}