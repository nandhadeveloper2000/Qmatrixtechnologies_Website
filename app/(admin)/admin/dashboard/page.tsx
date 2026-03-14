"use client";

import { useEffect, useMemo, useState } from "react";
import Protected from "@/app/components/admin/Protected";
import { apiFetch } from "@/app/lib/apiFetch";
import SummaryApi from "@/app/constants/SummaryApi";
import { getUser } from "@/app/lib/auth";
import {
  Users,
  FileText,
  MessageSquareMore,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  BookOpen,
  Mail,
} from "lucide-react";

type UserRole = "ADMIN" | "EDITOR" | "USER";

type RecentEnquiry = {
  _id?: string;
  full_name?: string;
  email?: string;
  mobile?: string;
  interested_course?: string;
  status?: "NEW" | "IN_PROGRESS" | "CLOSED";
  source?: string;
  created_at?: string;
};

type RecentUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
  avatar_url?: string | null;
  created_at?: string;
};

type RecentContactMessage = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  status?: "new" | "in_progress" | "completed" | "closed";
  createdAt?: string;
};

type AdminDashboardResponse = {
  success: boolean;
  message?: string;
  data: {
    totalEnquiries: number;
    totalBlogs: number;
    totalUsers: number;
    totalCourses: number;
    totalContactMessages: number;

    todayEnquiries: number;
    todayContactMessages: number;
    weeklyUsers: number;

    publishedBlogs: number;
    publishedCourses: number;

    recentEnquiries: RecentEnquiry[];
    recentUsers: RecentUser[];
    recentContactMessages: RecentContactMessage[];
  };
};

type DashboardData = AdminDashboardResponse["data"];

const initialDashboard: DashboardData = {
  totalEnquiries: 0,
  totalBlogs: 0,
  totalUsers: 0,
  totalCourses: 0,
  totalContactMessages: 0,

  todayEnquiries: 0,
  todayContactMessages: 0,
  weeklyUsers: 0,

  publishedBlogs: 0,
  publishedCourses: 0,

  recentEnquiries: [],
  recentUsers: [],
  recentContactMessages: [],
};

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Failed to load dashboard";
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData>(initialDashboard);

  const currentUser = useMemo(() => getUser(), []);
  const currentRole: UserRole = currentUser?.role ?? "USER";

  const isAdmin = currentRole === "ADMIN";
  const isEditor = currentRole === "EDITOR";
  const isUser = currentRole === "USER";

  const canViewUserStats = isAdmin;
  const canViewEnquiryStats = isAdmin || isUser;
  const canViewRecentUsers = isAdmin;
  const canViewRecentEnquiries = isAdmin || isUser;
  const canViewContactStats = isAdmin;
  const canViewRecentContacts = isAdmin;

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch<AdminDashboardResponse>(
          SummaryApi.admin_dashboard.url,
          {
            method: SummaryApi.admin_dashboard.method,
          }
        );

        if (ignore) return;

        if (!res?.success) {
          throw new Error(res?.message || "Failed to load dashboard");
        }

        setDashboard({
          totalEnquiries: Number(res.data?.totalEnquiries ?? 0),
          totalBlogs: Number(res.data?.totalBlogs ?? 0),
          totalUsers: Number(res.data?.totalUsers ?? 0),
          totalCourses: Number(res.data?.totalCourses ?? 0),
          totalContactMessages: Number(res.data?.totalContactMessages ?? 0),

          todayEnquiries: Number(res.data?.todayEnquiries ?? 0),
          todayContactMessages: Number(res.data?.todayContactMessages ?? 0),
          weeklyUsers: Number(res.data?.weeklyUsers ?? 0),

          publishedBlogs: Number(res.data?.publishedBlogs ?? 0),
          publishedCourses: Number(res.data?.publishedCourses ?? 0),

          recentEnquiries: Array.isArray(res.data?.recentEnquiries)
            ? res.data.recentEnquiries
            : [],
          recentUsers: Array.isArray(res.data?.recentUsers)
            ? res.data.recentUsers
            : [],
          recentContactMessages: Array.isArray(res.data?.recentContactMessages)
            ? res.data.recentContactMessages
            : [],
        });
      } catch (error: unknown) {
        if (!ignore) {
          setError(getErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const allStats = [
      {
        key: "enquiries",
        visible: canViewEnquiryStats,
        title: "Total Enquiries",
        value: loading ? "..." : dashboard.totalEnquiries.toLocaleString(),
        change: `+${dashboard.todayEnquiries}`,
        icon: MessageSquareMore,
        glow: "from-fuchsia-500/20 via-violet-500/10 to-transparent",
        iconBg: "bg-fuchsia-500/15",
        iconColor: "text-fuchsia-300",
      },
      {
        key: "contacts",
        visible: canViewContactStats,
        title: "Contact Messages",
        value: loading ? "..." : dashboard.totalContactMessages.toLocaleString(),
        change: `+${dashboard.todayContactMessages}`,
        icon: Mail,
        glow: "from-cyan-500/20 via-sky-500/10 to-transparent",
        iconBg: "bg-cyan-500/15",
        iconColor: "text-cyan-300",
      },
      {
        key: "blogs",
        visible: true,
        title: "Total Blogs",
        value: loading ? "..." : dashboard.totalBlogs.toLocaleString(),
        change: `${dashboard.publishedBlogs} Published`,
        icon: FileText,
        glow: "from-sky-500/20 via-blue-500/10 to-transparent",
        iconBg: "bg-sky-500/15",
        iconColor: "text-sky-300",
      },
      {
        key: "users",
        visible: canViewUserStats,
        title: "Total Users",
        value: loading ? "..." : dashboard.totalUsers.toLocaleString(),
        change: `+${dashboard.weeklyUsers}`,
        icon: Users,
        glow: "from-emerald-500/20 via-green-500/10 to-transparent",
        iconBg: "bg-emerald-500/15",
        iconColor: "text-emerald-300",
      },
      {
        key: "courses",
        visible: true,
        title: "Total Courses",
        value: loading ? "..." : dashboard.totalCourses.toLocaleString(),
        change: `${dashboard.publishedCourses} Published`,
        icon: BookOpen,
        glow: "from-amber-500/20 via-orange-500/10 to-transparent",
        iconBg: "bg-amber-500/15",
        iconColor: "text-amber-300",
      },
    ];

    return allStats.filter((item) => item.visible);
  }, [
    loading,
    dashboard,
    canViewEnquiryStats,
    canViewUserStats,
    canViewContactStats,
  ]);

  return (
    <Protected allow={["ADMIN", "EDITOR", "USER"]}>
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
                Monitor platform activity, track users, manage blogs, courses,
                enquiries, and contact messages from one secure workspace.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="rounded-xl bg-white/10 p-2">
                <Activity className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs text-white/60">System Status</p>
                <p className="text-sm font-semibold text-white">
                  {loading ? "Loading..." : "All services operational"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#081a36]/80 p-5 text-white shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${item.glow} opacity-100`}
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
                    Live backend data
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[26px] border border-white/10 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Overview
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest platform highlights from your backend collections.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {canViewEnquiryStats && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">
                    New enquiries today
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {loading ? "..." : dashboard.todayEnquiries.toLocaleString()}
                  </p>
                </div>
              )}

              {canViewUserStats && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">
                    New users this week
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {loading ? "..." : dashboard.weeklyUsers.toLocaleString()}
                  </p>
                </div>
              )}

              {canViewContactStats && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">
                    New contact messages today
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {loading
                      ? "..."
                      : dashboard.todayContactMessages.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">
                  Published blogs
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {loading ? "..." : dashboard.publishedBlogs.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">
                  Published courses
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {loading ? "..." : dashboard.publishedCourses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-[#081a36]/90 p-6 text-white shadow-[0_12px_40px_rgba(2,6,23,0.35)]">
            <h3 className="text-lg font-semibold">Admin Notes</h3>
            <p className="mt-1 text-sm text-white/65">
              Backend-powered counts are now connected successfully.
            </p>

            <div className="mt-5 space-y-3">
              {canViewRecentEnquiries && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium">Review pending enquiries</p>
                  <p className="mt-1 text-xs text-white/55">
                    Follow up on new leads and status changes from enquiry flow.
                  </p>
                </div>
              )}

              {canViewRecentContacts && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium">Check contact messages</p>
                  <p className="mt-1 text-xs text-white/55">
                    Review website contact submissions and respond quickly.
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium">Manage blogs and courses</p>
                <p className="mt-1 text-xs text-white/55">
                  Track published vs draft content for better visibility.
                </p>
              </div>

              {canViewRecentUsers && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium">Track user activity</p>
                  <p className="mt-1 text-xs text-white/55">
                    Monitor recently joined users and account status changes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(canViewRecentEnquiries || canViewRecentUsers || canViewRecentContacts) && (
          <div className="grid gap-4 xl:grid-cols-3">
            {canViewRecentEnquiries && (
              <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Enquiries
                </h3>

                <div className="mt-4 space-y-3">
                  {dashboard.recentEnquiries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No recent enquiries found.
                    </div>
                  ) : (
                    dashboard.recentEnquiries.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.full_name || "Unnamed"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {item.email || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Course: {item.interested_course || "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(item.created_at)}
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {item.status || "NEW"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {canViewRecentUsers && (
              <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Users
                </h3>

                <div className="mt-4 space-y-3">
                  {dashboard.recentUsers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No recent users found.
                    </div>
                  ) : (
                    dashboard.recentUsers.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.name || "Unnamed"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {item.email || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Role: {item.role || "USER"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(item.created_at)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.is_active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {canViewRecentContacts && (
              <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Contact Messages
                </h3>

                <div className="mt-4 space-y-3">
                  {dashboard.recentContactMessages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No recent contact messages found.
                    </div>
                  ) : (
                    dashboard.recentContactMessages.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {[item.firstName, item.lastName]
                                .filter(Boolean)
                                .join(" ") || "Unnamed"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {item.email || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Phone:{" "}
                              {item.countryCode && item.phone
                                ? `${item.countryCode} ${item.phone}`
                                : item.phone || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                            {item.status || "new"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Protected>
  );
}