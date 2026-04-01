import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "Qmatrix Technologies",
  description: "Best Software Training Institute in Chennai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}        
        <SpeedInsights /></body>
    </html>
  );
}