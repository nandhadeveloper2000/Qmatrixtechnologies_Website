"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Send } from "lucide-react";
import { cldPublic } from "@/app/lib/cloudinary";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";

const studentImage = cldPublic("qmatrix/ctaimg.png", "f_auto,q_auto,w_900");
const bgFrame =
  "https://res.cloudinary.com/dfbbnzwmc/image/upload/qmatrix/it-courses-in-chennai-background-frame.png";

export default function NewsletterCTA() {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  return (
    <>
      <section className="mt-14">
        <div className="relative overflow-hidden rounded-[36px] border border-[#ead9e8] bg-[#f7f4f6] shadow-[0_24px_80px_rgba(122,28,116,0.12)]">
          {/* background frame */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `url(${bgFrame})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* soft glows */}
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-fuchsia-200/25 blur-3xl" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-20 h-52 w-52 rounded-full bg-pink-200/20 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[320px_1fr]">
            {/* Left image */}
            <div className="relative flex h-full items-end justify-center px-6 pt-8 lg:px-0 lg:pt-0">
              <div className="relative w-full max-w-70 lg:max-w-[320px]">
                <Image
                  src={studentImage}
                  alt="QMatrix student"
                  width={420}
                  height={520}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right content */}
            <div className="px-6 pb-8 pt-2 sm:px-8 lg:px-10 lg:py-10">
              <div className="mx-auto max-w-4xl text-center lg:text-left">
                <p className="inline-flex rounded-full border border-[#c98ab7]/40 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9f155f] backdrop-blur">
                  Career Guidance • Enquiry Form
                </p>

                <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-[#9116a1] sm:text-3xl lg:text-[2.35rem] lg:leading-[1.2]">
                  Take the first step toward your IT & digital career!
                </h3>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base lg:mx-0">
                  Your journey to expertise starts here. Fill out the enquiry
                  form and our team will connect you with the right training
                  program to shape your future in the IT industry.
                </p>

                <div className="mt-8 grid gap-6 rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9116a1]/10 text-[#9116a1]">
                        <Send className="h-5 w-5" />
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-900 sm:text-xl">
                          Take the first step toward your IT & digital career!
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
                          Click the Apply Now button and fill out the form to
                          get personalized guidance from our team.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:justify-self-end">
                    <button
                      type="button"
                      onClick={() => setOpenEnquiry(true)}
                      className="group inline-flex h-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#9f155f_0%,#c21875_100%)] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(159,21,95,0.28)] transition hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(159,21,95,0.34)]"
                    >
                      Apply Now!
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 lg:justify-start">
                  <span className="rounded-full bg-white/70 px-3 py-1">
                    Expert Career Guidance
                  </span>
                  <span className="rounded-full bg-white/70 px-3 py-1">
                    Industry-Focused Courses
                  </span>
                  <span className="rounded-full bg-white/70 px-3 py-1">
                    Placement-Oriented Learning
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnquiryPopup
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
      />
    </>
  );
}