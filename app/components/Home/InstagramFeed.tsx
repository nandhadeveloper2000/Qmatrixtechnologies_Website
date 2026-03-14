"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import { instagramPosts } from "@/app/(site)/data/instagramPosts";

export default function InstagramFeed() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f8f7ff] to-white py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(139,28,207,0.18),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Our Instagram{" "}
            <span className="bg-linear-to-r from-[#8b1ccf] to-[#6d28d9] bg-clip-text text-transparent">
              Feed
            </span>{" "}
            <Instagram className="inline-block h-7 w-7 -translate-y-[2px] text-[#8b1ccf]" />
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Follow us on{" "}
            <span className="font-semibold text-[#8b1ccf]">Instagram</span> for
            Snowflake, SQL & Data Engineering insights.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative mt-5 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-white to-transparent" />

          <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
            {[...instagramPosts, ...instagramPosts].map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group relative w-[280px] md:w-[300px]"
              >
                <div className="relative rounded-3xl bg-white/70 p-4 backdrop-blur-xl shadow-[0_25px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_35px_80px_rgba(15,23,42,0.18)]">
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-[#8b1ccf]/20 to-[#6d28d9]/20 opacity-0 blur-xl transition group-hover:opacity-100" />

                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
                    <Image
                      src={post.image}
                      alt="Instagram post"
                      fill
                      sizes="(max-width: 768px) 280px, 300px"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      quality={100}
                    />
                  </div>

                  {/* Bottom overlay */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-3xl bg-linear-to-t from-black/20 to-transparent opacity-60" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://www.instagram.com/qmatrixtech/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#8b1ccf] to-[#6d28d9] px-8 py-4 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(139,28,207,0.35)] transition-all duration-300 hover:scale-105"
          >
            <Instagram className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* Marquee Animation */}
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
      `}</style>
    </section>
  );
}