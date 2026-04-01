"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  Blocks,
  MessageSquare,
  Contact,
} from "lucide-react";
import Image from "next/image";
import { cldPublic } from "@/app/lib/cloudinary";

const navByRole = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Contact", href: "/admin/contact-messages", icon: Contact },
    { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Blogs", href: "/admin/blogs", icon: Blocks },
    { label: "SEO Manager", href: "/admin/seo", icon: ShieldCheck },
  ],
  user: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Contact", href: "/admin/contact-messages", icon: Contact },
    { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Blogs", href: "/admin/blogs", icon: Blocks },
  ],
  editor: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Blogs", href: "/admin/blogs", icon: Blocks },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setRole(parsedUser?.role?.toLowerCase() || "admin");
      } catch (error) {
        console.error("Invalid user data in localStorage", error);
        setRole("admin");
      }
    }
  }, []);

  const nav = navByRole[role] || navByRole.admin;

  return (
    <aside className="sticky top-0 flex min-h-screen w-72 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#04152f_0%,#082a5e_55%,#061a36_100%)] text-white shadow-[8px_0_30px_rgba(2,6,23,0.18)]">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur">
            <Image
              src={cldPublic("qmatrix/logo.png", "f_auto,q_auto,w_1000")}
              alt="QMTechnologies"
              width={36}
              height={36}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>

          <div>
            <h2 className="text-base font-bold tracking-wide">QMTechnologies</h2>
            <p className="text-xs text-white/60 capitalize">{role} Panel</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-fuchsia-500/15 p-2">
              <ShieldCheck className="h-4 w-4 text-fuchsia-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Secure Workspace</p>
              <p className="text-xs text-white/55">
                Protected admin operations
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white text-[#082a5e] shadow-lg"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`rounded-xl p-2 ${
                    active ? "bg-[#082a5e]/10" : "bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </span>

              <ChevronRight
                className={`h-4 w-4 transition ${
                  active
                    ? "translate-x-0 text-[#082a5e]"
                    : "text-white/40 group-hover:translate-x-0.5"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-semibold">Need quick access?</p>
          <p className="mt-1 text-xs leading-5 text-white/55">
            Manage users, monitor activity, and control content from this panel.
          </p>
        </div>
      </div>
    </aside>
  );
}