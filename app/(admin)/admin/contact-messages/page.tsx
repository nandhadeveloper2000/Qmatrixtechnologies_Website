"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Protected from "@/app/components/admin/Protected";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  RefreshCw,
  Eye,
  Send,
  X,
  Filter,
  Loader2,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Archive,
} from "lucide-react";

type ContactStatus = "new" | "in_progress" | "completed" | "closed";

type ContactMessage = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  countryCode: string;
  phone: string;
  message: string;
  status: ContactStatus;
  reason?: string;
  adminReply?: string;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ContactListResponse = {
  success?: boolean;
  data?: ContactMessage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
};

type SingleContactResponse = {
  success?: boolean;
  data?: ContactMessage;
  message?: string;
};

type ActionResponse = {
  success?: boolean;
  message?: string;
  data?: ContactMessage;
};

const STATUS_OPTIONS: { label: string; value: ContactStatus | "" }[] = [
  { label: "All Status", value: "" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Closed", value: "closed" },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

function formatDate(date?: string | null) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "-";
  }
}

function getFullName(item: ContactMessage) {
  return [item.firstName, item.lastName].filter(Boolean).join(" ").trim() || "-";
}

function getStatusConfig(status: ContactStatus) {
  switch (status) {
    case "new":
      return {
        label: "New",
        className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        icon: <AlertCircle className="h-3.5 w-3.5" />,
      };
    case "in_progress":
      return {
        label: "In Progress",
        className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        icon: <Clock3 className="h-3.5 w-3.5" />,
      };
    case "completed":
      return {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      };
    case "closed":
      return {
        label: "Closed",
        className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
        icon: <Archive className="h-3.5 w-3.5" />,
      };
    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
        icon: <AlertCircle className="h-3.5 w-3.5" />,
      };
  }
}

function StatusBadge({ status }: { status: ContactStatus }) {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<ContactStatus | "">("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    pages: 1,
  });

  const [selectedId, setSelectedId] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContactMessage | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [statusValue, setStatusValue] = useState<ContactStatus>("new");
  const [reasonValue, setReasonValue] = useState("");
  const [replyValue, setReplyValue] = useState("");

  const [savingStatus, setSavingStatus] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const fetchMessages = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (status) params.set("status", status);
        if (query.trim()) params.set("search", query.trim());

        const endpoint = `${SummaryApi.contact_all.url}?${params.toString()}`;

        const data = await apiFetch<ContactListResponse>(endpoint, {
          method: SummaryApi.contact_all.method,
        });

        if (!data?.success) {
          throw new Error(data?.message || "Failed to fetch contact messages");
        }

        setItems(Array.isArray(data.data) ? data.data : []);
        setPagination({
          page: data.pagination?.page || 1,
          limit: data.pagination?.limit || limit,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 1,
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, status, query]
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const openDetails = async (id: string) => {
    try {
      setSelectedId(id);
      setDetailsLoading(true);
      setSelectedItem(null);

      const data = await apiFetch<SingleContactResponse>(SummaryApi.contact_by_id(id).url, {
        method: SummaryApi.contact_by_id(id).method,
      });

      if (!data?.success || !data?.data) {
        throw new Error(data?.message || "Failed to fetch message details");
      }

      setSelectedItem(data.data);
      setStatusValue(data.data.status);
      setReasonValue(data.data.reason || "");
      setReplyValue(data.data.adminReply || "");
    } catch (err) {
      showToast("error", getErrorMessage(err));
      setSelectedId("");
      setSelectedItem(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedId("");
    setSelectedItem(null);
    setReasonValue("");
    setReplyValue("");
    setStatusValue("new");
    setDetailsLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    setQuery(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setQuery("");
    setStatus("");
    setPage(1);
  };

  const updateStatus = async () => {
    if (!selectedItem?._id) return;

    try {
      setSavingStatus(true);

      const data = await apiFetch<ActionResponse>(
        SummaryApi.contact_status_update(selectedItem._id).url,
        {
          method: SummaryApi.contact_status_update(selectedItem._id).method,
          json: {
            status: statusValue,
            reason: reasonValue,
          },
        }
      );

      if (!data?.success) {
        throw new Error(data?.message || "Failed to update status");
      }

      const updated = data.data;
      const nextUpdatedAt = updated?.updatedAt || new Date().toISOString();

      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: updated?.status || statusValue,
              reason: updated?.reason ?? reasonValue,
              updatedAt: nextUpdatedAt,
            }
          : prev
      );

      setItems((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id
            ? {
                ...item,
                status: updated?.status || statusValue,
                reason: updated?.reason ?? reasonValue,
                updatedAt: nextUpdatedAt,
              }
            : item
        )
      );

      showToast("success", data.message || "Status updated successfully");
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setSavingStatus(false);
    }
  };

  const sendReply = async () => {
    if (!selectedItem?._id) return;

    if (!replyValue.trim()) {
      showToast("error", "Reply message is required");
      return;
    }

    try {
      setSendingReply(true);

      const data = await apiFetch<ActionResponse>(SummaryApi.contact_reply(selectedItem._id).url, {
        method: SummaryApi.contact_reply(selectedItem._id).method,
        json: {
          replyMessage: replyValue.trim(),
          status: statusValue,
          reason: reasonValue,
        },
      });

      if (!data?.success || !data?.data) {
        throw new Error(data?.message || "Failed to send reply");
      }

      setSelectedItem(data.data);
      setStatusValue(data.data.status);
      setReasonValue(data.data.reason || "");
      setReplyValue(data.data.adminReply || "");

      setItems((prev) =>
        prev.map((item) => (item._id === data.data?._id ? data.data : item))
      );

      showToast("success", data.message || "Reply sent successfully");
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setSendingReply(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: pagination.total,
      new: items.filter((i) => i.status === "new").length,
      in_progress: items.filter((i) => i.status === "in_progress").length,
      completed: items.filter((i) => i.status === "completed").length,
      closed: items.filter((i) => i.status === "closed").length,
    };
  }, [items, pagination.total]);

  return (
    <Protected allow={["ADMIN"]}>
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Contact Messages
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage enquiries, update status, and send replies to users.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Total" value={String(stats.total)} />
            <StatCard title="New" value={String(stats.new)} />
            <StatCard title="In Progress" value={String(stats.in_progress)} />
            <StatCard title="Completed" value={String(stats.completed)} />
            <StatCard title="Closed" value={String(stats.closed)} />
          </div>

          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Search by name, email, phone, or message"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as ContactStatus | "");
                    setPage(1);
                  }}
                  className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-300"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#082a5e] px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading contact messages...
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="rounded-full bg-red-50 p-3 text-red-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Failed to load messages
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-600">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchMessages(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#082a5e] px-4 py-2 text-sm font-semibold text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No contact messages found
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Try changing the search query or status filter.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          User
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Contact
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Message
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Received
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {items.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/80">
                          <td className="px-5 py-4 align-top">
                            <div className="min-w-[180px]">
                              <p className="text-sm font-bold text-slate-900">
                                {getFullName(item)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                ID: {item._id.slice(-8)}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="min-w-[220px] space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="truncate">{item.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span>
                                  {item.countryCode} {item.phone}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="max-w-[360px]">
                              <p className="line-clamp-3 text-sm leading-6 text-slate-700">
                                {item.message}
                              </p>
                              {item.reason ? (
                                <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                                  <span className="font-semibold text-slate-600">
                                    Reason:
                                  </span>{" "}
                                  {item.reason}
                                </p>
                              ) : null}
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <StatusBadge status={item.status} />
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="text-sm text-slate-700">
                              {formatDate(item.createdAt)}
                            </p>
                            {item.repliedAt ? (
                              <p className="mt-1 text-xs text-emerald-600">
                                Replied: {formatDate(item.repliedAt)}
                              </p>
                            ) : null}
                          </td>

                          <td className="px-5 py-4 align-top text-right">
                            <button
                              type="button"
                              onClick={() => openDetails(item._id)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600">
                    Showing page <span className="font-semibold">{pagination.page}</span> of{" "}
                    <span className="font-semibold">{pagination.pages}</span> — Total{" "}
                    <span className="font-semibold">{pagination.total}</span> messages
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, pagination.pages))
                      }
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {(selectedId || detailsLoading) && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:p-6">
            <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Contact Message Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review enquiry, update status, and send reply.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDetails}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[calc(92vh-80px)] overflow-y-auto">
                {detailsLoading || !selectedItem ? (
                  <div className="flex min-h-[360px] items-center justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading details...
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
                    <div className="space-y-6">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              {getFullName(selectedItem)}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Received on {formatDate(selectedItem.createdAt)}
                            </p>
                          </div>
                          <StatusBadge status={selectedItem.status} />
                        </div>

                        <div className="space-y-3 text-sm text-slate-700">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span>{selectedItem.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>
                              {selectedItem.countryCode} {selectedItem.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                          User Message
                        </h4>
                        <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                          {selectedItem.message}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                          Existing Admin Reply
                        </h4>
                        <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                          {selectedItem.adminReply?.trim()
                            ? selectedItem.adminReply
                            : "No reply has been sent yet."}
                        </div>
                        {selectedItem.repliedAt ? (
                          <p className="mt-3 text-xs font-medium text-emerald-600">
                            Replied on {formatDate(selectedItem.repliedAt)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                          Update Status
                        </h4>

                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Status
                            </label>
                            <select
                              value={statusValue}
                              onChange={(e) => setStatusValue(e.target.value as ContactStatus)}
                              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-slate-300"
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Reason / Internal Note
                            </label>
                            <textarea
                              rows={4}
                              value={reasonValue}
                              onChange={(e) => setReasonValue(e.target.value)}
                              placeholder="Add admin note or closure reason"
                              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none focus:border-slate-300"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={updateStatus}
                            disabled={savingStatus}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#082a5e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
                          >
                            {savingStatus ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Save Status
                          </button>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                          Send Reply Email
                        </h4>

                        <div className="mt-4">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Reply Message
                          </label>
                          <textarea
                            rows={8}
                            value={replyValue}
                            onChange={(e) => setReplyValue(e.target.value)}
                            placeholder="Write your reply to the user"
                            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none focus:border-slate-300"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={sendReply}
                            disabled={sendingReply}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#082a5e] via-[#a724e4] to-[#8121fb] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
                          >
                            {sendingReply ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            Send Reply
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setReplyValue("");
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Clear
                          </button>
                        </div>

                        <p className="mt-3 text-xs leading-6 text-slate-500">
                          Tip: Set status to{" "}
                          <span className="font-semibold text-slate-700">completed</span>{" "}
                          before sending the reply.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {toast ? (
          <div className="fixed bottom-5 right-5 z-[60]">
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ring-1 ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-red-200"
              }`}
            >
              {toast.text}
            </div>
          </div>
        ) : null}
      </div>
    </Protected>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}