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
      {/* ✅ FULL Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={cldPublic("/qmatrix/download.webp", "f_auto,q_auto,w_1600")}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/45" />
      </div>

      {/* ✅ CONTENT CONTAINER */}
      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-10">
        <div className="grid items-center gap-10 py-10 sm:gap-12 sm:py-12 md:gap-14 md:py-14 lg:grid-cols-2 lg:gap-16 lg:py-16">
          {/* ================= LEFT ================= */}
          <div className="text-center lg:text-left lg:pr-6 xl:pr-10">
            {/* Badge */}
            <div className="relative mb-5 inline-flex items-center gap-3 rounded-full bg-secondary/10 px-5 py-2 pr-11 text-sm font-medium text-secondary">
              🏆 Leaders in Education Since 6 Years

              {/* ✅ Robot (fixed: width/height required) */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Image
                  style={{ animation: "spin 6s linear infinite" }}
                  src={cldPublic("/qmatrix/robot.png", "f_auto,q_auto,w_64")}
                  alt="robot"
                  width={30}
                  height={30}
                  className="w-7 animate-spin"
                  priority
                />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-lexend text-[30px] font-bold leading-[1.12] text-[#082A5E] sm:text-[38px] md:text-[42px] lg:text-[46px] xl:text-[54px] 2xl:text-[60px]">
              Best Software{" "}
              <span className="text-secondary">
                Training Institute in Chennai
              </span>
            </h1>

            {/* Paragraph */}
            <p className="mx-auto mt-5 max-w-xl font-body text-[15px] text-primary sm:text-[16px] md:text-[17px] lg:mx-0 lg:text-[18px]">
              Best software training institute in Chennai, delivering job-ready
              tech skills through hands-on learning, expert trainers, and
              industry-aligned courses.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/courses"
                className="btn btn-shine inline-flex h-[48px] items-center justify-center px-7 font-bold"
              >
                Explore Course →
              </Link>

              <a
                href="tel:+917395953532"
                className="flex items-center gap-3 text-gray-800 transition hover:text-primary"
              >
                <Phone className="h-6 w-6 text-primary" />
                <div className="text-left leading-tight">
                  <p className="text-[13px] text-gray-600 sm:text-[14px]">
                    Have any questions?
                  </p>
                  <p className="text-[18px] font-extrabold text-[#082A5E] sm:text-[20px]">
                    (+91) 99435 32532
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="relative flex min-h-[340px] items-center justify-center sm:min-h-[420px] md:min-h-[460px] lg:min-h-[520px] lg:justify-end xl:min-h-[560px]">
            {/* Floating Icons */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <SiSnowflake className="floating absolute left-6 top-12 text-5xl text-blue-500" />
              <TbSql className="floating absolute left-8 top-1/2 -translate-y-1/2 text-5xl text-blue-400" />
              <SiDbt className="floating absolute bottom-10 left-10 text-5xl text-orange-500" />

              <FaAws className="floating absolute left-[48%] -top-6 text-5xl text-orange-400" />
              <FaPython className="floating absolute right-6 top-16 text-5xl text-yellow-500" />

              <VscAzure className="floating absolute right-4 top-1/2 -translate-y-1/2 text-5xl text-sky-500" />
              <GrOracle className="floating absolute bottom-10 right-6 text-5xl text-red-500" />
            </div>

            {/* Main Image */}
            <div className="relative z-10">
              {/* ✅ fixed: width/height required */}
              <Image
                src={cldPublic("/qmatrix/1-1.png", "f_auto,q_auto,w_1000")}
                alt="Student"
                width={520}
                height={640}
                priority
                className="
                  object-contain drop-shadow-2xl
                  w-[200px]
                  sm:w-[250px]
                  md:w-[300px]
                  lg:w-[400px]
                  xl:w-[400px]
                  2xl:w-[400px]
                  -ml-4 sm:-ml-6 lg:-ml-10
                  mr-6 sm:mr-8 lg:mr-10
                "
              />

              {/* Shadow */}
              <div className="absolute -bottom-2 left-1/2 h-10 w-56 -translate-x-1/2 rounded-full bg-black/15 blur-2xl" />
            </div>

            {/* LEFT CARD */}
            <div
              className="
                absolute z-20
                left-2 top-6
                sm:left-4 sm:top-8
                md:left-6 md:top-10
                lg:left-0 lg:top-24
                rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md
              "
            >
              <div className="flex items-center gap-4">
                <Image
                  src={cldPublic(
                    "qmatrix/Frame-1171277216-1-1.png",
                    "f_auto,q_auto,w_120"
                  )}
                  alt="students"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-[12px] font-medium text-gray-500">
                    Placements
                  </p>
                  <p className="text-[26px] font-extrabold text-[#082A5E]">
                    1500+
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div
              className="
                absolute z-20
                right-2 bottom-6
                sm:right-4 sm:bottom-8
                md:right-6 md:bottom-10
                lg:bottom-auto lg:top-[62%] lg:-translate-y-1/2
                lg:right-0 lg:translate-x-[70px]
                xl:translate-x-[95px]
                2xl:translate-x-[120px]
                rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md
              "
            >
              <div className="flex items-center gap-4">
                <Image
                  src={cldPublic(
                    "/qmatrix/Frame-1171277216-2.png",
                    "f_auto,q_auto,w_120"
                  )}
                  alt="success"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-[12px] font-medium text-gray-500">
                    Total Technologies
                  </p>
                  <p className="text-[26px] font-extrabold text-[#082A5E]">
                    5+
                  </p>
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