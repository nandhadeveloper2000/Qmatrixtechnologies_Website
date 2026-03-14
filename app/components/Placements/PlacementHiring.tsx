"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { placementLogos } from "@/app/(site)/data/placements-data";

export default function PlacementHiring() {
  const topRow = [...placementLogos, ...placementLogos];
  const bottomRow = [...placementLogos.slice().reverse(), ...placementLogos.slice().reverse()];

  return (
    <section className="placement-hiring-section relative overflow-hidden py-16 md:py-20 lg:py-24">
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="placement-orb placement-orb-1" />
        <div className="placement-orb placement-orb-2" />
        <div className="placement-orb placement-orb-3" />
        <div className="placement-grid absolute inset-0" />
        <div className="placement-noise absolute inset-0" />
        <div className="placement-ambient-line placement-ambient-line-1" />
        <div className="placement-ambient-line placement-ambient-line-2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7f7] bg-white/80 px-4 py-2 text-sm font-semibold text-[#082a5e] shadow-[0_10px_30px_rgba(8,42,94,0.08)] backdrop-blur-xl">
            <Building2 className="h-4 w-4" />
            Hiring Ecosystem
          </div>

          <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-[#082a5e] md:text-4xl lg:text-5xl">
            Opportunities With
            <span className="mt-2 block bg-gradient-to-r from-[#082a5e] via-[#9116a1] to-[#8121fb] bg-clip-text text-transparent">
              Top Recruiters
            </span>
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#39557e] md:text-base md:leading-8">
            Our students get opportunities to work with leading IT companies,
            global enterprises, and product-based organizations through our
            dedicated placement assistance and recruiter network.
          </p>
        </div>

        {/* marquee shell */}
        <div className="relative mt-14 overflow-hidden rounded-[34px] border border-white/70 bg-white/60 p-4 shadow-[0_30px_90px_rgba(8,42,94,0.10)] backdrop-blur-2xl md:p-6 lg:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          <div className="pointer-events-none absolute inset-x-16 top-0 h-24 rounded-full bg-white/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-20 rounded-full bg-[#9116a1]/[0.06] blur-3xl" />

          {/* edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#f8fbff] via-[#f8fbff]/90 to-transparent md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-white via-white/90 to-transparent md:w-28" />

          <div className="relative space-y-5 md:space-y-6">
            {/* row 1 */}
            <div className="group overflow-hidden">
              <div className="placement-marquee-left flex w-max gap-5 will-change-transform group-hover:[animation-play-state:paused]">
                {topRow.map((company, index) => (
                  <div
                    key={`top-${company.name}-${index}`}
                    className="placement-logo-card group/logo relative flex min-h-[118px] min-w-[190px] items-center justify-center overflow-hidden rounded-[28px] border border-[#eaf1fb] bg-white/90 px-6 py-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d8c2ef]"
                  >
                    <div className="placement-card-shine" />
                    <div className="placement-card-glow" />
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

                    <div className="relative z-10 h-[52px] w-full transition-transform duration-500 group-hover/logo:scale-[1.05]">
                      <Image
                        src={company.src}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain"
                        unoptimized={company.kind === "svg"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* row 2 */}
            <div className="group overflow-hidden">
              <div className="placement-marquee-right flex w-max gap-5 will-change-transform group-hover:[animation-play-state:paused]">
                {bottomRow.map((company, index) => (
                  <div
                    key={`bottom-${company.name}-${index}`}
                    className="placement-logo-card group/logo relative flex min-h-[118px] min-w-[190px] items-center justify-center overflow-hidden rounded-[28px] border border-[#eaf1fb] bg-white/90 px-6 py-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d8c2ef]"
                  >
                    <div className="placement-card-shine" />
                    <div className="placement-card-glow" />
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

                    <div className="relative z-10 h-[52px] w-full transition-transform duration-500 group-hover/logo:scale-[1.05]">
                      <Image
                        src={company.src}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain"
                        unoptimized={company.kind === "svg"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* bottom note */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#9116a1]/80 md:text-sm">
            Trusted hiring exposure across service, product, and startup ecosystems
          </p>
        </div>
      </div>
    </section>
  );
}