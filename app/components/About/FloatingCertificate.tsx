import React from "react";
import Image from "next/image";
import {
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  ClipboardCheck,
  LaptopMinimal,
  Rocket,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { cldPublic } from "@/app/lib/cloudinary";

type FloatingCertificateCardProps = {
  publicId?: string;
  imageUrl?: string;
  title?: string;
  orgTag?: string;
  metaLeft?: string;
  metaRight?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function FloatingCertificateCard({
  publicId = "Qmatrix_Course_Completion.jpg_cldss4.jpg",
  imageUrl,
  title = "Course Completion Certificate",
  orgTag = "Qmatrix Verified",
  metaLeft = "Shareable & Resume-ready",
  metaRight = "Project-backed learning",
  buttonText = "View Sample",
  onButtonClick,
}: FloatingCertificateCardProps) {
  const src = imageUrl ?? cldPublic(publicId);

  const points = [
    { icon: GraduationCap, text: "Trainers are real-time industry experts" },
    {
      icon: BriefcaseBusiness,
      text: "Placement assistance till you receive an offer for your dream job",
    },
    { icon: FileText, text: "It makes your resume more valuable" },
    { icon: ClipboardCheck, text: "Free resume preparation" },
    { icon: LaptopMinimal, text: "Practical classes with real-time projects" },
    { icon: Rocket, text: "Free career guidance" },
  ];

  return (
    <section
      className="
        relative py-16 md:py-20 overflow-hidden
        bg-[linear-gradient(180deg,var(--background),var(--tg-common-color-gray-2))]
      "
    >
      {/* Theme ambient background glows (uses your CSS vars) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-[70px]
            bg-[radial-gradient(circle,rgba(145,22,161,0.25),transparent_60%)]
          "
        />
        <div
          className="
            absolute top-10 -right-40 h-[560px] w-[560px] rounded-full blur-[80px]
            bg-[radial-gradient(circle,rgba(8,42,94,0.22),transparent_60%)]
          "
        />
        <div
          className="
            absolute -bottom-48 left-1/3 h-[620px] w-[620px] rounded-full blur-[90px]
            bg-[radial-gradient(circle,rgba(155,81,224,0.18),transparent_60%)]
          "
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
        {/* LEFT (pink removed -> glass/white themed card) */}
        <div
          className="
            relative overflow-hidden rounded-[28px] p-8 md:p-10
            bg-white/80 backdrop-blur-xl
            border border-white/60
            shadow-[0_24px_80px_rgba(8,42,94,0.14)]
          "
        >
          {/* top accent strip */}
          <div
            className="
              pointer-events-none absolute inset-x-0 top-0 h-1.5
              bg-[linear-gradient(90deg,var(--secondary),var(--tg-common-color-indigo),var(--primary))]
              opacity-90
            "
          />
          {/* subtle inner gradient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(145,22,161,0.10),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(8,42,94,0.10),transparent_55%)]" />

          <h2 className="relative text-2xl md:text-3xl font-extrabold leading-snug text-[var(--tg-heading-color)]">
            Why Learn Snowflake Training in Chennai at Qmatrix Technologies?
          </h2>

          <div className="relative mt-8 space-y-5">
            {points.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-start gap-4">
                  <span
                    className="
                      mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl
                      bg-[linear-gradient(180deg,rgba(145,22,161,0.10),rgba(8,42,94,0.08))]
                      ring-1 ring-[rgba(8,42,94,0.12)]
                    "
                  >
                    <Icon className="h-5 w-5 text-[var(--secondary)]" />
                  </span>

                  <p className="text-[15px] md:text-base text-[var(--tg-body-color)] leading-relaxed">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative mt-10">
            <button
              type="button"
              className="
                inline-flex items-center justify-center rounded-full px-8 py-3
                font-extrabold tracking-wider text-[12px] md:text-[13px]
                bg-[var(--primary)] text-white
                shadow-[0_18px_45px_rgba(8,42,94,0.28)]
                hover:brightness-110 transition
              "
            >
              ENQUIRE NOW
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Premium ambient glow */}
          <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(8,42,94,0.16),transparent)] blur-2xl" />
          <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(closest-side,rgba(145,22,161,0.12),transparent)] blur-2xl" />

          {/* Floating wrapper */}
          <div className="relative w-[460px] max-w-full animate-float">
            {/* Glass border */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/50 shadow-[0_30px_90px_rgba(8,42,94,0.22)]" />

            <div className="relative rounded-[28px] p-4">
              {/* Header */}
              <div className="flex items-center justify-between px-2 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    {title}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--primary)] bg-white/70 border border-white/60 px-3 py-1 rounded-full">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {orgTag}
                </span>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/50 to-transparent" />

                <Image
                  src={src}
                  alt="Qmatrix Certificate"
                  width={900}
                  height={1200}
                  className="w-full h-auto transition-transform duration-700 hover:scale-[1.03]"
                />

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-white text-xs font-semibold">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Completion
                    </span>

                    <span className="inline-flex items-center gap-2 text-white text-xs font-semibold">
                      <Award className="h-4 w-4" />
                      Industry Standard
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 px-2">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-2xl bg-white/70 border border-white/60 p-3">
                    <p className="text-[11px] text-gray-500">Outcome</p>
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {metaLeft}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 border border-white/60 p-3">
                    <p className="text-[11px] text-gray-500">Learning</p>
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {metaRight}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onButtonClick}
                  className="
                    group w-full rounded-full
                    bg-[var(--primary)] text-white font-semibold text-sm px-5 py-3
                    shadow-[0_18px_45px_rgba(8,42,94,0.30)]
                    hover:brightness-110 transition
                    flex items-center justify-center gap-2
                  "
                >
                  {buttonText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <p className="mt-3 text-[11px] text-gray-500 text-center">
                  Add this certificate to LinkedIn • Recruiter-friendly proof
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}