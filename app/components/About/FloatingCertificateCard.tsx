"use client";

import { useState } from "react";
import Image from "next/image";
import {
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  ClipboardCheck,
  LaptopMinimal,
  Rocket,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
  Award,
} from "lucide-react";
import { cldPublic } from "@/app/lib/cloudinary";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";

type FloatingCertificateCardProps = {
  publicId?: string;
  imageUrl?: string;
  title?: string;
  orgTag?: string;
  metaLeft?: string;
  metaRight?: string;
  buttonText?: string;
  courseName?: string;
  onButtonClick?: () => void;
};

export default function FloatingCertificateCard({
  publicId = "Qmatrix_Course_Completion.jpg_cldss4.jpg",
  imageUrl,
  title = "Course Completion Certificate",
  orgTag = "Qmatrix Verified",
  metaLeft = "Shareable & Resume-ready",
  metaRight = "Project-backed learning",
  buttonText = "ENQUIRE NOW",
  courseName = "Snowflake Training in Chennai",
  onButtonClick,
}: FloatingCertificateCardProps) {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  const src = imageUrl ?? cldPublic(publicId);

  const points = [
    { icon: GraduationCap, text: "Trainers are real-time industry experts" },
    {
      icon: BriefcaseBusiness,
      text: "Placement Assistance till you receive an offer for your dream job!",
    },
    { icon: FileText, text: "It makes your resume more valuable" },
    { icon: ClipboardCheck, text: "Free Resume Preparation" },
    { icon: LaptopMinimal, text: "Practical Classes" },
    { icon: Rocket, text: "Free Career Guidance" },
  ];

  function handleEnquiryClick() {
    if (onButtonClick) {
      onButtonClick();
      return;
    }
    setOpenEnquiry(true);
  }

  return (
    <>
      <section
        className="relative overflow-hidden py-14 md:py-16"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 60%)," +
            "radial-gradient(700px 450px at 85% 30%, rgba(255,255,255,0.10) 0%, transparent 55%)," +
            "linear-gradient(135deg, var(--tg-common-color-blue) 0%, var(--tg-common-color-indigo) 45%, var(--tg-common-color-purple) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] opacity-[0.18] bg-size-[18px_18px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-6 lg:grid-cols-2 lg:gap-14">
          <div className="text-white">
            <h2 className="text-2xl font-extrabold leading-snug md:text-3xl">
              Why Learn Snowflake Training in Chennai at Qmatrix Technologies?
            </h2>

            <div className="mt-7 space-y-5">
              {points.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <Icon className="mt-0.5 h-6 w-6 text-white/95" />
                    <p className="text-[15px] leading-relaxed text-white/95 md:text-base">
                      {p.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={handleEnquiryClick}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white px-10 py-3 text-[12px] font-extrabold tracking-wider text-[rgba(8,42,94,1)] shadow-[0_14px_35px_rgba(0,0,0,0.18)] transition hover:brightness-105 md:text-[13px]"
              >
                {buttonText}
              </button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.18),transparent)] blur-2xl" />
            <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(closest-side,rgba(0,0,0,0.10),transparent)] blur-2xl" />

            <div className="relative w-115 max-w-full animate-float">
              <div className="absolute inset-0 rounded-[28px] border border-white/50 bg-linear-to-br from-white/70 to-white/30 shadow-[0_30px_90px_rgba(0,0,0,0.20)] backdrop-blur-xl" />

              <div className="relative rounded-[28px] p-4">
                <div className="flex items-center justify-between px-2 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-primary">
                      {title}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-semibold text-primary">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {orgTag}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/50 to-transparent" />

                  <Image
                    src={src}
                    alt="Qmatrix Certificate"
                    width={900}
                    height={1200}
                    className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
                    priority
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/45 via-black/10 to-transparent">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-white">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Completion
                      </span>

                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-white">
                        <Award className="h-4 w-4" />
                        Industry Standard
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-center shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Benefit
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {metaLeft}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-center shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Outcome
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {metaRight}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!onButtonClick && (
        <EnquiryPopup
          open={openEnquiry}
          onClose={() => setOpenEnquiry(false)}
          defaultCourse={courseName}
        />
      )}
    </>
  );
}