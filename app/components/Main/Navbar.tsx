"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { cldPublic } from "@/app/lib/cloudinary";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
} from "lucide-react";
import EnquiryPopup from "@/app/components/common/EnquiryPopup";

type NavItem = {
  name: string;
  path?: string;
  children?: { name: string; path: string }[];
};

type HeaderVariant = "Qmatrix" | "luminar";

const NAV_VARIANT =
  (process.env.NEXT_PUBLIC_HEADER_VARIANT as HeaderVariant) ?? "luminar";

export default function Navbar() {
  const pathname = usePathname();
  const variant = NAV_VARIANT;

  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const moreRef = useRef<HTMLLIElement | null>(null);

  const [scrolled, setScrolled] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
      { name: "Placements", path: "/placements" },
      { name: "Blogs", path: "/blogs" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    []
  );

  const isActive = (path?: string) => (path ? pathname === path : false);

  const SOCIALS = useMemo(
    () => [
      { name: "Instagram", href: "https://instagram.com/", Icon: Instagram },
      { name: "YouTube", href: "https://youtube.com/", Icon: Youtube },
      { name: "LinkedIn", href: "https://linkedin.com/", Icon: Linkedin },
      { name: "Facebook", href: "https://facebook.com/", Icon: Facebook },
      { name: "Call", href: "tel:+919999999999", Icon: Phone },
      { name: "Email", href: "mailto:info@Qmatrix.com", Icon: Mail },
    ],
    []
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current) return;
      if (!moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 20);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "relative inline-flex items-center gap-1.5 px-0.5 py-2 text-[16px] font-semibold transition-colors";
  const linkInactive = "text-slate-800 hover:text-[var(--tg-theme-primary)]";
  const linkActive = "text-[var(--tg-theme-primary)]";

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "transition-all duration-300 ease-out will-change-transform",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.10)] translate-y-0"
            : "bg-transparent shadow-none -translate-y-1",
        ].join(" ")}
      >
        <div
          className={[
            "transition-colors duration-300",
            scrolled ? "border-b border-black/5" : "border-b border-transparent",
          ].join(" ")}
        >
          <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
            <div className="flex h-19.5 items-center gap-4 sm:h-21.5">
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src={cldPublic("qmatrix/logo.png", "f_auto,q_auto,w_1000")}
                  alt="Logo"
                  width={240}
                  height={70}
                  priority
                  className="h-auto w-50 object-contain sm:w-50 md:w-50 lg:-ml-10 lg:w-87.5"
                />
              </Link>

              <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
                <nav className="min-w-0">
                  <ul className="flex items-center gap-8 whitespace-nowrap">
                    {navItems.map((item) => {
                      if (item.children?.length) {
                        const anyChildActive = item.children.some((c) =>
                          isActive(c.path)
                        );

                        return (
                          <li key={item.name} className="relative" ref={moreRef}>
                            <button
                              type="button"
                              onClick={() => setMoreOpen((s) => !s)}
                              className={[
                                linkBase,
                                anyChildActive ? linkActive : linkInactive,
                              ].join(" ")}
                            >
                              {item.name}
                              <ChevronDown
                                size={16}
                                className={[
                                  "mt-px transition-transform duration-200",
                                  moreOpen ? "rotate-180" : "rotate-0",
                                ].join(" ")}
                                style={{
                                  color: anyChildActive
                                    ? "var(--tg-theme-primary)"
                                    : "rgb(30 41 59)",
                                }}
                              />
                              {anyChildActive && (
                                <span className="absolute left-0 -bottom-0.5 h-0.75 w-7 rounded-full bg-[var(--tg-theme-primary)]" />
                              )}
                            </button>

                            <div
                              className={[
                                "absolute left-1/2 top-full mt-3 w-56 -translate-x-1/2",
                                "rounded-[14px] border border-slate-900/10 bg-white shadow-[0_18px_45px_rgba(2,6,23,0.10)]",
                                "transition duration-150",
                                moreOpen
                                  ? "visible translate-y-0 opacity-100"
                                  : "invisible -translate-y-2 opacity-0",
                              ].join(" ")}
                            >
                              <div className="p-2">
                                {item.children.map((c) => {
                                  const active = isActive(c.path);

                                  return (
                                    <Link
                                      key={c.path}
                                      href={c.path}
                                      onClick={() => setMoreOpen(false)}
                                      className={[
                                        "block rounded-[10px] px-3 py-2.5 text-[15px] font-medium transition",
                                        active
                                          ? "bg-[color-mix(in_srgb,var(--tg-theme-primary)_10%,white)] text-[var(--tg-theme-primary)]"
                                          : "text-slate-700 hover:bg-slate-50 hover:text-[var(--tg-theme-primary)]",
                                      ].join(" ")}
                                    >
                                      {c.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </li>
                        );
                      }

                      const active = isActive(item.path);

                      return (
                        <li key={item.name}>
                          <Link
                            href={item.path!}
                            className={[
                              linkBase,
                              active ? linkActive : linkInactive,
                            ].join(" ")}
                          >
                            {item.name}
                            {active && (
                              <span className="absolute left-0 -bottom-0.5 h-0.75 w-7 rounded-full bg-[var(--tg-theme-primary)]" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div className="hidden shrink-0 items-center lg:flex lg:-mr-10">
                {variant === "Qmatrix" ? (
                  <div className="flex items-center gap-5">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenEnquiry(true);
                      }}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-800 transition hover:text-[var(--tg-theme-primary)]"
                    >
                      ENQUIRE NOW
                    </Link>

                    <span className="h-5 w-px bg-gray-200" />

                    <Link
                      href="/callback"
                      className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-800 transition hover:text-[var(--tg-theme-primary)]"
                    >
                      BOOK A CALLBACK
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenEnquiry(true);
                      }}
                      className="btn btn-shine"
                    >
                      ENQUIRE NOW
                    </Link>

                    <Link href="/callback" className="btn btn-shine">
                      BOOK A CALLBACK
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="ml-auto rounded-xl p-2.5 transition hover:bg-white/60 active:scale-[0.98] lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={28} style={{ color: "var(--tg-theme-primary)" }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={[
          "fixed right-0 top-0 z-50 h-full w-[86%] max-w-sm bg-white shadow-2xl",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <Image
            src={cldPublic("Qmatrix/logo.png", "f_auto,q_auto,w_1000")}
            alt="Logo"
            width={200}
            height={60}
            className="h-auto w-37.5 object-contain sm:w-42.5"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-xl p-2.5 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={26} style={{ color: "var(--tg-theme-primary)" }} />
          </button>
        </div>

        <div className="flex h-[calc(100%-72px)] flex-col">
          <div className="px-5 py-5">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                if (item.children?.length) {
                  return (
                    <div key={item.name} className="pt-2">
                      <p className="px-3 text-xs font-bold tracking-widest text-slate-400">
                        MORE
                      </p>
                      <div className="mt-2 flex flex-col gap-1">
                        {item.children.map((c) => (
                          <Link
                            key={c.path}
                            href={c.path}
                            onClick={() => setIsOpen(false)}
                            className={[
                              "rounded-xl px-3 py-3 text-[16px] font-semibold transition",
                              isActive(c.path)
                                ? "bg-black/5 text-[var(--tg-theme-primary)]"
                                : "text-slate-800 hover:bg-black/5",
                            ].join(" ")}
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.path!}
                    onClick={() => setIsOpen(false)}
                    className={[
                      "rounded-xl px-3 py-2 text-[16px] font-semibold transition hover:bg-black/5",
                      isActive(item.path)
                        ? "text-[var(--tg-theme-primary)]"
                        : "text-slate-800",
                    ].join(" ")}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-auto border-t border-black/5 bg-linear-to-b from-white to-slate-50 px-7 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  setOpenEnquiry(true);
                }}
                className="
                  inline-flex w-full items-center justify-center
                  min-h-12.5 rounded-2xl
                  px-6 text-[13px] font-semibold
                  uppercase tracking-[0.12em] whitespace-nowrap
                  text-white bg-[var(--tg-theme-primary)]
                  shadow-[0_16px_36px_rgba(2,6,23,0.18)]
                  hover:brightness-110
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                ENQUIRE NOW
              </Link>

              <Link
                href="/callback"
                onClick={() => setIsOpen(false)}
                className="
                  inline-flex w-full items-center justify-center
                  min-h-12.5 rounded-2xl
                  px-6 text-[13px] font-semibold
                  uppercase tracking-[0.12em] whitespace-nowrap
                  border border-slate-200
                  bg-white text-slate-900
                  shadow-[0_14px_28px_rgba(2,6,23,0.08)]
                  hover:bg-slate-50 hover:border-slate-300
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                BOOK CALLBACK
              </Link>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400">
                FOLLOW US
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="
                      inline-flex h-11 w-11 items-center justify-center
                      rounded-2xl border border-slate-200 bg-white
                      shadow-[0_12px_28px_rgba(2,6,23,0.10)]
                      transition-all duration-200
                      hover:-translate-y-0.5 hover:border-slate-300
                    "
                    aria-label={name}
                    title={name}
                  >
                    <Icon
                      size={20}
                      style={{ color: "var(--tg-theme-primary)" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <EnquiryPopup
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
      />

      <div className="h-19.5 sm:h-21.5" />
    </>
  );
}