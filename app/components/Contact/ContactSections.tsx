"use client";

import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function ContactLayout() {
  return (
    <section className="w-full bg-[#F4F5FB]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          {/* LEFT: BIG FORM CARD */}
          <div className="rounded-[26px] bg-white p-6 shadow-[0_18px_55px_rgba(16,24,40,0.10)] ring-1 ring-black/5 sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--primary)] sm:text-2xl">
              Send us a message
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Do you have a question? Need help choosing the right course? Feel free to
              contact us.
            </p>

            <form className="mt-7 grid gap-5 sm:grid-cols-2">
              <LightInput label="First Name" placeholder="Enter your first name" />
              <LightInput label="Last Name" placeholder="Enter your last name" />

              <div className="sm:col-span-1">
                <LightInput label="Email" placeholder="Enter your email" />
              </div>

              {/* Contact Details (country code + phone) */}
              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Contact Details
                </label>
                <div className="flex h-11 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-slate-200">
                  <select
                    className="h-full w-[92px] border-r border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
                    defaultValue="+91"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <input
                    className="h-full flex-1 bg-white px-3 text-sm text-slate-900 outline-none"
                    placeholder="Enter your contact number"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter your message"
                />
              </div>

              {/* Button aligned like reference (right aligned) */}
              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)]
                  px-7 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(8,42,94,0.25)]
                  hover:brightness-110 active:scale-[0.99]"
                >
                  Send a Message <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: HELP CARD */}
          <aside className="rounded-[26px]    bg-gradient-to-b
          from-[#082a5e]
          via-[#a724e4]
          to-[#8121fb] p-6 text-white shadow-[0_18px_55px_rgba(2,6,23,0.25)] ring-1 ring-white/10 sm:p-7">
            <h3 className="text-lg font-extrabold leading-snug">
              Hi! We are always here <br /> to help you.
            </h3>

            <div className="mt-6 space-y-4">
              <HelpRow
                icon={<Phone className="h-5 w-5" />}
                title="Hotline:"
                value="+91 99435 32532"
              />
              <HelpRow
                icon={<MessageCircle className="h-5 w-5" />}
                title="SMS / Whatsapp"
                value="+91 99435 32532"
              />
              <HelpRow
                icon={<Mail className="h-5 w-5" />}
                title="Email:"
                value="info@qmatrixtechnologies.in"
              />
            </div>

            <div className="my-6 h-px bg-white/15" />

            <p className="text-sm font-semibold text-white/90">Connect with us</p>

            <div className="mt-4 flex items-center gap-4">
              <SocialIcon>
                <Facebook className="h-5 w-5" />
              </SocialIcon>
              <SocialIcon>
                <Instagram className="h-5 w-5" />
              </SocialIcon>
              <SocialIcon>
                <Twitter className="h-5 w-5" />
              </SocialIcon>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */

function LightInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
      <input
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none
        focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        placeholder={placeholder}
      />
    </div>
  );
}

function HelpRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/12 p-4 ring-1 ring-white/10">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white/90">{title}</p>
        <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15
      hover:bg-white/15 active:scale-[0.98]"
      aria-label="social"
    >
      {children}
    </button>
  );
}