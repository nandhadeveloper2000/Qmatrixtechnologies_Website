"use client";

import { useRouter } from "next/navigation";
import { clearSession, getUser } from "@/app/lib/auth";
import { Bell, LogOut, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Topbar() {
  const router = useRouter();
  const user = getUser();

  function logout() {
    toast.success("Logged out successfully");
    clearSession();

    setTimeout(() => {
      router.replace("/admin/login");
    }, 500);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 px-6 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-700">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Workspace
          </div>

          <h1 className="mt-2 text-xl font-bold text-slate-900">
            Welcome {user?.name ?? user?.email ?? "Admin"}
          </h1>
          <p className="text-sm text-slate-500">
            Manage your platform securely and efficiently.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users, blogs, courses..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100 sm:w-72"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#082a5e,#9116a1,#8121fb)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(145,22,161,0.22)] transition hover:-translate-y-0.5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}