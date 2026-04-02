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
    href: "https://instagram.com/qmatrixtech",
    label: "Qmatrix Instagram",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#9900cc] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#8354ce] via-[#9900cc] to-[#8354ce]" />
      <div className="absolute -left-40 top-10 -z-10 h-[480px] w-[480px] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-40 bottom-10 -z-10 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />

      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* 1 Logo + About */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex">
              <Image
                src={cldPublic("/qmatrix/QMatrix-logo", "f_auto,q_auto,w_400")}
                alt="Qmatrix Technologies"
                width={176}
                height={60}
                priority
                className="h-auto w-60"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/80">
              Founded in 2020, Qmatrix Technologies is one of the leading
              software training institutes in Chennai, delivering practical,
              job-oriented IT training.
            </p>

            {/* Instagram */}
            <div className="relative z-10 mt-6 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title="Follow us on Instagram"
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/10 text-white transition duration-300 hover:scale-110 hover:bg-pink-500"
                >
                  <Icon className="text-[16px]" />
                </a>
              ))}
            </div>
          </div>

          {/* 2 Quick Links + Policies */}
          <div className="relative z-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Quick Links
                </h3>
                <ul className="mt-6 space-y-4 text-sm text-white/70">
                  {quickLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className="transition hover:text-yellow-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Policies</h3>
                <ul className="mt-6 space-y-4 text-sm text-white/70">
                  {policies.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className="transition hover:text-yellow-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Contact */}
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>

            <div className="mt-6 space-y-4 text-sm text-white/70">
              <a
                href="tel:+919943532532"
                className="flex items-start gap-3 transition hover:text-yellow-300"
              >
                <FaPhoneAlt className="mt-1 shrink-0" />
                <span>+91 99435 32532</span>
              </a>

              <a
                href="mailto:info@qmatrixtechnologies.in"
                className="flex items-start gap-3 transition hover:text-yellow-300"
              >
                <FaEnvelope className="mt-1 shrink-0" />
                <span>info@qmatrixtechnologies.in</span>
              </a>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                <span>
                  2nd Floor, VMP Complex,
                  <br />
                  200 Feet Radial Rd,
                  <br />
                  Pallikaranai, Chennai – 600100
                </span>
              </div>
            </div>
          </div>

          {/* 4 Location */}
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white">Location</h3>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Qmatrix Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4845.267757057534!2d80.19946998538059!3d12.948457882822341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d9723750c13%3A0x10e6f878e4c1e0ce!2sQMatrix%20Technologies!5e1!3m2!1sen!2sus!4v1771743736245!5m2!1sen!2sus"
                width="100%"
                height="230"
                loading="lazy"
                className="border-0"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-white/60 md:flex md:items-center md:justify-between">
          <p className="text-center md:text-left">
            © 2026 Qmatrix Technologies. All Rights Reserved.
          </p>

          <p className="mt-2 text-center md:mt-0 md:text-right">
            Designed & Developed by Qmatrix R&amp;D Team
          </p>
        </div>
      </div>
    </footer>
  );
}