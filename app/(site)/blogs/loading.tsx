import BlogCardSkeleton from "@/app/components/Blogs/BlogCardSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-90 animate-pulse bg-slate-200" />
            <div className="p-8">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-8 w-4/5 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-5 w-5/6 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}