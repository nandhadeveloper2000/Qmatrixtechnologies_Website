"use client";

import Protected from "@/app/components/admin/Protected";
import {
  Users,
  FileText,
  MessageSquareMore,
  ArrowUpRight,
  Activity,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Enquiries",
    value: "128",
    change: "+12.5%",
    icon: MessageSquareMore,
    glow: "from-fuchsia-500/20 via-violet-500/10 to-transparent",
    iconBg: "bg-fuchsia-500/15",
    iconColor: "text-fuchsia-300",
  },
  {
    title: "Total Blogs",
    value: "42",
    change: "+8.2%",
    icon: FileText,
    glow: "from-sky-500/20 via-blue-500/10 to-transparent",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-300",
  },
  {
    title: "Total Users",
    value: "1,284",
    change: "+18.4%",
    icon: Users,
    glow: "from-emerald-500/20 via-green-500/10 to-transparent",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-300",
  },
];

export default function AdminDashboard() {
  return (
    <Protected allow={["ADMIN", "EDITOR", "EMPLOYEE", "USER"]}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#071a38_0%,#082a5e_40%,#6b21a8_100%)] p-6 text-white shadow-[0_20px_70px_rgba(8,42,94,0.35)]">
          <div className="absolute -left-10 top-0 h-36 w-36 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                <ShieldCheck className="h-4 w-4 text-fuchsia-300" />
                QMTechnologies Admin
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome to your premium admin dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Monitor platform activity, track users, manage content, and
                control operations from one secure workspace.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="rounded-xl bg-white/10 p-2">
                <Activity className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs text-white/60">System Status</p>
                <p className="text-sm font-semibold text-white">All services operational</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#081a36]/80 p-5 text-white shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-100`}
                />
                <div className="relative z-10">
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className={`rounded-2xl ${item.iconBg} p-3 ring-1 ring-white/10`}
                    >
                      <Icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                      {item.change}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-300">{item.title}</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    {item.value}
                  </h2>
                  <p className="mt-2 text-xs text-slate-400">
                    Compared to last 30 days
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[26px] border border-white/10 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Overview
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              This section can show charts, latest enquiries, blog performance,
              and user activity.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">
                  New enquiries today
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">24</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">
                  New users this week
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">86</p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-[#081a36]/90 p-6 text-white shadow-[0_12px_40px_rgba(2,6,23,0.35)]">
            <h3 className="text-lg font-semibold">Admin Notes</h3>
            <p className="mt-1 text-sm text-white/65">
              Add reminders, quick links, or operational notes here.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium">Review pending enquiries</p>
                <p className="mt-1 text-xs text-white/55">
                  Prioritize leads from the homepage contact form.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium">Publish latest course blog</p>
                <p className="mt-1 text-xs text-white/55">
                  Update featured content for upcoming batches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}