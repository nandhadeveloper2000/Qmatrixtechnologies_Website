"use client";

import Guard from "@/app/components/admin/Guard";
import Sidebar from "@/app/components/admin/Sidebar";
import Topbar from "@/app/components/admin/Topbar";
import { Toaster } from "sonner";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Guard>
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "!rounded-xl",
          }}
        />

        <div className="flex">
          
          {/* Sidebar */}
          <Sidebar />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            
            {/* Topbar */}
            <Topbar />

            {/* Page Content */}
            <main className="p-6">{children}</main>

          </div>

        </div>
      </div>
    </Guard>
  );
}