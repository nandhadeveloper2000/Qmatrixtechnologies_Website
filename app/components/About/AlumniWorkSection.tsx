"use client";

import Image from "next/image";
import { BsPersonSquare } from "react-icons/bs";
import { ALUMNI_BG, ALUMNI_PERSON, LOGOS, type LogoItem } from "@/app/(site)/data/alumniLogos";

function LogoCard({ item, delay }: { item: LogoItem; delay: number }) {
  // ✅ For Cloudinary SVG, use <img>. For PNG/JPG/WebP, Next<Image> is fine.
  const isSvg = item.kind === "svg" || item.src.endsWith(".svg");

  return (
    <div
      className={[
        "flex items-center justify-center",
        "px-6 py-3",
        "bg-white/90 backdrop-blur",
        "rounded-xl shadow-[0_12px_30px_rgba(15,23,42,0.12)]",
        "ring-1 ring-slate-200/60",
        "transition-transform duration-300 will-change-transform",
        "hover:scale-[1.06]",
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
      title={item.name}
    >
      {isSvg ? (
        <img
          src={item.src}
          alt={item.name}
          className="max-h-10 w-auto object-contain"
          loading="lazy"
        />
      ) : (
        <Image
          src={item.src}
          alt={item.name}
          width={160}
          height={60}
          className="max-h-10 w-auto object-contain"
          loading="lazy"
        />
      )}
    </div>
  );
}

export default function AlumniWorkSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <Image
        src={ALUMNI_BG}
        alt="Digital banner background"
        fill
        priority
        className="object-cover"
      />
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-white/70" />

      {/* Header */}
      <div className="relative mx-auto max-w-7xl pt-10">
        <div className="flex items-center gap-3 justify-center">
          <div className="text-[#082a5e] text-4xl">
            <BsPersonSquare />
          </div>

          <h3 className="font-extrabold md:text-3xl text-xl">
            <span className="bg-linear-to-r from-[#082a5e] to-[#9116a1] bg-clip-text text-transparent">
              Our Alumni Work at
            </span>
          </h3>
        </div>

        <p className="mt-4 px-6 md:px-32 text-justify md:text-center text-base md:text-lg font-medium text-slate-700">
          Trained at WHY TAP, placed at leading tech companies – see where our learners are making an impact.
        </p>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl flex flex-wrap lg:flex-nowrap gap-10 items-center pb-14 pt-8">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 px-3 flex-grow md:pl-10">
          {LOGOS.map((item, idx) => (
            <LogoCard key={`${item.name}-${idx}`} item={item} delay={idx * 40} />
          ))}
        </div>

        {/* Right image */}
        <div className="flex justify-center flex-shrink-0 w-full lg:w-[520px] relative">
          <div className="relative w-[320px] sm:w-[380px] lg:w-[420px] aspect-[4/5] -mt-6">
            <Image
              src={ALUMNI_PERSON}
              alt="Alumni"
              fill
              className="object-cover rounded-2xl shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}