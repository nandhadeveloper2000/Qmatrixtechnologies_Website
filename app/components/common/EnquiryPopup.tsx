"use client";

import { useEffect, useMemo, useState } from "react";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultCourse?: string;
  user?: {
    name?: string;
    email?: string;
    mobile?: string;
    qualification?: string;
    background?: string;
    current_location?: string;
  } | null;
};

type FormState = {
  full_name: string;
  email: string;
  mobile: string;
  qualification: string;
  background: string;
  current_location: string;
  interested_course: string;
};

type Course = {
  _id: string;
  title: string;
  slug?: string;
};

type CoursesResponse =
  | {
      success?: boolean;
      data?: Course[];
      courses?: Course[];
    }
  | Course[];

const INITIAL_FORM: FormState = {
  full_name: "",
  email: "",
  mobile: "",
  qualification: "",
  background: "",
  current_location: "",
  interested_course: "",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FieldLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[12.5px] font-medium text-slate-700"
    >
      {label} {required ? <span className="text-rose-500">*</span> : null}
    </label>
  );
}

function InputField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  disabled = false,
  maxLength,
}: {
  id: keyof FormState;
  name: keyof FormState;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} />

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-xl border border-slate-200 bg-white/95 px-3.5",
          "text-[14px] text-slate-900 outline-none",
          "shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200",
          "placeholder:text-slate-400",
          "focus:border-violet-500 focus:ring-4 focus:ring-violet-100",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        )}
      />
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder,
}: {
  id: keyof FormState;
  name: keyof FormState;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} />

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={cn(
            "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white/95 px-3.5 pr-10",
            "text-[14px] text-slate-700 outline-none",
            "shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200",
            "focus:border-violet-500 focus:ring-4 focus:ring-violet-100",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
          />
        </svg>
      </div>
    </div>
  );
}

function AlertMessage({
  type,
  message,
}: {
  type: "error" | "success" | "warning";
  message: string;
}) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-2.5 text-[12.5px] font-medium",
        styles[type]
      )}
    >
      {message}
    </div>
  );
}

export default function EnquiryPopup({
  open,
  onClose,
  defaultCourse = "",
  user = null,
}: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const autofillForm = useMemo<FormState>(
    () => ({
      full_name: user?.name?.trim() || "",
      email: user?.email?.trim() || "",
      mobile: (user?.mobile || "").replace(/\D/g, "").slice(-10),
      qualification: user?.qualification?.trim() || "",
      background: user?.background?.trim() || "",
      current_location: user?.current_location?.trim() || "",
      interested_course: defaultCourse?.trim() || "",
    }),
    [user, defaultCourse]
  );

  const courseTitles = useMemo(() => {
    const seen = new Set<string>();

    return courses
      .map((course) => course.title?.trim())
      .filter((title): title is string => Boolean(title))
      .filter((title) => {
        const normalized = title.toLowerCase();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      })
      .sort((a, b) => a.localeCompare(b));
  }, [courses]);

  useEffect(() => {
    if (!open) return;

    setForm(autofillForm);
    setErrorMsg("");
    setSuccessMsg("");
    setCoursesError("");
  }, [open, autofillForm]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function loadCourses() {
      try {
        setCoursesLoading(true);
        setCoursesError("");

        const res = await apiFetch<CoursesResponse>(SummaryApi.public_courses.url, {
          method: SummaryApi.public_courses.method,
        });

        const rawCourses = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.courses)
          ? res.courses
          : [];

        const cleanedCourses = rawCourses
          .filter((course) => course?._id && course?.title?.trim())
          .map((course) => ({
            _id: course._id,
            title: course.title.trim(),
            slug: course.slug,
          }));

        if (ignore) return;

        setCourses(cleanedCourses);

        if (defaultCourse?.trim()) {
          const matched = cleanedCourses.find(
            (course) =>
              course.title.toLowerCase() === defaultCourse.trim().toLowerCase()
          );

          if (matched) {
            setForm((prev) => ({
              ...prev,
              interested_course: matched.title,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load courses:", error);

        if (ignore) return;

        setCourses([]);
        setCoursesError("Failed to load courses.");
      } finally {
        if (!ignore) {
          setCoursesLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, [open, defaultCourse]);

  if (!open) return null;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const key = name as keyof FormState;

    if (key === "mobile") {
      updateField("mobile", value.replace(/\D/g, "").slice(0, 10));
      return;
    }

    updateField(key, value);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    updateField(name as keyof FormState, value);
  }

  function validateForm() {
    if (!form.full_name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Enter a valid email address.";
    }

    if (!form.mobile.trim()) return "Mobile number is required.";

    if (!/^\d{10}$/.test(form.mobile.trim())) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!form.interested_course.trim()) {
      return "Please select a course.";
    }

    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMsg(validationError);
      setSuccessMsg("");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      await apiFetch<{ success: boolean; message?: string; data?: unknown }>(
        SummaryApi.create_enquiry.url,
        {
          method: SummaryApi.create_enquiry.method,
          json: {
            ...form,
            mobile: `+91 ${form.mobile}`,
            source: "website-popup-dynamic-courses",
          },
        }
      );

      setSuccessMsg("Enquiry submitted successfully.");
      setForm({
        ...INITIAL_FORM,
        interested_course: defaultCourse?.trim() || "",
      });

      window.setTimeout(() => {
        onClose();
      }, 900);
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error, "Failed to submit enquiry."));
      setSuccessMsg("");
    } finally {
      setSubmitting(false);
    }
  }

  const submitDisabled =
    submitting || coursesLoading || courseTitles.length === 0;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 px-3 py-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-[520px] overflow-hidden rounded-[24px]",
          "border border-white/70 bg-white",
          "shadow-[0_28px_80px_rgba(15,23,42,0.20)]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#7c3aed_0%,#9333ea_45%,#c026d3_100%)]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry popup"
          className={cn(
            "absolute right-3.5 top-3.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full",
            "border border-slate-200 bg-white/90 text-slate-500 shadow-sm",
            "transition duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[17px] w-[17px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#f6f1ff_0%,#ffffff_45%,#faefff_100%)] px-4 pb-3 pt-4 sm:px-5">
          <div className="absolute -left-10 top-0 h-24 w-24 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-fuchsia-200/30 blur-3xl" />

          <div className="relative pr-10">
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-100/90 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-violet-700">
              Send Enquiry
            </span>

            <h2 className="mt-2.5 text-[20px] font-bold leading-tight text-slate-900">
              Start your learning journey
            </h2>

            <p className="mt-1.5 max-w-[430px] text-[13px] leading-5 text-slate-600">
              Fill in your details and our team will get in touch with you shortly.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(85vh-120px)] overflow-y-auto px-4 pb-4 pt-4 sm:px-5"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <InputField
              id="full_name"
              name="full_name"
              label="Full Name"
              value={form.full_name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />

            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email id"
            />

            <div>
              <FieldLabel htmlFor="mobile" label="Mobile" required />

              <div
                className={cn(
                  "flex h-10 overflow-hidden rounded-xl border border-slate-200 bg-white/95",
                  "shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200",
                  "focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100"
                )}
              >
                <div className="flex min-w-[64px] items-center justify-center border-r border-slate-200 px-3 text-[13px] font-semibold text-slate-700">
                  +91
                </div>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  value={form.mobile}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  placeholder="Mobile number"
                  className="h-full w-full bg-transparent px-3.5 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <InputField
              id="qualification"
              name="qualification"
              label="Qualification"
              value={form.qualification}
              onChange={handleInputChange}
              placeholder="e.g. B.Tech / B.Sc / MCA"
            />

            <InputField
              id="background"
              name="background"
              label="Background"
              value={form.background}
              onChange={handleInputChange}
              placeholder="e.g. IT / Non-IT / Fresher"
            />

            <InputField
              id="current_location"
              name="current_location"
              label="Current Location"
              value={form.current_location}
              onChange={handleInputChange}
              placeholder="Enter city"
            />

            <div className="md:col-span-2">
              <SelectField
                id="interested_course"
                name="interested_course"
                label="Interested Course"
                value={form.interested_course}
                onChange={handleSelectChange}
                options={courseTitles}
                required
                disabled={coursesLoading || courseTitles.length === 0}
                placeholder={
                  coursesLoading
                    ? "Loading courses..."
                    : courseTitles.length === 0
                    ? "No courses available"
                    : "Select course"
                }
              />
            </div>
          </div>

          <div className="mt-3 space-y-2.5">
            {coursesError ? (
              <AlertMessage type="warning" message={coursesError} />
            ) : null}

            {errorMsg ? <AlertMessage type="error" message={errorMsg} /> : null}

            {successMsg ? (
              <AlertMessage type="success" message={successMsg} />
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitDisabled}
            className={cn(
              "mt-4 h-11 w-full rounded-xl",
              "bg-[linear-gradient(90deg,#7c3aed_0%,#9333ea_48%,#c026d3_100%)]",
              "text-[14.5px] font-semibold text-white",
              "shadow-[0_16px_32px_rgba(147,51,234,0.24)]",
              "transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(147,51,234,0.28)]",
              "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            )}
          >
            {submitting ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}