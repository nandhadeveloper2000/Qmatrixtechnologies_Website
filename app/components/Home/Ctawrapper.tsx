// app/components/Home/Ctawrapper.tsx
"use client";

import { useState } from "react";
import { cldPublic } from "@/app/lib/cloudinary";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";

const cloudImg = cldPublic(
  "/qmatrix/Cloud-Data-Engineering-2-e1651335765376.png",
  "f_auto,q_auto,w_1000"
);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const card: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

const textWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Ctawrapper() {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white px-6 py-20">
        <motion.div
          aria-hidden
          className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-primary/12 blur-3xl"
          animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          aria-hidden
          className="absolute bottom-0 right-0 h-[480px] w-[480px] rounded-full bg-secondary/12 blur-3xl"
          animate={{ y: [0, 16, 0], x: [0, -12, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.45) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        <motion.div
          variants={card}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.15)] backdrop-blur-xl md:p-16"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-0 h-40 w-full rotate-6 bg-linear-to-r from-transparent via-white/55 to-transparent"
            animate={{ x: ["-35%", "35%"] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              variants={textWrap}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.h2
                variants={fadeUp}
                className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl"
              >
                Master the Future – Premier Cloud & Data Engineering Training
                Center
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mb-8 text-base leading-7 text-slate-600"
              >
                At{" "}
                <span className="font-semibold text-primary">
                  QMatrix Technologies
                </span>
                , we empower you with industry-ready skills in Cloud, Data
                Engineering, and AI. Learn from expert trainers, work on
                real-time projects, and accelerate your career with globally
                in-demand technologies.
              </motion.p>

              <motion.div variants={fadeUp}>
                <button
                  type="button"
                  onClick={() => setOpenEnquiry(true)}
                  className="group relative inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary to-secondary px-8 py-3 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute -left-[120%] top-0 h-full w-[120%] bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[220%]" />
                  </span>

                  <span className="relative">Enroll Now</span>
                  <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </motion.div>
            </motion.div>

            <div className="relative flex justify-center md:justify-end">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full bg-linear-to-tr from-primary/22 to-secondary/22 blur-2xl"
                animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <Image
                  src={cloudImg}
                  alt="Cloud Data Engineering"
                  width={520}
                  height={520}
                  className="w-full max-w-md object-contain drop-shadow-2xl"
                  priority={false}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <EnquiryPopup
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        defaultCourse="Cloud & Data Engineering"
      />
    </>
  );
}