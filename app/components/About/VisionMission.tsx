"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";

export default function VisionMissionLikeTemplate() {
    return (
        <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
            {/* soft glow */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] rounded-full bg-[rgba(145,22,161,0.10)] blur-3xl" />
            <div className="pointer-events-none absolute -right-28 bottom-[-140px] h-[360px] w-[360px] sm:h-[420px] sm:w-[420px] rounded-full bg-[rgba(8,42,94,0.08)] blur-3xl" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.10)] sm:shadow-[0_40px_110px_rgba(0,0,0,0.10)]">
                    {/* BACKGROUND SHAPES */}
                    <div aria-hidden="true" className="absolute inset-0">
                        {/* base */}
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7f9fc,#eef2f8)]" />

                        {/* MOBILE: top-half purple background (clean + readable) */}
                        <div className="absolute inset-x-0 top-0 h-[52%] bg-[linear-gradient(135deg,#9116a1_0%,#a724e4_45%,#7c1fc4_100%)] md:hidden" />

                        {/* TABLET+ : diagonal purple panel */}
                        <div
                            className="hidden md:block absolute inset-0"
                            style={{
                                clipPath: "polygon(0 0, 60% 0, 38% 100%, 0 100%)",
                                background:
                                    "linear-gradient(135deg, #9116a1 0%, #a724e4 45%, #7c1fc4 100%)",
                            }}
                        />

                        {/* TABLET+ : thick white diagonal strip */}
                        <div
                            className="hidden md:block absolute inset-0"
                            style={{
                                clipPath: "polygon(56% 0, 66% 0, 44% 100%, 34% 100%)",
                                background: "rgba(255,255,255,0.96)",
                            }}
                        />

                        {/* right “cap” */}
                        <div
                            className="absolute -right-10 -top-10 h-[180px] w-[220px] sm:h-[220px] sm:w-[260px] rounded-[44px] sm:rounded-[56px] bg-[rgba(8,42,94,0.06)]"
                            style={{ transform: "rotate(8deg)" }}
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="relative grid gap-0 md:grid-cols-2">
                        {/* LEFT: VISION */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="
                p-6 sm:p-10 lg:p-12
                md:pr-12 lg:pr-20
              "
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <span
                                    className="
                    grid place-items-center
                    h-12 w-12 sm:h-14 sm:w-14
                    rounded-2xl
                    bg-white/15 ring-1 ring-white/25
                    shrink-0
                  "
                                >
                                    <Eye className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                </span>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide text-white">
                                        OUR VISION
                                    </h3>

                                    <p className="mt-3 sm:mt-5 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed text-white/90">
                                        Empowering brands to thrive digitally.
                                        To be a leading IT training institute that transforms passionate learners into
                                        industry-ready professionals—empowering them to shape the future of technology
                                        with confidence and innovation.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT: MISSION */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                            className="
                p-6 sm:p-10 lg:p-12
                md:pl-10 lg:pl-16
              "
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <span
                                    className="
                    grid place-items-center
                    h-12 w-12 sm:h-14 sm:w-14
                    rounded-2xl
                    bg-white ring-1 ring-black/10
                    shrink-0
                  "
                                >
                                    <Target className="h-6 w-6 sm:h-7 sm:w-7 text-[rgba(8,42,94,1)]" />
                                </span>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide text-[rgba(8,42,94,1)]">
                                        OUR MISSION
                                    </h3>

                                    <p className="mt-3 sm:mt-5 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed text-[rgba(8,42,94,0.78)]">
                                        Our mission is to empower brands through innovation.
                                        To deliver hands-on, practical, and industry-aligned training through expert
                                        mentors, real-time projects, and career guidance—ensuring every learner becomes
                                        confident, skilled, and career-ready.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* border polish */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[22px] sm:rounded-[28px] ring-1 ring-black/10"
                    />
                </div>
            </div>
        </section>
    );
}