import Protected from "@/app/components/admin/Protected";

export default function AdminCoursesPage() {
  return (
    <Protected allow={["ADMIN", "EDITOR"]}>
      <div className="rounded-2xl bg-white border p-6">
        <h2 className="text-lg font-semibold">Courses</h2>
        <p className="text-sm text-slate-600 mt-1">Courses listing here...</p>
      </div>
    </Protected>
  );
}