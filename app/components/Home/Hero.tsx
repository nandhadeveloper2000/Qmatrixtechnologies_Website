// app/components/Home/Hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { cldPublic } from "@/app/lib/cloudinary";

import { FaPython, FaAws } from "react-icons/fa";
import { SiSnowflake, SiDbt } from "react-icons/si";
import { TbSql } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";
import { GrOracle } from "react-icons/gr";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* FULL Background - keep original visual feel */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={cldPublic("/qmatrix/download.webp", "f_auto,q_auto,w_1800")}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/45 sm:bg-white/40" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-[1280px] px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-12 md:px-8 md:pt-12 md:pb-14 lg:px-10 lg:pt-14 lg:pb-16 xl:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          {/* LEFT */}
          <div className="order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="relative mb-5 inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-secondary/10 px-4 py-2 pr-10 text-[11px] font-medium text-secondary sm:gap-3 sm:px-5 sm:py-2.5 sm:pr-11 sm:text-sm">
              <span className="truncate">🏆 Leaders in Education Since 6 Years</span>

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Image
                  src={cldPublic("/qmatrix/robot.png", "f_auto,q_auto,w_64")}
                  alt="robot"
                  width={30}
                  height={30}
                  priority
                  className="h-6 w-6 animate-spin object-contain sm:h-7 sm:w-7"
                  style={{ animation: "spin 6s linear infinite" }}
                />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-lexend text-[30px] font-bold leading-[1.12] text-[#082A5E] sm:text-[38px] md:text-[42px] lg:text-[46px] xl:text-[54px] 2xl:text-[60px]">
              Best Software{" "}
              <span className="text-secondary">Training Institute in Chennai</span>
            </h1>

            {/* Paragraph */}
            <p className="mx-auto mt-5 max-w-xl font-body text-[15px] leading-8 text-primary sm:text-[16px] md:text-[17px] lg:mx-0 lg:text-[18px]">
              Best software training institute in Chennai, delivering job-ready
              tech skills through hands-on learning, expert trainers, and
              industry-aligned courses.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:mt-9 sm:flex-row sm:justify-center sm:gap-5 lg:justify-start">
              <Link
                href="/courses"
                className="btn btn-shine inline-flex h-[48px] min-w-[205px] items-center justify-center rounded-[14px] px-6 text-sm font-bold uppercase tracking-[0.03em] sm:h-[52px] sm:min-w-[220px] sm:px-7"
              >
                Explore Course →
              </Link>

              <a
                href="tel:+919943532532"
                className="flex items-center gap-3 text-left text-gray-800 transition hover:text-primary"
              >
                <Phone className="h-6 w-6 shrink-0 text-primary" />
                <div className="leading-tight">
                  <p className="text-[13px] text-gray-600 sm:text-[14px]">
                    Have any questions?
                  </p>
                  <p className="text-[17px] font-extrabold text-[#082A5E] sm:text-[20px]">
                    (+91) 99435 32532
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="order-2">
            <div className="relative mx-auto flex min-h-[420px] w-full max-w-[560px] items-end justify-center sm:min-h-[500px] sm:max-w-[620px] md:min-h-[560px] md:max-w-[680px] lg:min-h-[620px] lg:max-w-[720px] xl:min-h-[660px]">
              {/* All icons visible on all screens */}
              <div className="pointer-events-none absolute inset-0 z-10">
                <SiSnowflake className="floating absolute left-[8%] top-[12%] text-[24px] text-blue-500 sm:text-[28px] md:text-[34px] lg:text-[40px]" />
                <TbSql className="floating absolute left-[7%] top-[52%] text-[24px] text-blue-400 sm:text-[28px] md:text-[34px] lg:text-[40px]" />
                <SiDbt className="floating absolute bottom-[14%] left-[10%] text-[22px] text-orange-500 sm:text-[26px] md:text-[32px] lg:text-[38px]" />

                <FaAws className="floating absolute left-[53%] top-[5%] text-[24px] text-orange-400 sm:text-[28px] md:text-[34px] lg:text-[40px]" />
                <FaPython className="floating absolute right-[8%] top-[18%] text-[22px] text-yellow-500 sm:text-[26px] md:text-[32px] lg:text-[38px]" />
                <VscAzure className="floating absolute right-[8%] top-[54%] text-[24px] text-sky-500 sm:text-[28px] md:text-[34px] lg:text-[40px]" />
                <GrOracle className="floating absolute bottom-[14%] right-[9%] text-[22px] text-red-500 sm:text-[26px] md:text-[32px] lg:text-[38px]" />
              </div>

              {/* Main image */}
              <div className="relative z-20 flex w-full items-end justify-center">
                <Image
                  src={cldPublic("/qmatrix/1-1.png", "f_auto,q_auto,w_1100")}
                  alt="Student"
                  width={520}
                  height={640}
                  priority
                  className="h-auto w-[180px] object-contain drop-shadow-2xl sm:w-[230px] md:w-[300px] lg:w-[390px] xl:w-[430px]"
                />

                <div className="absolute bottom-3 left-1/2 h-10 w-[62%] -translate-x-1/2 rounded-full bg-black/15 blur-2xl sm:w-[56%]" />
              </div>

              {/* Placements card */}
              <div className="absolute left-[0%] top-[26%] z-30 rounded-2xl bg-white/92 px-3 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-md sm:left-[2%] sm:top-[22%] sm:px-4 sm:py-4 md:left-[5%] md:top-[22%] lg:left-[2%]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Image
                    src={cldPublic(
                      "qmatrix/Frame-1171277216-1-1.png",
                      "f_auto,q_auto,w_120"
                    )}
                    alt="placements"
                    width={40}
                    height={40}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  />
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 sm:text-[12px]">
                      Placements
                    </p>
                    <p className="text-[22px] font-extrabold leading-none text-[#082A5E] sm:text-[24px] md:text-[26px]">
                      1500+
                    </p>
                  </div>
                </div>
              </div>

              {/* Total technologies card */}
              <div className="absolute bottom-[10%] right-[0%] z-30 rounded-2xl bg-white/92 px-3 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-md sm:right-[2%] sm:bottom-[10%] sm:px-4 sm:py-4 md:right-[5%] lg:right-[1%]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Image
                    src={cldPublic(
                      "/qmatrix/Frame-1171277216-2.png",
                      "f_auto,q_auto,w_120"
                    )}
                    alt="success"
                    width={40}
                    height={40}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  />
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 sm:text-[12px]">
                      Total Technologies
                    </p>
                    <p className="text-[22px] font-extrabold leading-none text-[#082A5E] sm:text-[24px] md:text-[26px]">
                      5+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT END */}
        </div>
      </div>
    </section>
  );
}