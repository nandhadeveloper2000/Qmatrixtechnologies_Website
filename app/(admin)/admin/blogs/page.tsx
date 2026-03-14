"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Protected from "@/app/components/admin/Protected";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { IBlog } from "@/app/types/blog";

type BlogListResponse = {
  success?: boolean;
  data?: IBlog[];
  blogs?: IBlog[];
};

type BlogCreator = {
  _id?: string;
  name?: string;
  role?: string;
  email?: string;
};

function isBlogCreator(value: unknown): value is BlogCreator {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(date?: string): string {
  if (!date) return "-";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string>("");

  const filteredBlogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;

    return blogs.filter((blog) => {
      return (
        blog.title?.toLowerCase().includes(q) ||
        blog.slug?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q) ||
        blog.authorName?.toLowerCase().includes(q)
      );
    });
  }, [blogs, query]);

  async function loadBlogs(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch<BlogListResponse>(SummaryApi.admin_blogs.url, {
        method: SummaryApi.admin_blogs.method,
      });

      const items = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.blogs)
        ? res.blogs
        : [];

      setBlogs(items);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || "Failed to fetch blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: string): Promise<void> {
    if (!id) return;

    const ok = window.confirm("Are you sure you want to delete this blog?");
    if (!ok) return;

    try {
      setDeletingId(id);
      setError("");

      await apiFetch(SummaryApi.delete_blog(id).url, {
        method: SummaryApi.delete_blog(id).method,
      });

      setBlogs((prev) => prev.filter((item) => item._id !== id));
    } catch (error: unknown) {
      setError(getErrorMessage(error) || "Failed to delete blog");
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    void loadBlogs();
  }, []);

  return (
    <Protected allow={["ADMIN", "EDITOR", "USER"]}>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-600">
                Premium Workspace
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">Blogs</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage blog posts, SEO, FAQs, publishing, and author information.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, slug, category, author..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 sm:w-80"
              />
              <Link
                href="/admin/blogs/create"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                + Add Blog
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
            <div className="p-6 text-sm text-slate-500">Loading blogs...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">No blogs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Blog</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Author</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created By</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBlogs.map((blog) => {
                    const createdBy = isBlogCreator(blog.createdBy)
                      ? blog.createdBy
                      : null;

                    const previewText = stripHtml(blog.excerpt);

                    return (
                      <tr
                        key={blog._id}
                        className="border-b last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-4">
                            {blog.coverImage?.url ? (
                              <Image
                                src={blog.coverImage.url}
                                alt={blog.coverImage.alt || blog.title || "Blog cover"}
                                width={120}
                                height={80}
                                className="h-16 w-24 rounded-2xl border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-xs text-slate-500">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">
                              <h3 className="line-clamp-2 font-semibold text-slate-900">
                                {blog.title || "-"}
                              </h3>

                              <p className="mt-1 break-all text-xs text-slate-500">
                                {blog.slug || "-"}
                              </p>

                              {previewText ? (
                                <p className="mt-1 line-clamp-2 max-w-xl text-sm text-slate-600">
                                  {previewText}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {blog.category || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {blog.authorName || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              blog.isPublished
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {createdBy ? (
                            <div>
                              <p className="font-medium text-slate-900">
                                {createdBy.name || "-"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {createdBy.role || "-"}
                              </p>
                            </div>
                          ) : typeof blog.createdBy === "string" ? (
                            <span className="text-xs text-slate-400">
                              {blog.createdBy}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(blog.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/blogs/edit/${blog._id}`}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(blog._id)}
                              disabled={deletingId === blog._id}
                              className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === blog._id ? "Deleting..." : "Delete"}
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