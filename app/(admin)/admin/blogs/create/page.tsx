"use client";

import { useRouter } from "next/navigation";
import Protected from "@/app/components/admin/Protected";
import BlogForm from "@/app/components/admin/BlogForm";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";

export default function CreateBlogPage() {
  const router = useRouter();

  async function handleCreate(payload: any) {
    await apiFetch(SummaryApi.create_blog.url, {
      method: SummaryApi.create_blog.method,
      json: payload,
    });

    router.push("/admin/blogs");
  }

  return (
    <Protected allow={["ADMIN", "EDITOR", "USER"]}>
      <BlogForm onSubmit={handleCreate} />
    </Protected>
  );
}