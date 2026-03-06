"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Protected from "../../../../../components/admin/Protected";
import { apiFetch } from "../../../../../lib/apiFetch";
import SummaryApi, { baseURL } from "../../../../../constants/SummaryApi";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserCircle2,
  UserRound,
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

  async function loadUser() {
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
  }

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
      }, 800);
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

      const response = await fetch(`${baseURL}${SummaryApi.uploadUserAvatar(id).url}`, {
        method: SummaryApi.uploadUserAvatar(id).method,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

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

      const res = await apiFetch<UpdateUserRes>(SummaryApi.deleteUserAvatar(id).url, {
        method: SummaryApi.deleteUserAvatar(id).method,
      });

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
    loadUser();
  }, [id]);

  return (
    <Protected allow={["ADMIN"]}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#082a5e] via-slate-900 to-[#111827] p-6 text-white shadow-xl">
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                QMTechnologies Admin Panel
              </div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Edit User Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                Manage user information, role permissions, profile avatar, and
                account status from one place.
              </p>
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
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[340px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading user details...
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Profile Avatar
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload a profile image or remove the existing avatar.
                </p>

                <div className="mt-6 flex flex-col items-center">
                  <div className="relative h-36 w-36 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="User avatar"
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <UserCircle2 className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-4 w-4" />
                        Upload Avatar
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
                      className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingAvatar ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Removing...
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

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Summary
                </h2>

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

            <div className="xl:col-span-2 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                User Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update the user account details and permission level.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
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
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
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
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
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
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>

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
                      Saving...
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
        )}
      </div>
    </Protected>
  );
}