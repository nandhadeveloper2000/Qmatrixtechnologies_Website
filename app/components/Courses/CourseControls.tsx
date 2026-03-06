"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "list";
type Filter = "All Courses" | "New One" | "Recommended" | "Most Placed";

const filters: Filter[] = [
  "All Courses",
  "New One",
  "Recommended",
  "Most Placed",
];

export default function CourseControls({
  activeFilter,
  setActiveFilter,
  query,
  setQuery,
  viewMode,
  setViewMode,
}: {
  activeFilter: Filter;
  setActiveFilter: (v: Filter) => void;
  query: string;
  setQuery: (v: string) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* ================= SEARCH ================= */}
      <div className="w-full sm:max-w-[420px]">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full rounded-md border border-[#3f4a7a] bg-white px-4 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center justify-end gap-3">
        {/* ================= DROPDOWN ================= */}
        <div ref={ddRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 min-w-[190px] items-center justify-between gap-3 rounded-md bg-[#eaf2ff] px-4 text-sm font-medium text-[#1e2a55] shadow-sm ring-1 ring-[#d7e6ff] transition hover:bg-[#e3eeff]"
          >
            <span>{activeFilter}</span>
            <ChevronDown
              size={18}
              className={`text-secondary transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 z-30 mt-2 w-[190px] origin-top overflow-hidden rounded-md border border-[#d7e6ff] bg-[#eaf2ff] shadow-xl transition-all duration-200 ${
              open
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            {filters.map((f) => {
              const active = f === activeFilter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-[#1f67d2] text-white"
                      : "text-[#1e2a55] hover:bg-[#dfeaff]"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= VIEW TOGGLE ================= */}
        <button
          type="button"
          onClick={() => setViewMode("grid")}
          className={`grid h-11 w-11 place-items-center rounded-md border transition ${
            viewMode === "grid"
              ? "border-secondary bg-secondary text-white"
              : "border-[#d7e6ff] bg-white text-secondary hover:bg-[#f3f7ff]"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid size={18} />
        </button>

        <button
          type="button"
          onClick={() => setViewMode("list")}
          className={`grid h-11 w-11 place-items-center rounded-md border transition ${
            viewMode === "list"
              ? "border-secondary bg-secondary text-white"
              : "border-[#d7e6ff] bg-white text-secondary hover:bg-[#f3f7ff]"
          }`}
          aria-label="List view"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
}