import { cldPublic } from "@/app/lib/cloudinary";
// app/components/Main/Footer.tsx
import Link from "next/link";
import Image from "next/image";


import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
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
  { Icon: FaInstagram, href: "#" },
  { Icon: FaFacebookF, href: "#" },
  { Icon: FaLinkedinIn, href: "#" },
  { Icon: FaYoutube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#9900cc] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#8354ce] via-[#9900cc] to-[#8354ce]" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[520px] w-[520px] rounded-full bg-secondary/10 blur-3xl" />

      {/* Top Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">

          {/* 1️⃣ Logo + About */}
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src={cldPublic("/qmatrix/Qmatrix-logo", "f_auto,q_auto,w_400")}
                alt="QMatrix Technologies"
                width={176}
                height={60}
                priority
                className="h-auto w-60"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
              Empowering careers in Cloud, Data Engineering & AI through
              industry-focused training and real-world projects.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                >
                  <Icon className="text-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* 2️⃣ Quick Links + Policies (side-by-side) */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Quick Links
                </h3>
                <ul className="mt-6 space-y-4 text-sm text-white/70">
                  {quickLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className="transition hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Policies */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Policies
                </h3>
                <ul className="mt-6 space-y-4 text-sm text-white/70">
                  {policies.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className="transition hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* 3️⃣ Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Contact Us
            </h3>

            <div className="mt-6 space-y-4 text-sm text-white/70">
              <a
                href="tel:+919943532532"
                className="flex items-start gap-3 transition hover:text-primary"
              >
                <FaPhoneAlt className="mt-1 text-white shrink-0" />
                <span>+91 99435 32532</span>
              </a>

              <a
                href="mailto:info@qmatrixtechnologies.in"
                className="flex items-start gap-3 transition hover:text-primary"
              >
                <FaEnvelope className="mt-1 text-white shrink-0" />
                <span>info@qmatrixtechnologies.in</span>
              </a>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-white shrink-0" />
                <span className="leading-6">
                  2nd Floor, VMP Complex,
                  <br />
                  200 Feet Radial Rd,
                  <br />
                  Pallikaranai, Chennai – 600100
                </span>
              </div>
            </div>
          </div>

          {/* 4️⃣ Location */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Location
            </h3>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <iframe
                title="QMatrix Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4845.267757057534!2d80.19946998538059!3d12.948457882822341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d9723750c13%3A0x10e6f878e4c1e0ce!2sQmatrix%20Technologies!5e1!3m2!1sen!2sus!4v1771743736245!5m2!1sen!2sus"
                width="100%"
                height="230"
                loading="lazy"
                className="block border-0"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-white/55 md:flex md:items-center md:justify-between">
          <p className="text-center md:text-left">
            © 2026 QMatrix Technologies. All Rights Reserved.
          </p>

          <p className="mt-2 text-center md:mt-0 md:text-right">
            Designed & Developed by QMatrix R&amp;D Team
          </p>
        </div>
      </div>
    </footer>
  );
}