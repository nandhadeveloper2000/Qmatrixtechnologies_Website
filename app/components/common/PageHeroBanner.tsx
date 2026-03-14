"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type StatItem = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type CTAButton = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

type PageHeroBannerProps = {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  highlight?: string;
  description?: string;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  primaryCta?: CTAButton;
  secondaryCta?: CTAButton;
  stats?: StatItem[];
  align?: "left" | "center";
  minHeight?: "sm" | "md" | "lg";
  theme?: "brand" | "violet" | "indigo";
  bottomWaveColor?: string;
  containerClassName?: string;
};

function getThemeClasses(theme: PageHeroBannerProps["theme"]) {
  switch (theme) {
    case "violet":
      return {
        gradient: "from-[#2f3f8f] via-[#7b2cbf] to-[#c218c9]",
        ring: "border-white/15",
        glass: "bg-white/10",
      };

    case "indigo":
      return {
        gradient: "from-[#0f1c4d] via-[#3b1c71] to-[#6d28d9]",
        ring: "border-white/15",
        glass: "bg-white/10",
      };

    case "brand":
    default:
      return {
        gradient: "from-[#082a5e] via-[#9116a1] to-[#8121fb]",
        ring: "border-white/15",
        glass: "bg-white/10",
      };
  }
}

function getHeightClasses(minHeight: PageHeroBannerProps["minHeight"]) {
  switch (minHeight) {
    case "sm":
      return "py-16 md:py-20 lg:py-24";
    case "lg":
      return "py-24 md:py-28 lg:py-32";
    case "md":
    default:
      return "py-20 md:py-24 lg:py-28";
  }
}

export default function PageHeroBanner({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlight,
  description,
  breadcrumbs = [],
  primaryCta,
  secondaryCta,
  stats = [],
  align = "left",
  minHeight = "md",
  theme = "brand",
  bottomWaveColor = "#ffffff",
  containerClassName = "",
}: PageHeroBannerProps) {
  const themeClasses = getThemeClasses(theme);
  const heightClasses = getHeightClasses(minHeight);

  const isCenter = align === "center";
  const hasStats = stats.length > 0;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className={[
          "relative overflow-hidden bg-gradient-to-br",
          themeClasses.gradient,
          heightClasses,
          containerClassName,
        ].join(" ")}
      >
        {/* top soft light */}
        <div className="absolute inset-0 bg-[radial-gradient(760px_320px_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />

        {/* premium radial lights */}
        <div className="absolute inset-0 bg-[radial-gradient(520px_240px_at_10%_18%,rgba(255,255,255,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_240px_at_90%_18%,rgba(255,255,255,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(480px_240px_at_50%_100%,rgba(255,255,255,0.08),transparent_72%)]" />

        {/* blurred premium glows */}
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

        {/* fine grid */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* extra vignette */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div
            className={[
              "grid items-center gap-10",
              hasStats && !isCenter
                ? "lg:grid-cols-[1.15fr_0.85fr]"
                : "grid-cols-1",
            ].join(" ")}
          >
            {/* left / center content */}
            <div className={isCenter ? "text-center" : "text-center lg:text-left"}>
              {badge ? (
                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md",
                    themeClasses.ring,
                    themeClasses.glass,
                  ].join(" ")}
                >
                  {BadgeIcon ? <BadgeIcon className="h-4 w-4" /> : null}
                  <span>{badge}</span>
                </div>
              ) : null}

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                {title}
                {highlight ? (
                  <span className="block bg-gradient-to-r from-white via-fuchsia-100 to-violet-100 bg-clip-text text-transparent">
                    {highlight}
                  </span>
                ) : null}
              </h1>

              {description ? (
                <p
                  className={[
                    "mt-5 text-base leading-7 text-white/80 md:text-lg",
                    isCenter ? "mx-auto max-w-3xl" : "mx-auto max-w-2xl lg:mx-0",
                  ].join(" ")}
                >
                  {description}
                </p>
              ) : null}

              {(primaryCta || secondaryCta) && (
                <div
                  className={[
                    "mt-8 flex flex-col gap-4 sm:flex-row",
                    isCenter
                      ? "items-center justify-center"
                      : "items-center lg:justify-start",
                  ].join(" ")}
                >
                  {primaryCta &&
                    (primaryCta.href ? (
                      <Link
                        href={primaryCta.href}
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#082a5e] shadow-[0_12px_35px_rgba(255,255,255,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(255,255,255,0.28)]"
                      >
                        {primaryCta.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={primaryCta.onClick}
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#082a5e] shadow-[0_12px_35px_rgba(255,255,255,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(255,255,255,0.28)]"
                      >
                        {primaryCta.label}
                      </button>
                    ))}

                  {secondaryCta &&
                    (secondaryCta.href ? (
                      <Link
                        href={secondaryCta.href}
                        className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/15"
                      >
                        {secondaryCta.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={secondaryCta.onClick}
                        className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/15"
                      >
                        {secondaryCta.label}
                      </button>
                    ))}
                </div>
              )}

              {breadcrumbs.length > 0 && (
                <div
                  className={[
                    "mt-8 flex flex-wrap items-center gap-2 text-sm text-white/80",
                    isCenter ? "justify-center" : "justify-center lg:justify-start",
                  ].join(" ")}
                >
                  {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                      <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                        {item.href && !isLast ? (
                          <Link href={item.href} className="transition hover:text-white">
                            {item.label}
                          </Link>
                        ) : (
                          <span className={isLast ? "font-medium text-white" : ""}>
                            {item.label}
                          </span>
                        )}

                        {!isLast && <ChevronRight className="h-4 w-4 opacity-60" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* right stats */}
            {hasStats && !isCenter ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {stats.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={`${item.label}-${index}`}
                      className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                    >
                      <div className="flex items-center gap-3">
                        {Icon ? (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                            <Icon className="h-6 w-6" />
                          </div>
                        ) : null}

                        <div>
                          <p className="text-2xl font-bold text-white">{item.value}</p>
                          <p className="text-sm text-white/75">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block h-[110px] w-full"
            viewBox="0 0 1440 110"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,120 480,120 720,70 C960,20 1200,10 1440,80 L1440,110 L0,110 Z"
              fill={bottomWaveColor}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}