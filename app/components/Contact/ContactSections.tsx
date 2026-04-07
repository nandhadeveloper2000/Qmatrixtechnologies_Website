"use client";

import React, { useState } from "react";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";
import { Mail, Phone, MessageCircle, Instagram } from "lucide-react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  message: string;
};

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

type LightInputProps = {
  label: string;
  name: keyof FormState;
  placeholder: string;
  value: string;
  onChange: (e: InputChangeEvent) => void;
};

type HelpRowProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

type ApiErrorResponse = {
  message?: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  message: "",
};

export default function ContactLayout() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const endpoint = SummaryApi.contact_create;

      const res = await fetch(`${baseURL}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data: ApiErrorResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccessMsg("Your message has been sent successfully.");
      setForm(initialForm);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#F4F5FB]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div className="rounded-[26px] bg-white p-6 shadow-[0_18px_55px_rgba(16,24,40,0.10)] ring-1 ring-black/5 sm:p-8">
            <h2 className="text-xl font-extrabold text-primary sm:text-2xl">
              Send us a message
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Do you have a question? Need help choosing the right course? Feel
              free to contact us.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7 grid gap-5 sm:grid-cols-2"
            >
              <LightInput
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
              />

              <LightInput
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
              />

              <LightInput
                label="Email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Contact Details
                </label>

                <div className="flex h-11 overflow-hidden rounded-xl border border-slate-200">
                  <select
                    name="countryCode"
                    className="px-3 text-sm outline-none"
                    value={form.countryCode}
                    onChange={handleChange}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>

                  <input
                    name="phone"
                    type="tel"
                    className="flex-1 px-3 text-sm outline-none"
                    placeholder="Enter your contact number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none"
                  placeholder="Enter your message"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {successMsg && (
                <div className="sm:col-span-2 text-sm font-medium text-green-600">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="sm:col-span-2 text-sm font-medium text-red-600">
                  {errorMsg}
                </div>
              )}

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          <aside className="rounded-[26px] bg-linear-to-b from-[#082a5e] via-[#a724e4] to-[#8121fb] p-6 text-white">
            <h3 className="text-lg font-extrabold">
              Hi! We are always here to help you.
            </h3>

            <div className="mt-6 space-y-4">
              <HelpRow
                icon={<Phone className="h-5 w-5" />}
                title="Hotline"
                value="+91 99435 32532"
              />
              <HelpRow
                icon={<MessageCircle className="h-5 w-5" />}
                title="WhatsApp"
                value="+91 99435 32532"
              />
              <HelpRow
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                value="info@qmatrixtechnologies.com"
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">Connect with us</p>

              <div className="mt-4 flex gap-4">
                <SocialIcon href="https://www.instagram.com/qmatrixtech/">
                  <Instagram className="h-5 w-5" />
                </SocialIcon>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function LightInput({
  label,
  name,
  placeholder,
  value,
  onChange,
}: LightInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}

function HelpRow({ icon, title, value }: HelpRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-white/80">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SocialIcon({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
      {children}
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
      {content}
    </a>
  ) : (
    <button type="button" aria-label="Social icon">
      {content}
    </button>
  );
}