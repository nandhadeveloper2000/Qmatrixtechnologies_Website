export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white">
              <div className="aspect-16/8 animate-pulse bg-slate-200" />
              <div className="p-8">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-10 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-5 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 flex gap-3">
                <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
                <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
                <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}