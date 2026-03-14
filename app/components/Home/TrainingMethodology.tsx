"use client";

import Image from "next/image";
import {
  trainingSteps,
  trainingAccents,
  type TrainingStep,
} from "@/app/(site)/data/trainingMethodology";

function StepCard({
  item,
  index,
  position = "bottom",
}: {
  item: TrainingStep;
  index: number;
  position?: "top" | "bottom";
}) {
  const isTop = position === "top";

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Pointer diamond */}
      <div
        className={[
          "absolute h-5 w-5 rotate-45",
          isTop ? "-bottom-2.5" : "-top-2.5",
          "bg-linear-to-r",
          trainingAccents[index % trainingAccents.length],
        ].join(" ")}
      />

      {/* Card */}
      <div className="w-full rounded-2xl bg-white px-6 py-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-2.5 flex justify-center">
          <Image
            src={item.img}
            alt={item.title}
            width={36}
            height={36}
            className="h-9 w-9"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
      </div>
    </div>
  );
}

export default function TrainingMethodology() {
  return (
    <section className="relative isolate w-full overflow-hidden py-14 md:py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-white to-secondary/5" />
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider text-gray-500">
            Our Process
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Training Methodology
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            From fundamentals to placement — follow our structured learning flow
            with mentorship, projects, and interview preparation.
          </p>
        </div>

        {/* MOBILE */}
        <div className="relative mt-10 md:hidden">
          <div className="absolute left-4 top-0 h-full w-[2px] bg-linear-to-b from-primary/25 via-gray-200 to-secondary/25" />

          <ol className="space-y-9">
            {trainingSteps.map((item, index) => (
              <li key={item.title} className="relative">
                <div
                  className={[
                    "absolute left-4 top-6 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full",
                    "bg-linear-to-r shadow-lg ring-4 ring-white",
                    trainingAccents[index % trainingAccents.length],
                  ].join(" ")}
                >
                  <span className="text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="ml-12">
                  <StepCard item={item} index={index} position="bottom" />
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* DESKTOP */}
        <div className="mt-12 hidden md:block">
          <div className="relative rounded-3xl border border-gray-100 bg-white/70 p-8 shadow-sm backdrop-blur">
            {/* TOP cards */}
            <div className="grid grid-cols-8 gap-5">
              {trainingSteps.map((item, index) => {
                const step = index + 1;
                const isTop = step % 2 === 0;

                return (
                  <div key={`top-${item.title}`} className="flex justify-center">
                    {isTop ? (
                      <div className="w-full max-w-[200px] pb-5">
                        <StepCard item={item} index={index} position="top" />
                      </div>
                    ) : (
                      <div className="h-[160px]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* DOTS + line */}
            <div className="relative mt-2">
              <div className="absolute left-6 right-6 top-5 h-[3px] rounded-full bg-linear-to-r from-primary/25 via-gray-200 to-secondary/25" />

              <div className="grid grid-cols-8 gap-5">
                {trainingSteps.map((_, index) => (
                  <div key={`dot-${index}`} className="flex justify-center">
                    <div
                      className={[
                        "z-10 flex h-10 w-10 items-center justify-center rounded-full",
                        "bg-linear-to-r shadow-lg ring-4 ring-white",
                        trainingAccents[index % trainingAccents.length],
                      ].join(" ")}
                    >
                      <span className="text-xs font-semibold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM cards */}
            <div className="mt-6 grid grid-cols-8 gap-5">
              {trainingSteps.map((item, index) => {
                const step = index + 1;
                const isBottom = step % 2 !== 0;

                return (
                  <div key={`bottom-${item.title}`} className="flex justify-center">
                    {isBottom ? (
                      <div className="w-full max-w-[200px] pt-5">
                        <StepCard item={item} index={index} position="bottom" />
                      </div>
                    ) : (
                      <div className="h-[160px]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 rounded-3xl bg-linear-to-r from-primary to-secondary p-7 text-center text-white shadow-lg">
          <h3 className="text-xl font-semibold md:text-2xl">
            We Don’t Just Teach — We Prepare You for Real Careers 🚀
          </h3>
          <p className="mt-2 text-sm opacity-90 md:text-base">
            Personalized mentorship + Real projects + Placement assistance.
          </p>
        </div>
      </div>
    </section>
  );
}