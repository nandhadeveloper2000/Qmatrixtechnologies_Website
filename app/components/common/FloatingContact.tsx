"use client";

import { cldPublic } from "@/app/lib/cloudinary";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaArrowUp } from "react-icons/fa";

export default function FloatingContact() {
  const [showTop, setShowTop] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const hideTimer = useRef<number | null>(null);
  const cycleTimer = useRef<number | null>(null);

  /* ----------------------------
     Scroll To Top Visibility
  ---------------------------- */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ----------------------------
     WhatsApp Popup Cycle
  ---------------------------- */
  useEffect(() => {
    const showThenHide = () => {
      setShowPopup(true);

      if (hideTimer.current) window.clearTimeout(hideTimer.current);

      hideTimer.current = window.setTimeout(() => {
        setShowPopup(false);
      }, 2500);
    };

    showThenHide();
    cycleTimer.current = window.setInterval(showThenHide, 18000);

    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      if (cycleTimer.current) window.clearInterval(cycleTimer.current);
    };
  }, []);

  /* ----------------------------
     Scroll To Top
  ---------------------------- */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ----------------------------
     WhatsApp Open
  ---------------------------- */
  const openWhatsApp = () => {
    const phone = "919943532532";

    const message =
      "Hi QMatrix Team,\n\n" +
      "I would like to know more about your courses and placement support. Please find my details below:\n\n" +
      "Full Name:\nQualification:\nBackground: IT / Non-IT / Career Gap\nLocation:\nInterested Course:\n\n" +
      "Please share syllabus, fees, batch timings and placement details.\n\nThank you.";

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ----------------------------
     Cloudinary Image
  ---------------------------- */
  const whatsappIcon = cldPublic(
    "wht_nttx8q.png",
    "f_auto,q_auto,w_200"
  );

  return (
    <div className="fixed z-[9999] flex flex-col items-end gap-4 right-4 bottom-6">
      
      {/* =========================
          Scroll To Top Button
      ========================== */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={[
          "flex items-center justify-center rounded-full",
          "h-[44px] w-[44px]",
          "bg-[#082a5e]",
          "shadow-[0_14px_36px_rgba(0,0,0,0.18)]",
          "transition-all duration-300",
          "hover:bg-[#9116a1]",
          "focus:outline-none focus:ring-2 focus:ring-[#9116a1]",
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <FaArrowUp className="text-white text-[18px]" />
      </button>

      {/* =========================
          WhatsApp Floating Button
      ========================== */}
      <div
        className="relative"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        {/* Animated Ring */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="absolute h-[78px] w-[78px] rounded-full bg-[#20C659]/25 animate-ping" />
          <span className="absolute h-[78px] w-[78px] rounded-full bg-[#20C659]/15" />
        </span>

        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          aria-label="Contact us on WhatsApp"
          className="relative flex items-center justify-center h-[60px] w-[60px] rounded-full"
        >
          <Image
            src={whatsappIcon}
            alt="whatsapp_btn"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
        </button>

        {/* Optional Popup Text */}
        {showPopup && (
          <div className="absolute right-[75px] bottom-2 bg-white text-[#082a5e] text-sm font-medium px-4 py-2 rounded-xl shadow-lg whitespace-nowrap animate-fadeIn">
            Chat with us 👋
          </div>
        )}
      </div>
    </div>
  );
}