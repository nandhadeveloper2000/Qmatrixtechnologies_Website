"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import Protected from "../../../components/admin/Protected";
import { apiFetch } from "../../../lib/apiFetch";
import {
  Users,
  Mail,
  ShieldCheck,
  UserPlus,
  Trash2,
  Loader2,
  Search,
  Pencil,
} from "lucide-react";

type User = {
  _id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "USER";
  is_active: boolean;
};

type UsersListRes = { data: User[] } | User[];

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<User["role"]>("EDITOR");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await apiFetch<UsersListRes>("/users", { method: "GET" });
      const list = Array.isArray(res) ? res : res.data;
      setItems(list ?? []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    if (!name.trim() || !email.trim()) return;

    try {
      setCreating(true);

      await apiFetch("/users", {
        method: "POST",
        json: {
          name: name.trim(),
          email: email.trim(),
          role,
          is_active: true,
        },
      });

      setName("");
      setEmail("");
      setRole("EDITOR");
      await load();
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setCreating(false);
    }
  }

  async function deleteUser(id: string) {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      await load();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleUserStatus(user: User) {
    try {
      setTogglingId(user._id);

      const updatedActive = !user.is_active;

      await apiFetch(`/users/${user._id}`, {
       method: "PUT",
        json: {
          is_active: updatedActive,
        },
      });

      setItems((prev) =>
        prev.map((item) =>
          item._id === user._id ? { ...item, is_active: updatedActive } : item
        )
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setTogglingId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [items, query]);

  function getRoleStyles(role: User["role"]) {
    switch (role) {
      case "ADMIN":
        return "bg-violet-100 text-violet-700 border-violet-200";
      case "EDITOR":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "USER":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <Protected allow={["ADMIN"]}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                QMTechnologies Admin
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">User Management</h1>
              <p className="mt-2 text-sm text-slate-300 md:text-base">
                Manage admins, editors, and users with premium control.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:min-w-65">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-slate-300">
                  Total Users
                </div>
                <div className="mt-2 text-2xl font-bold">{items.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-slate-300">
                  Active Users
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {items.filter((u) => u.is_active).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
              <p className="text-sm text-slate-500">
                Add new platform users with role access.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value as User["role"])}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="EDITOR">EDITOR</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-transparent">Create</label>
              <button
                onClick={createUser}
                disabled={creating || !name.trim() || !email.trim()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">All Users</h2>
              <p className="text-sm text-slate-500">
                Search and manage users from one place.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, role..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex min-h-62.5 items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading users...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex min-h-62.5 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No users found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or create a new user.
                </p>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-600">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Active / Inactive</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((u, index) => (
                    <tr
                      key={u._id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-slate-900 to-slate-700 text-sm font-bold text-white shadow">
                            {u.name?.charAt(0)?.toUpperCase() || index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-500">
                              ID: {u._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-700">{u.email}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRoleStyles(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            u.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u)}
                          disabled={togglingId === u._id}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                            u.is_active ? "bg-emerald-500" : "bg-slate-300"
                          } ${togglingId === u._id ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition ${
                              u.is_active ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <NextLink
                            href={`/admin/users/${u._id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </NextLink>

                          <button
                            onClick={() => deleteUser(u._id)}
                            disabled={deletingId === u._id}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === u._id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Protected>
  );
}