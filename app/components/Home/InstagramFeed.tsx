"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import { instagramPosts } from "@/app/(site)/data/instagramPosts";

const INSTAGRAM_URL = "https://www.instagram.com/qmatrixtech/";

export default function InstagramFeed() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f8f7ff] to-white py-14 sm:py-16 md:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(139,28,207,0.18),transparent_70%)] blur-3xl sm:h-[360px] sm:w-[520px] md:h-[420px] md:w-[680px] lg:h-[500px] lg:w-[800px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Our Instagram{" "}
            <span className="bg-linear-to-r from-[#8b1ccf] to-[#6d28d9] bg-clip-text text-transparent">
              Feed
            </span>{" "}
            <Instagram className="inline-block h-5 w-5 -translate-y-[2px] text-[#8b1ccf] sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </h2>

          <p className="mx-auto mt-4 max-w-2xl px-2 text-sm leading-7 text-slate-600 sm:text-base">
            Follow us on{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#8b1ccf] underline decoration-transparent transition hover:decoration-[#8b1ccf]"
            >
              Instagram
            </a>{" "}
            for Snowflake, SQL & Data Engineering insights.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative mt-8 sm:mt-10 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-white to-transparent sm:w-12 md:w-20 lg:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-white to-transparent sm:w-12 md:w-20 lg:w-32" />

          <div className="flex w-max animate-marquee gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 hover:[animation-play-state:paused]">
            {[...instagramPosts, ...instagramPosts].map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group relative w-[220px] shrink-0 sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px]"
              >
                <div className="relative rounded-[22px] bg-white/70 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(15,23,42,0.16)] sm:rounded-3xl sm:p-4">
                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-[22px] bg-linear-to-tr from-[#8b1ccf]/20 to-[#6d28d9]/20 opacity-0 blur-xl transition group-hover:opacity-100 sm:rounded-3xl" />

                  <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-white sm:rounded-2xl">
                    <Image
                      src={post.image}
                      alt="Instagram post"
                      fill
                      sizes="(max-width: 375px) 220px, (max-width: 640px) 240px, (max-width: 768px) 260px, (max-width: 1280px) 280px, 300px"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      quality={100}
                    />
                  </div>

                  {/* Bottom overlay */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-[22px] bg-linear-to-t from-black/20 to-transparent opacity-60 sm:h-24 sm:rounded-b-3xl" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center sm:mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-linear-to-r from-[#8b1ccf] to-[#6d28d9] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(139,28,207,0.35)] transition-all duration-300 hover:scale-105 sm:px-8 sm:py-4"
          >
            <Instagram className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Follow on Instagram
          </a>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
}