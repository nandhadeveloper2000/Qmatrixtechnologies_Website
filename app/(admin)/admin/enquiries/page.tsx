"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Protected from "@/app/components/admin/Protected";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import {
  Search,
  RefreshCcw,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  MessageSquare,
  BadgeCheck,
  Clock3,
  Filter,
  Inbox,
  Loader2,
  Layers3,
} from "lucide-react";

type EnquiryStatus = "NEW" | "IN_PROGRESS" | "COMPLETED";

type EnquiryItem = {
  _id: string;
  full_name: string;
  email: string;
  mobile: string;
  qualification?: string | null;
  background?: string | null;
  current_location?: string | null;
  interested_course?: string | null;
  interested_courses?: string[];
  last_interested_course?: string | null;
  subject?: string | null;
  message?: string | null;
  source?: string | null;
  enquiry_count?: number;
  status: EnquiryStatus;
  created_at?: string;
  updated_at?: string;
  last_enquired_at?: string;
};

type ListResponse = {
  success: boolean;
  data: {
    items: EnquiryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type UpdateResponse = {
  success: boolean;
  message: string;
  data: EnquiryItem;
};

type DeleteResponse = {
  success: boolean;
  message: string;
};

const STATUS_OPTIONS: EnquiryStatus[] = ["NEW", "IN_PROGRESS", "COMPLETED"];

function formatDate(date?: string) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "Something went wrong.";
}

function getStatusBadgeClass(status: EnquiryStatus) {
  switch (status) {
    case "NEW":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getStatusDotClass(status: EnquiryStatus) {
  switch (status) {
    case "NEW":
      return "bg-blue-500";
    case "IN_PROGRESS":
      return "bg-amber-500";
    case "COMPLETED":
      return "bg-emerald-500";
    default:
      return "bg-slate-400";
  }
}

function getCourseList(item: EnquiryItem): string[] {
  const courseArray = Array.isArray(item.interested_courses)
    ? item.interested_courses
        .map((course) => String(course || "").trim())
        .filter(Boolean)
    : [];

  if (courseArray.length > 0) return [...new Set(courseArray)];

  const single = String(item.interested_course || "").trim();
  return single ? [single] : [];
}

function getCourseDisplay(item: EnquiryItem): string {
  const courses = getCourseList(item);
  if (!courses.length) return "-";
  return courses.join(", ");
}

function StatCard({
  title,
  value,
  icon,
  tone = "violet",
}: {
  title: string;
  value: number;
  icon: ReactNode;
  tone?: "violet" | "blue" | "amber" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "from-blue-500/10 to-cyan-500/10 border-blue-200"
      : tone === "amber"
      ? "from-amber-500/10 to-orange-500/10 border-amber-200"
      : tone === "emerald"
      ? "from-emerald-500/10 to-teal-500/10 border-emerald-200"
      : "from-violet-500/10 to-fuchsia-500/10 border-violet-200";

  return (
    <div
      className={`rounded-3xl border bg-linear-to-br ${toneClass} p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="rounded-2xl bg-white/80 p-3 shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-900">
          {value?.trim() ? value : "-"}
        </p>
      </div>
    </div>
  );
}

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [statusMap, setStatusMap] = useState<Record<string, EnquiryStatus>>({});
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(
    null
  );

  const selectedEnquiryIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedEnquiryIdRef.current = selectedEnquiry?._id ?? null;
  }, [selectedEnquiry]);

  const loadEnquiries = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccessMsg("");

      const params = new URLSearchParams();

      const trimmedQuery = query.trim();
      const trimmedStatus = statusFilter.trim();

      if (trimmedQuery) params.set("q", trimmedQuery);
      if (trimmedStatus) params.set("status", trimmedStatus);

      const url = params.toString()
        ? `${SummaryApi.admin_enquiries.url}?${params.toString()}`
        : SummaryApi.admin_enquiries.url;

      const res = await apiFetch<ListResponse>(url, {
        method: SummaryApi.admin_enquiries.method,
      });

      const list = res?.data?.items || [];
      setItems(list);

      const nextStatusMap: Record<string, EnquiryStatus> = {};
      list.forEach((item) => {
        nextStatusMap[item._id] = item.status;
      });
      setStatusMap(nextStatusMap);

      const selectedId = selectedEnquiryIdRef.current;
      if (selectedId) {
        const freshSelected = list.find((i) => i._id === selectedId) || null;
        setSelectedEnquiry(freshSelected);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load enquiries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query, statusFilter]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const filteredItems = useMemo(() => items, [items]);

  const stats = useMemo(() => {
    return {
      total: filteredItems.length,
      newCount: filteredItems.filter((item) => item.status === "NEW").length,
      inProgress: filteredItems.filter((item) => item.status === "IN_PROGRESS")
        .length,
      completed: filteredItems.filter((item) => item.status === "COMPLETED")
        .length,
    };
  }, [filteredItems]);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await loadEnquiries();
  }

  async function handleRefresh() {
    await loadEnquiries(true);
  }

  async function handleReset() {
    setQuery("");
    setStatusFilter("");

    try {
      setRefreshing(true);
      setError("");
      setSuccessMsg("");

      const res = await apiFetch<ListResponse>(SummaryApi.admin_enquiries.url, {
        method: SummaryApi.admin_enquiries.method,
      });

      const list = res?.data?.items || [];
      setItems(list);

      const nextStatusMap: Record<string, EnquiryStatus> = {};
      list.forEach((item) => {
        nextStatusMap[item._id] = item.status;
      });
      setStatusMap(nextStatusMap);

      const selectedId = selectedEnquiryIdRef.current;
      if (selectedId) {
        const freshSelected = list.find((i) => i._id === selectedId) || null;
        setSelectedEnquiry(freshSelected);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to reset enquiries.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string) {
    const selectedStatus = statusMap[id];
    if (!selectedStatus) return;

    try {
      setUpdatingId(id);
      setError("");
      setSuccessMsg("");

      const res = await apiFetch<UpdateResponse>(
        SummaryApi.admin_enquiry_update(id).url,
        {
          method: SummaryApi.admin_enquiry_update(id).method,
          json: { status: selectedStatus },
        }
      );

      const updatedItem = res?.data;

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                ...updatedItem,
                status: updatedItem?.status ?? selectedStatus,
                updated_at: updatedItem?.updated_at ?? item.updated_at,
              }
            : item
        )
      );

      setSelectedEnquiry((prev) =>
        prev && prev._id === id
          ? {
              ...prev,
              ...updatedItem,
              status: updatedItem?.status ?? selectedStatus,
            }
          : prev
      );

      setSuccessMsg("Enquiry status updated successfully.");
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to update enquiry status.");
    } finally {
      setUpdatingId("");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccessMsg("");

      await apiFetch<DeleteResponse>(SummaryApi.admin_enquiry_delete(id).url, {
        method: SummaryApi.admin_enquiry_delete(id).method,
      });

      setItems((prev) => prev.filter((item) => item._id !== id));
      setStatusMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      if (selectedEnquiry?._id === id) {
        setSelectedEnquiry(null);
      }

      setSuccessMsg("Enquiry deleted successfully.");
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to delete enquiry.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <Protected allow={["ADMIN"]}>
      <div className="bg-[radial-gradient(circle_at_top,#f5f3ff_0%,#f8fafc_38%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-2">
        <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Premium Workspace
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Admin Enquiries
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage course enquiries, review submissions, update pipeline
                  status, and maintain your leads cleanly.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Enquiries"
                value={stats.total}
                icon={<Inbox className="h-5 w-5 text-violet-700" />}
                tone="violet"
              />
              <StatCard
                title="New"
                value={stats.newCount}
                icon={<Clock3 className="h-5 w-5 text-blue-700" />}
                tone="blue"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                icon={<Loader2 className="h-5 w-5 text-amber-700" />}
                tone="amber"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={<BadgeCheck className="h-5 w-5 text-emerald-700" />}
                tone="emerald"
              />
            </div>

            <form
              onSubmit={handleSearch}
              className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_130px_130px]"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, mobile, course..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="">All Status</option>
                  <option value="NEW">NEW</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(147,51,234,0.22)] transition hover:opacity-95"
              >
                <Search className="h-4 w-4" />
                Search
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            {successMsg ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMsg}
              </div>
            ) : null}
          </div>

          <div className="p-5 sm:p-6">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[1400px] w-full">
                  <thead className="bg-slate-100/90">
                    <tr className="text-left">
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        S.No
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Lead
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Courses
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Location
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Source
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Created
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Change
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-16 text-center text-sm font-medium text-slate-500"
                        >
                          <div className="inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading enquiries...
                          </div>
                        </td>
                      </tr>
                    ) : filteredItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-16 text-center text-sm font-medium text-slate-500"
                        >
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="rounded-3xl bg-slate-100 p-4">
                              <Inbox className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-800">
                              No enquiries found
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Try changing the search text or status filter.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, index) => (
                        <tr
                          key={item._id}
                          className="align-top transition hover:bg-slate-50/80"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-slate-700">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4">
                            <div className="min-w-[220px]">
                              <p className="font-semibold text-slate-900">
                                {item.full_name || "-"}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {item.email || "-"}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.mobile || "-"}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            <div className="max-w-[220px] break-words">
                              {getCourseDisplay(item)}
                            </div>
                            {getCourseList(item).length > 1 ? (
                              <p className="mt-1 text-xs font-medium text-violet-600">
                                {getCourseList(item).length} courses
                              </p>
                            ) : null}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            <div className="max-w-[160px] break-words">
                              {item.current_location || "-"}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                              {item.source || "-"}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            <div className="min-w-[140px]">
                              {formatDate(item.created_at)}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                item.status
                              )}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${getStatusDotClass(
                                  item.status
                                )}`}
                              />
                              {item.status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex min-w-[220px] items-center gap-2">
                              <select
                                value={statusMap[item._id] || item.status}
                                onChange={(e) =>
                                  setStatusMap((prev) => ({
                                    ...prev,
                                    [item._id]: e.target.value as EnquiryStatus,
                                  }))
                                }
                                className="w-[150px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                              >
                                {STATUS_OPTIONS.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => handleStatusUpdate(item._id)}
                                disabled={updatingId === item._id}
                                className="inline-flex min-w-[92px] items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {updatingId === item._id ? "Saving..." : "Update"}
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedEnquiry(item)}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item._id)}
                                disabled={deletingId === item._id}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Trash2 className="h-4 w-4" />
                                {deletingId === item._id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {!loading && filteredItems.length > 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                Horizontal scroll is enabled for compact admin data view.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {selectedEnquiry ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-[28px] border border-slate-200 bg-white shadow-2xl sm:rounded-[32px]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-linear-to-r from-violet-50 via-fuchsia-50 to-white px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                  Enquiry Details
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedEnquiry.full_name || "Enquiry"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Review full lead details and update status from here.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-90px)] overflow-y-auto px-5 py-5 sm:px-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusBadgeClass(
                    selectedEnquiry.status
                  )}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${getStatusDotClass(
                      selectedEnquiry.status
                    )}`}
                  />
                  {selectedEnquiry.status}
                </span>

                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Source: {selectedEnquiry.source || "-"}
                </span>

                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Created: {formatDate(selectedEnquiry.created_at)}
                </span>

                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Last Updated: {formatDate(selectedEnquiry.updated_at)}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={selectedEnquiry.email}
                />
                <DetailRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Mobile"
                  value={selectedEnquiry.mobile}
                />
                <DetailRow
                  icon={<GraduationCap className="h-4 w-4" />}
                  label="Qualification"
                  value={selectedEnquiry.qualification}
                />
                <DetailRow
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Background"
                  value={selectedEnquiry.background}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Current Location"
                  value={selectedEnquiry.current_location}
                />
                <DetailRow
                  icon={<Layers3 className="h-4 w-4" />}
                  label="Last Interested Course"
                  value={
                    selectedEnquiry.last_interested_course ||
                    selectedEnquiry.interested_course ||
                    "-"
                  }
                />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-slate-500" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Interested Courses
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {getCourseList(selectedEnquiry).length > 0 ? (
                    getCourseList(selectedEnquiry).map((course) => (
                      <span
                        key={course}
                        className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700"
                      >
                        {course}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-900">-</span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <DetailRow
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Subject"
                  value={selectedEnquiry.subject}
                />

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Message
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-900">
                    {selectedEnquiry.message?.trim()
                      ? selectedEnquiry.message
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Update Status
                </h3>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={
                      statusMap[selectedEnquiry._id] || selectedEnquiry.status
                    }
                    onChange={(e) =>
                      setStatusMap((prev) => ({
                        ...prev,
                        [selectedEnquiry._id]:
                          e.target.value as EnquiryStatus,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 sm:max-w-[220px]"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedEnquiry._id)}
                    disabled={updatingId === selectedEnquiry._id}
                    className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(147,51,234,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === selectedEnquiry._id
                      ? "Updating..."
                      : "Save Status"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Protected>
  );
}