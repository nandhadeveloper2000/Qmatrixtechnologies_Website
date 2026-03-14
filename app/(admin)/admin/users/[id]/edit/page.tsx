"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Protected from "../../../../../components/admin/Protected";
import { apiFetch } from "../../../../../lib/apiFetch";
import SummaryApi, { baseURL } from "../../../../../constants/SummaryApi";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserRound,
  Users,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

type UserRole = "ADMIN" | "EDITOR" | "USER";

type UserDetail = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type GetUserRes = {
  success: boolean;
  user: UserDetail;
  message?: string;
};

type UpdateUserRes = {
  success: boolean;
  message?: string;
  user?: UserDetail;
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function getRoleBadgeClass(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "EDITOR":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = useMemo(() => params?.id ?? "", [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [isActive, setIsActive] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }, [name]);

  const loadUser = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const res = await apiFetch<GetUserRes>(SummaryApi.userById(id).url, {
        method: SummaryApi.userById(id).method,
      });

      if (!res?.success || !res?.user) {
        throw new Error(res?.message || "Failed to fetch user");
      }

      const user = res.user;

      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "USER");
      setIsActive(Boolean(user.is_active));
      setAvatarUrl(user.avatar_url ?? null);
      setCreatedAt(user.created_at ?? null);
      setUpdatedAt(user.updated_at ?? null);
    } catch (err) {
      console.error("Failed to load user:", err);
      setError(err instanceof Error ? err.message : "Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  async function handleUpdate() {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        role,
        is_active: isActive,
      };

      const res = await apiFetch<UpdateUserRes>(SummaryApi.updateUser(id).url, {
        method: SummaryApi.updateUser(id).method,
        json: payload,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to update user");
      }

      if (res.user) {
        setName(res.user.name || "");
        setEmail(res.user.email || "");
        setRole(res.user.role || "USER");
        setIsActive(Boolean(res.user.is_active));
        setAvatarUrl(res.user.avatar_url ?? null);
        setCreatedAt(res.user.created_at ?? null);
        setUpdatedAt(res.user.updated_at ?? null);
      }

      setMessage(res?.message || "User updated successfully");

      setTimeout(() => {
        router.push("/admin/users");
      }, 900);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(file: File) {
    if (!id) return;

    try {
      setUploading(true);
      setError(null);
      setMessage(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(
        `${baseURL}${SummaryApi.uploadUserAvatar(id).url}`,
        {
          method: SummaryApi.uploadUserAvatar(id).method,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        }
      );

      const data = await safeJson<UpdateUserRes>(response);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to upload avatar");
      }

      setAvatarUrl(data?.user?.avatar_url ?? null);
      setUpdatedAt(data?.user?.updated_at ?? null);
      setMessage(data?.message || "Avatar uploaded successfully");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setError(err instanceof Error ? err.message : "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteAvatar() {
    if (!id) return;

    try {
      setDeletingAvatar(true);
      setError(null);
      setMessage(null);

      const res = await apiFetch<UpdateUserRes>(
        SummaryApi.deleteUserAvatar(id).url,
        {
          method: SummaryApi.deleteUserAvatar(id).method,
        }
      );

      if (!res?.success) {
        throw new Error(res?.message || "Failed to delete avatar");
      }

      setAvatarUrl(res?.user?.avatar_url ?? null);
      setUpdatedAt(res?.user?.updated_at ?? null);
      setMessage(res?.message || "Avatar removed successfully");
    } catch (err) {
      console.error("Failed to delete avatar:", err);
      setError(err instanceof Error ? err.message : "Failed to delete avatar");
    } finally {
      setDeletingAvatar(false);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    handleAvatarUpload(file);
    e.target.value = "";
  }

  useEffect(() => {
    if (!id) return;
    loadUser();
  }, [id, loadUser]);

  return (
    <Protected allow={["ADMIN"]}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#082a5e] via-slate-900 to-[#111827] p-6 text-white shadow-[0_20px_80px_rgba(15,23,42,0.25)] md:p-8">
          <div className="absolute -left-14 top-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                <Users className="h-8 w-8 text-white" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  QMTechnologies Admin Panel
                </div>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Edit User Profile
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  Update profile details, role permissions, account status, and
                  avatar settings from one professional workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </button>
          </div>
        </div>

        {message && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading user details...
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <div className="relative h-28 bg-gradient-to-r from-[#082a5e] via-[#0f172a] to-[#1e293b]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
                </div>

                <div className="relative px-6 pb-6">
                  <div className="-mt-14 flex flex-col items-center">
                    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-4 border-white bg-slate-100 shadow-lg">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="User avatar"
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600">
                          <span className="text-2xl font-bold">{initials}</span>
                        </div>
                      )}
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                      {name || "Unnamed User"}
                    </h2>
                    <p className="mt-1 break-all text-center text-sm text-slate-500">
                      {email || "No email available"}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                          role
                        )}`}
                      >
                        {role}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading Avatar...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          Upload New Avatar
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={onFileChange}
                      />
                    </label>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={deletingAvatar}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingAvatar ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Removing Avatar...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete Avatar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-slate-700" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Account Summary
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <UserRound className="h-4 w-4" />
                      User ID
                    </div>
                    <p className="break-all text-sm text-slate-800">{id}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <CalendarDays className="h-4 w-4" />
                      Created At
                    </div>
                    <p className="text-sm text-slate-800">
                      {formatDate(createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <CalendarDays className="h-4 w-4" />
                      Last Updated
                    </div>
                    <p className="text-sm text-slate-800">
                      {formatDate(updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-semibold text-slate-900">
                    User Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage account identity, permission level, and active state.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#082a5e] focus:bg-white focus:ring-4 focus:ring-[#082a5e]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email address"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#082a5e] focus:bg-white focus:ring-4 focus:ring-[#082a5e]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#082a5e] focus:bg-white focus:ring-4 focus:ring-[#082a5e]/10"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="USER">USER</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Account Status
                    </label>

                    <div className="flex h-12 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4">
                      <div className="flex items-center gap-2">
                        <BadgeCheck
                          className={`h-4 w-4 ${
                            isActive ? "text-emerald-500" : "text-rose-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isActive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsActive((prev) => !prev)}
                        aria-label="Toggle account status"
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                          isActive ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${
                            isActive ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Admin Notes
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Use <span className="font-medium">ADMIN</span> for full
                    platform control, <span className="font-medium">EDITOR</span>{" "}
                    for content or operational management, and{" "}
                    <span className="font-medium">USER</span> for standard access.
                    Disable the account when temporary access should be blocked.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving || !name.trim() || !email.trim()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/users")}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}