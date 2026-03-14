"use client";

type SectionItem = {
  id: string;
  label: string;
  done?: boolean;
};

type Props = {
  items: SectionItem[];
  activeSection?: string;
};

export default function BlogFormProgress({ items, activeSection }: Props) {
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  const completed = items.filter((item) => item.done).length;
  const total = items.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className="sticky top-24">
      <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
        <div className="mb-5">
          <p className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">
            Form Progress
          </p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">
            Blog Builder
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Navigate sections and track completion.
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Completion
            </span>
            <span className="text-sm font-semibold text-violet-700">
              {percent}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {completed} of {total} sections completed
          </p>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-violet-300 bg-violet-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold ${
                      item.done
                        ? "bg-emerald-100 text-emerald-700"
                        : isActive
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.done ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>

                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    item.done
                      ? "bg-emerald-500"
                      : isActive
                      ? "bg-violet-500"
                      : "bg-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}