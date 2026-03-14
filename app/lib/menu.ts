import type { UserRole } from "./auth";

export type AdminMenuItem = {
  label: string;
  href: string;
  roles: UserRole[];
};

export const adminMenu: AdminMenuItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", roles: ["ADMIN", "USER"] },
  { label: "Users", href: "/admin/users", roles: ["ADMIN"] },
  { label: "Employees", href: "/admin/employees", roles: ["ADMIN"] },
];