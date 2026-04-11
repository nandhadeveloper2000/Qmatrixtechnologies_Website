"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Protected from "@/app/components/admin/Protected";
import BlogForm from "@/app/components/admin/BlogForm";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { IBlog } from "@/app/types/blog";

type BlogByIdResponse = {
  success: boolean;
  data: IBlog;
};

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const blogId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadBlog = useCallback(async () => {
    if (!blogId) {
      setError("Blog ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const endpoint = SummaryApi.admin_blog_by_id(blogId);

      const res = await apiFetch<BlogByIdResponse>(endpoint.url, {
        method: endpoint.method,
      });

      setBlog(res.data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch blog";
      setError(message);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  const handleUpdate = useCallback(
    async (payload: Partial<IBlog>) => {
      if (!blogId) return;

      try {
        setSubmitting(true);
        setError("");

        const endpoint = SummaryApi.update_blog(blogId);

        await apiFetch(endpoint.url, {
          method: endpoint.method,
          json: payload,
        });

        router.push("/admin/blogs");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update blog";
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [blogId, router]
  );

  useEffect(() => {
    void loadBlog();
  }, [loadBlog]);

  return (
    <Protected allow={["ADMIN", "EDITOR", "USER"]}>
      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading blog...
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : blog ? (
        <BlogForm
          initialData={blog}
          onSubmit={handleUpdate}
          submitting={submitting}
        />
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Blog not found.
        </div>
      )}
    </Protected>
  );
}