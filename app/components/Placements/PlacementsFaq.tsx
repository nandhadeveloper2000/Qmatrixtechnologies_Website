"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

const placementFaqs = [
  {
    question: "Do you provide 100% placement guarantee?",
    answer:
      "We provide dedicated placement assistance, including resume building, mock interviews, job application support, and recruiter connections. Final selection always depends on the student’s skills, performance, communication, and interview results.",
  },
  {
    question: "When does placement support start?",
    answer:
      "Placement support usually begins once students complete the major portion of their course curriculum, practical assignments, and interview preparation activities. Early career guidance is also provided during the training journey.",
  },
  {
    question: "What kind of companies hire students from your programs?",
    answer:
      "Students get opportunities with service-based companies, product-based companies, startups, consulting firms, and enterprise organizations, depending on the course domain, hiring demand, and student readiness.",
  },
  {
    question: "Will I get interview preparation support?",
    answer:
      "Yes. We help students with technical interview questions, mock interviews, HR interview preparation, resume improvement, LinkedIn profile guidance, communication practice, and confidence building.",
  },
  {
    question: "Are freshers eligible for placement support?",
    answer:
      "Yes. Freshers, career switchers, and working professionals can all receive placement support. The level of opportunity depends on the student’s background, commitment, practical knowledge, and interview performance.",
  },
  {
    question: "Do you help with resume and LinkedIn profile building?",
    answer:
      "Yes. We guide students in creating ATS-friendly resumes, optimizing LinkedIn profiles, showcasing projects properly, and presenting their skills in a recruiter-friendly format.",
  },
  {
    question: "Will I get live job openings and referrals?",
    answer:
      "Students receive support with relevant openings, application guidance, and hiring updates whenever available through our placement network, training team, and recruiter ecosystem.",
  },
  {
    question: "What if I miss an interview opportunity?",
    answer:
      "Missing one opportunity does not end placement support. We continue to guide eligible students for upcoming openings, but students are strongly encouraged to stay active, responsive, and prepared throughout the process.",
  },
];

export default function PlacementsFaq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_45%,#f4f7ff_100%)] py-16 md:py-20 lg:py-24">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-[#082a5e]/5 blur-3xl" />
        <div className="absolute right-[-100px] top-16 h-80 w-80 rounded-full bg-[#9116a1]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#8121fb]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#082a5e_1px,transparent_1px),linear-gradient(to_bottom,#082a5e_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7f7] bg-white/80 px-4 py-2 text-sm font-semibold text-[#082a5e] shadow-[0_10px_30px_rgba(8,42,94,0.08)] backdrop-blur-xl">
            <HelpCircle className="h-4 w-4" />
            Placement FAQ
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#082a5e] md:text-4xl lg:text-5xl">
            Frequently Asked
            <span className="mt-2 block bg-gradient-to-r from-[#082a5e] via-[#9116a1] to-[#8121fb] bg-clip-text text-transparent">
              Placement Questions
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#39557e] md:text-base md:leading-8">
            Get clarity on placement assistance, interview support, hiring
            opportunities, and how we help students prepare for career success.
          </p>
        </div>

        {/* faq layout */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* left info card */}
          <div className="rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_25px_80px_rgba(8,42,94,0.08)] backdrop-blur-2xl md:p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#082a5e] via-[#9116a1] to-[#8121fb] text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="mt-5 text-2xl font-bold text-[#082a5e]">
              Placement Support That Goes Beyond Training
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#4a6488] md:text-base">
              Our focus is not only on teaching technical skills but also on
              preparing students for real hiring environments with practical
              guidance, profile building, and interview readiness.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Resume and LinkedIn profile guidance",
                "Mock interviews and communication practice",
                "Job application and recruiter support",
                "Interview-focused technical preparation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#edf2fb] bg-[#f9fbff] px-4 py-3"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#9116a1] to-[#8121fb]" />
                  <p className="text-sm font-medium text-[#25456f]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* faq accordion */}
          <div className="rounded-[30px] border border-white/70 bg-white/75 p-4 shadow-[0_25px_80px_rgba(8,42,94,0.08)] backdrop-blur-2xl md:p-5">
            <div className="space-y-4">
              {placementFaqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.question}
                    className={`overflow-hidden rounded-[24px] border bg-white/95 transition-all duration-300 ${
                      isOpen
                        ? "border-[#d8c2ef] shadow-[0_20px_50px_rgba(145,22,161,0.12)]"
                        : "border-[#e9eef7] shadow-sm"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                    >
                      <span className="text-sm font-semibold leading-6 text-[#082a5e] md:text-base">
                        {faq.question}
                      </span>

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "border-[#d8c2ef] bg-gradient-to-br from-[#9116a1] to-[#8121fb] text-white rotate-180"
                            : "border-[#e4ebf7] bg-[#f8fbff] text-[#082a5e]"
                        }`}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-[#eef2f9] px-5 pb-5 pt-4 md:px-6">
                          <p className="text-sm leading-7 text-[#4a6488] md:text-[15px]">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}