"use client";

import Image from "next/image";
import { BsPersonSquare } from "react-icons/bs";
import {
  ALUMNI_BG,
  ALUMNI_PERSON,
  LOGOS,
  type LogoItem,
} from "@/app/(site)/data/alumniLogos";

function LogoCard({ item }: { item: LogoItem }) {
  const isSvg = item.kind === "svg" || item.src.endsWith(".svg");

  return (
    <div
      title={item.name}
      className="
        flex h-[74px] items-center justify-center
        rounded-2xl border
        bg-white/95 px-5
        shadow-[0_10px_30px_rgba(8,42,94,0.10)]
        backdrop-blur-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_16px_36px_rgba(145,22,161,0.16)]
      "
      style={{
        borderColor: "color-mix(in srgb, var(--secondary) 18%, white)",
      }}
    >
      {isSvg ? (
        <img
          src={item.src}
          alt={item.name}
          loading="lazy"
          className="max-h-10 w-auto object-contain"
        />
      ) : (
        <Image
          src={item.src}
          alt={item.name}
          width={160}
          height={60}
          loading="lazy"
          className="max-h-10 w-auto object-contain"
        />
      )}
    </div>
  );
}

export default function AlumniWorkSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      {/* Background */}
      <Image
        src={ALUMNI_BG}
        alt="Digital banner background"
        fill
        priority
        className="object-cover"
      />

      {/* Theme overlays */}
      <div className="absolute inset-0 bg-white/88" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--secondary) 10%, transparent))",
        }}
      />
      <div
        className="absolute -left-24 top-10 h-[280px] w-[280px] rounded-full blur-3xl"
        style={{
          background:
            "color-mix(in srgb, var(--primary) 18%, transparent)",
        }}
      />
      <div
        className="absolute -right-24 bottom-0 h-[300px] w-[300px] rounded-full blur-3xl"
        style={{
          background:
            "color-mix(in srgb, var(--secondary) 18%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3">
            <div
              className="text-[28px] md:text-[34px]"
              style={{ color: "var(--secondary)" }}
            >
              <BsPersonSquare />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight md:text-4xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
                }}
              >
                Our Alumni Work at
              </span>
            </h2>
          </div>

          <p
            className="mx-auto mt-4 max-w-4xl text-sm font-medium leading-7 md:text-[18px]"
            style={{ color: "var(--tg-body-color)" }}
          >
            Trained at WHY TAP, placed at leading tech companies – see where our
            learners are making an impact.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
          {/* Left logos */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {LOGOS.map((item, idx) => (
                <LogoCard key={`${item.name}-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Right visual card */}
          <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:w-[360px] lg:flex-shrink-0">
            <div className="relative">
              {/* outer theme frame */}
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-[30px]"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--primary) 16%, white), color-mix(in srgb, var(--secondary) 14%, white))",
                }}
              />

              {/* main card */}
              <div
                className="relative rounded-[28px] border bg-white/95 p-4 backdrop-blur-md shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
                style={{
                  borderColor: "color-mix(in srgb, var(--secondary) 14%, white)",
                }}
              >
                <div className="relative mx-auto h-[470px] w-full overflow-hidden rounded-[24px] bg-[var(--tg-common-color-gray-2)]">
                  <Image
                    src={ALUMNI_PERSON}
                    alt="Alumni character"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                {/* floating content box */}
                <div
                  className="absolute bottom-8 left-1/2 w-[78%] -translate-x-1/2 rounded-3xl bg-white/95 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur"
                  style={{
                    border: "1px solid color-mix(in srgb, var(--primary) 10%, white)",
                  }}
                >
                  <h3
                    className="text-[16px] font-bold md:text-[17px]"
                    style={{ color: "var(--secondary)" }}
                  >
                    Join the Elite
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--tg-body-color)" }}
                  >
                    Become part of our growing alumni community today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}