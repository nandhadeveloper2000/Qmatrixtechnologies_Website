"use client";

import Script from "next/script";

export default function GoogleReviews() {
  return (
    <section className="relative py-10">
      {/* Premium Background */}
      <div
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(900px 400px at 15% 20%, rgba(145,22,161,0.22), transparent 60%), radial-gradient(900px 400px at 85% 30%, rgba(8,42,94,0.22), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-6 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_rgba(8,42,94,0.16)] backdrop-blur">
          {/* Jotform Widget Container */}
          <div id="JFWebsiteWidget-019ca2deca8e7e8789c643dd8b3c64ec50a8"></div>

          {/* Load Jotform Script */}
          <Script
            src="https://www.jotform.com/website-widgets/embed/019ca2deca8e7e8789c643dd8b3c64ec50a8"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </section>
  );
}