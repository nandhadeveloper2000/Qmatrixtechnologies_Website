"use client";

import { cldPublic } from "@/app/lib/cloudinary";
import Image from "next/image";
import { motion } from "framer-motion";


function StatCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/85 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60 backdrop-blur",
        className,
      ].join(" ")}
    >
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F8FC]">
      {/* ===== Premium light background ===== */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-[#F7F8FC] to-white" />

      {/* soft blobs */}
      <div className="pointer-events-none absolute -left-28 top-24 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-10 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 bottom-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      {/* subtle dotted grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,23,42,.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ===== Content ===== */}
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[560px] items-center gap-10 py-14 lg:grid-cols-2 lg:gap-12 lg:py-16">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-xl"
          >
            {/* pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Data Engineer Salaries
            </div>

            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              Averaging ₹27.1 Lakhs in India, with top professionals earning
              <span className="font-semibold text-secondary"> ₹50.8+ Lakhs</span>
            </p>

            {/* ✅ FIXED H1 (perfect height like your old design) */}
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-[54px]">
              Transform Your Career <br />
              with{" "}
              <span className="bg-linear-to-r from-secondary to-[#7C3AED] bg-clip-text text-transparent">
                Premier Cloud &amp; Data
              </span>
              <br />
              Engineering Training
            </h1>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button className="group relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-secondary to-[#7C3AED] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,58,237,0.25)] transition hover:scale-[1.03] active:scale-[0.99]">
                ENROLL NOW
                <span className="pointer-events-none absolute inset-0 rounded-full bg-white/25 opacity-0 transition group-hover:opacity-10" />
              </button>

              <div className="text-sm text-slate-600">
                Have any questions?{" "}
                <span className="font-semibold text-slate-900">
                  (+91) 99435 32532
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* floating badges */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              className="pointer-events-none absolute left-0 top-6 hidden lg:block"
            >
              <StatCard label="Placements" value="9000+" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="pointer-events-none absolute right-0 bottom-6 hidden lg:block"
            >
              <StatCard label="Total Technologies" value="30+" />
            </motion.div>

            {/* glow behind image */}
            <div className="pointer-events-none absolute -z-10 right-4 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-linear-to-tr from-primary/15 via-secondary/10 to-[#7C3AED]/10 blur-3xl lg:right-0" />

            {/* image */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[520px]"
            >
<Image
  src={cldPublic("/qmatrix/Call_to_Actions1.png", "f_auto,q_auto,w_1200")}
  alt="Cloud Data Engineering"
  width={1200}
  height={900}
  priority
  className="w-full h-auto drop-shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
  sizes="(max-width: 1024px) 100vw, 520px"
/>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}