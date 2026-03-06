import React from "react";
import Image from "next/image";
import {
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  ClipboardCheck,
  LaptopMinimal,
  Rocket,
  ArrowUpRight,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
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
  orgTag = "QMatrix Verified",
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
      text: "Placement Assistance till you receive an offer for your dream job!",
    },
    { icon: FileText, text: "It makes your resume more valuable" },
    { icon: ClipboardCheck, text: "Free Resume Preparation" },
    { icon: LaptopMinimal, text: "Practical Classes" },
    { icon: Rocket, text: "Free Career Guidance" },
  ];

  return (
    <section
      className="relative py-14 md:py-16 overflow-hidden"
      style={{
        background:
          "radial-gradient(900px 500px at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 60%)," +
          "radial-gradient(700px 450px at 85% 30%, rgba(255,255,255,0.10) 0%, transparent 55%)," +
          "linear-gradient(135deg, var(--tg-common-color-blue) 0%, var(--tg-common-color-indigo) 45%, var(--tg-common-color-purple) 100%)",
      }}
    >
      {/* soft overlay texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative">
        {/* LEFT */}
        <div className="text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-snug">
            Why Learn Snowflake Training in Chennai at QMatrix Technologies?
          </h2>

          <div className="mt-7 space-y-5">
            {points.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-start gap-4">
                  <Icon className="h-6 w-6 text-white/95 mt-0.5" />
                  <p className="text-[15px] md:text-base text-white/95 leading-relaxed">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={onButtonClick}
              className="inline-flex items-center justify-center rounded-full px-10 py-3 font-extrabold tracking-wider text-[12px] md:text-[13px]
                         bg-white text-[rgba(8,42,94,1)] border border-white/40
                         shadow-[0_14px_35px_rgba(0,0,0,0.18)]
                         hover:brightness-105 transition"
            >
              ENQUIRE NOW
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Premium ambient glow */}
          <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.18),transparent)] blur-2xl" />
          <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(closest-side,rgba(0,0,0,0.10),transparent)] blur-2xl" />

          {/* Floating wrapper */}
          <div className="relative w-[460px] max-w-full animate-float">
            {/* Glass border */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/50 shadow-[0_30px_90px_rgba(0,0,0,0.20)]" />

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
                  alt="QMatrix Certificate"
                  width={900}
                  height={1200}
                  className="w-full h-auto transition-transform duration-700 hover:scale-[1.03]"
                  priority
                />

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/45 via-black/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-black text-xs font-semibold">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}