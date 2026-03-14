"use client";

import { useEffect, useState } from "react";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultCourse?: string;
};

type FormState = {
  full_name: string;
  email: string;
  mobile: string;
  qualification: string;
  background: string;
  current_location: string;
  interested_course: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  full_name: "",
  email: "",
  mobile: "",
  qualification: "",
  background: "",
  current_location: "",
  interested_course: "",
  subject: "",
  message: "",
};

export default function EnquiryPopup({
  open,
  onClose,
  defaultCourse = "",
}: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        ...initialState,
        interested_course: defaultCourse || "",
      });
      setError("");
      setSuccessMsg("");
    }
  }, [open, defaultCourse]);

  if (!open) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      await apiFetch<{
        success: boolean;
        message: string;
        data: unknown;
      }>(SummaryApi.create_enquiry.url, {
        method: SummaryApi.create_enquiry.method,
        json: {
          ...form,
          source: "website-popup",
        },
      });

      setSuccessMsg("Enquiry submitted successfully.");
      setForm({
        ...initialState,
        interested_course: defaultCourse || "",
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to submit enquiry."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#6d28d9_0%,#9333ea_50%,#ec4899_100%)]" />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-slate-200 bg-white/90 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
          type="button"
        >
          Close
        </button>

        <div className="bg-[linear-gradient(135deg,#faf7ff_0%,#ffffff_45%,#f5f3ff_100%)] px-6 py-6 sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Send Enquiry
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Fill in your details and our team will get in touch with you shortly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mobile <span className="text-rose-500">*</span>
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Enter mobile number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Qualification
            </label>
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="e.g. B.Tech / B.Sc / MCA"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Background
            </label>
            <input
              name="background"
              value={form.background}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="e.g. IT / Non-IT / Fresher / Career Gap"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Current Location
            </label>
            <input
              name="current_location"
              value={form.current_location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Interested Course
            </label>
            <input
              name="interested_course"
              value={form.interested_course}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Enter interested course"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Enter subject"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Type your message"
            />
          </div>

          {error ? (
            <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {successMsg ? (
            <div className="sm:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMsg}
            </div>
          ) : null}

          <div className="sm:col-span-2 flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#7c3aed_0%,#9333ea_45%,#c026d3_100%)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(147,51,234,0.32)] transition hover:scale-[1.02] hover:shadow-[0_18px_36px_rgba(147,51,234,0.38)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }

  return fallback;
}