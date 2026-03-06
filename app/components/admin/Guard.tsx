"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, getUser } from "@/app/lib/auth";

const ALLOWED_ADMIN_ROLES = ["ADMIN", "EDITOR"] as const;

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ✅ Allow login page without auth
    if (pathname === "/admin/login") return;

    const token = getAccessToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/admin/login");
      return;
    }

    if (!ALLOWED_ADMIN_ROLES.includes(user.role as "ADMIN" | "EDITOR")) {
      router.replace("/");
      return;
    }
  }, [pathname, router]);

  return <>{children}</>;
}