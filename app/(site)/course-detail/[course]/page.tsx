import { notFound } from "next/navigation";
import CourseDetailsBanner from "@/app/components/Courses/CourseDetails/CourseDetailsBanner";
import { coursesData } from "@/app/(site)/data/courses";
import CourseDetailsContent from "@/app/components/Courses/CourseDetails/CourseDetailsContent";

// required for output: "export"
export function generateStaticParams() {
  return coursesData.map((c) => ({ course: c.path }));
}

export const dynamicParams = false;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseParam } = await params;

  const course = coursesData.find((c) => c.path === courseParam);
  if (!course) return notFound();

  return (
    <main className="bg-white">
      <CourseDetailsBanner course={course} />
      <CourseDetailsContent course={course} />
    </main>
  );
}