import EditCourseClient from "./EditCourseClient";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";

type CourseListItem = {
  _id: string;
};

type CourseListResponse = {
  success: boolean;
  data?: CourseListItem[];
  courses?: CourseListItem[];
};

export async function generateStaticParams() {
  try {
    const endpoint = SummaryApi.admin_courses;

    const res = await fetch(`${baseURL}${endpoint.url}`, {
      method: endpoint.method,
      cache: "force-cache",
    });

    if (!res.ok) return [];

    const json: CourseListResponse = await res.json();
    const items = json.data || json.courses || [];

    return items.map((course) => ({
      id: course._id,
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
  return <EditCourseClient id={id} />;
}