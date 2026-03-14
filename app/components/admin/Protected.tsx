"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserRole } from "@/app/lib/auth";

export default function Protected({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: UserRole[];
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace("/admin/dashboard");
      return;
    }
  }, [router, allow]);

  return <>{children}</>;
}