import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QMatrix Technologies",
  description: "Best Software Training Institute in Chennai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}