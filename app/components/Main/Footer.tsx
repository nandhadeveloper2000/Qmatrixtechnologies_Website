"use client";

import { cldPublic } from "@/app/lib/cloudinary";
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const policies = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms" },
  { name: "Disclaimer", path: "/disclaimer" },
  { name: "FAQs", path: "/faqs" },
];

const socials = [
  {
    Icon: FaInstagram,
    href: "https://www.instagram.com/qmatrixtech/?hl=en",
    label: "Instagram",
  },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center text-[14px] font-medium leading-6 text-white/75 transition-all duration-300 hover:translate-x-1 hover:text-white"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/80 transition-all duration-300 group-hover:w-full" />
      </span>
      <span className="ml-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
        →
      </span>
    </Link>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">
      {children}
    </h3>
  );
}

function InfoRow({
  icon,
  children,
  href,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <span className="mt-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[12px] text-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/15 group-hover:text-white">
        {icon}
      </span>
      <span className="text-[14px] leading-7 text-white/75 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group flex items-start gap-3 transition-all duration-300 hover:translate-x-1"
      >
        {content}
      </a>
    );
  }

  return <div className="group flex items-start gap-3">{content}</div>;
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 text-white">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#082a5e_0%,#9116a1_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="absolute -left-24 top-0 -z-10 h-[260px] w-[260px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute right-[-70px] top-16 -z-10 h-[240px] w-[240px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-[180px] w-[180px] rounded-full bg-violet-400/10 blur-3xl" />

      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-y-10 md:grid-cols-2 lg:grid-cols-[1.15fr_0.7fr_1fr_1.1fr] lg:gap-x-8">
          {/* 1. Logo + About */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex">
              <Image
                src={cldPublic("/qmatrix/QMatrix-logo", "f_auto,q_auto,w_400")}
                alt="Qmatrix Technologies"
                width={180}
                height={50}
                priority
                className="h-auto w-[280px]"
              />
            </Link>

            <p className="text-[13px] leading-8 text-white/80 text-justify">
              Founded in 2020, Qmatrix Technologies specializes in industry-focused training across Cloud, Data Engineering, and AI. Our flagship programs—Snowflake Data Engineering, ETL Testing, Microsoft Azure, AWS Cloud, Databricks, and Data Analyst—are designed with real-time projects and 100% placement support to prepare you for high-demand tech careers.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/75 shadow-[0_8px_20px_rgba(0,0,0,0.14)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:text-white"
                >
                  <Icon className="text-[14px] transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="lg:pl-1">
            <FooterHeading>Quick Links</FooterHeading>

            <ul className="mt-5 space-y-3.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <FooterLink href={item.path}>{item.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact */}
          <div>
            <FooterHeading>Contact</FooterHeading>

            <div className="mt-5 space-y-4">
              <InfoRow icon={<FaPhoneAlt />} href="tel:+919943532532">
                +91 99435 32532
              </InfoRow>

              <InfoRow
                icon={<FaEnvelope />}
                href="mailto:info@qmatrixtechnologies.com"
              >
                <span className="break-all">info@qmatrixtechnologies.com</span>
              </InfoRow>

              <InfoRow icon={<FaMapMarkerAlt />}>
                <span>
                  2nd Floor, VMP Complex,
                  <br />
                  200 Feet Radial Rd,
                  <br />
                  Pallikaranai, Chennai – 600100
                </span>
              </InfoRow>
            </div>
          </div>

          {/* 4. Location */}
          <div>
            <FooterHeading>Location</FooterHeading>

            <div className="mt-5 overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.08] shadow-[0_12px_35px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.10]">
              <iframe
                title="Qmatrix Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4845.267757057534!2d80.19946998538059!3d12.948457882822341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d9723750c13%3A0x10e6f878e4c1e0ce!2sQMatrix%20Technologies!5e1!3m2!1sen!2sus!4v1771743736245!5m2!1sen!2sus"
                width="100%"
                height="190"
                loading="lazy"
                className="block border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8 lg:px-10">
          <div className="grid gap-4 text-[13px] text-white/60 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="text-center md:text-left">
              <p>© 2026 Qmatrix Technologies. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {policies.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="group inline-flex items-center text-white/60 transition-all duration-300 hover:text-white"
                >
                  <span className="relative">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p>Designed &amp; Developed by Qmatrix R&amp;D Team</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}