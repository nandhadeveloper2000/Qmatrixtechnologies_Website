"use client";

import { cldPublic } from "@/app/lib/cloudinary";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  LaptopMinimal,
  Wrench,
  Briefcase,
  Globe,
  BadgePercent,
  LayoutGrid,
  Users,
} from "lucide-react";

type Item = {
  icon: LucideIcon;
  text: string;
};

const LEFT: Item[] = [
  { icon: GraduationCap, text: "100% Assured Placement" },
  { icon: LaptopMinimal, text: "Hands-on Experience with Live Projects" },
  { icon: Wrench, text: "Soft-Skill Training for Interview Success" },
  { icon: Briefcase, text: "No Cost EMI" },
];

const RIGHT: Item[] = [
  { icon: Globe, text: "Certificates" },
  { icon: BadgePercent, text: "Affordable Fees" },
  { icon: LayoutGrid, text: "Learning Management System" },
  { icon: Users, text: "Mentored by Industry Experts" },
];

function FeatureItem({ item }: { item: Item }) {
  const Icon = item.icon;

  return (
    <div
      className={[
        "group flex items-center gap-4",
        "rounded-2xl border border-black/5 bg-white/75 backdrop-blur",
        "px-5 py-4 shadow-[0_14px_50px_rgba(15,23,42,0.08)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)]",
      ].join(" ")}
    >
      <div className="relative shrink-0">
        <div className="absolute -inset-2 rounded-full bg-[radial-gradient(circle_at_center,rgba(145,22,161,0.25),transparent_60%)] opacity-0 blur-md transition group-hover:opacity-100" />
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white ring-1 ring-black/10">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#082a5e,#9116a1)] shadow-[0_14px_34px_rgba(145,22,161,0.22)]">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <p className="text-[15px] font-semibold leading-snug text-[#082a5e] sm:text-base">
        {item.text}
      </p>
    </div>
  );
}

export default function WhyChooseSection() {
  const studentImage = cldPublic("student_uvjfcw.png");

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-24 h-130 w-130 rounded-full bg-[rgba(145,22,161,0.16)] blur-3xl" />
        <div className="absolute -right-44 -bottom-28 h-140 w-140 rounded-full bg-[rgba(8,42,94,0.14)] blur-3xl" />
        <div className="absolute left-1/2 top-10 h-155 w-155 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(145,22,161,0.12),rgba(8,42,94,0.08),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-2 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            <span className="text-[#082a5e]">Why Choose</span>{" "}
            <span className="bg-[linear-gradient(90deg,#9116a1,#a724e4,#082a5e)] bg-clip-text text-transparent">
              Qmatrix Technologies?
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-[linear-gradient(90deg,#082a5e,#9116a1)]" />

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Industry-ready training with real projects, mentor support, and
            placement guidance — built for results.
          </p>
        </div>

        <div className="mt-2 hidden items-center gap-10 lg:grid lg:grid-cols-3">
          <div className="space-y-6">
            {LEFT.map((item, idx) => (
              <FeatureItem key={idx} item={item} />
            ))}
          </div>

          <div className="relative mx-auto w-full max-w-95 sm:max-w-110">
            <div className="relative ml-16 aspect-3/4 w-60 sm:w-85 lg:w-87.5">
              <Image
                src={studentImage}
                alt="Student"
                fill
                priority
                className="object-contain drop-shadow-[0_22px_60px_rgba(8,42,94,0.22)]"
              />
            </div>
          </div>

          <div className="space-y-6">
            {RIGHT.map((item, idx) => (
              <FeatureItem key={idx} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          <div className="grid gap-6 sm:grid-cols-2">
            {[...LEFT, ...RIGHT].map((item, idx) => (
              <FeatureItem key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}