import EditBlogClient from "./EditBlogClient";
import SummaryApi from "@/app/constants/SummaryApi";

type BlogListItem = {
  _id: string;
};

type BlogListResponse = {
  success: boolean;
  data: BlogListItem[];
};

export async function generateStaticParams() {
  try {
    const endpoint = SummaryApi.admin_blogs;
    const res = await fetch(endpoint.url, {
      method: endpoint.method,
      cache: "force-cache",
    });

    if (!res.ok) return [];

    const json: BlogListResponse = await res.json();

    return (json.data || []).map((blog) => ({
      id: blog._id,
    }));
  } catch {
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditBlogClient id={id} />;
}