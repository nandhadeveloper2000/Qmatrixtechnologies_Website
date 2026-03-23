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

const initialState: FormState = {
    full_name: "",
    email: "",
    mobile: "",
    qualification: "",
    background: "",
    current_location: "",
    interested_course: "",
};

function FloatingInput({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    maxLength,
}: {
    label: string;
    name: keyof FormState;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    maxLength?: number;
}) {
    return (
        <div className="relative">
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                maxLength={maxLength}
                placeholder=" "
                className="peer h-10 w-full rounded-xl border border-slate-200 bg-white px-4 pt-4 pb-1.5 text-[14px] text-slate-900 outline-none transition duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
            <label
                htmlFor={name}
                className="pointer-events-none absolute left-4 top-1.5 z-10 origin-left text-[10px] font-medium text-slate-500 transition-all duration-200
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal
                peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-violet-600
                peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-medium"
            >
                {label}
            </label>
        </div>
    );
}

function SimpleSelect({
    name,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    placeholder,
}: {
    name: keyof FormState;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
    disabled?: boolean;
    placeholder: string;
}) {
    return (
        <div className="relative">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="h-10 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[14px] text-slate-700 outline-none transition duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
}

export default function EnquiryPopup({
    open,
    onClose,
    defaultCourse = "",
    user = null,
}: Props) {
    const [form, setForm] = useState<FormState>(initialState);
    const [courses, setCourses] = useState<Course[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesError, setCoursesError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [error, setError] = useState("");

    const autofillData = useMemo<FormState>(
        () => ({
            full_name: user?.name || "",
            email: user?.email || "",
            mobile: (user?.mobile || "").replace(/\D/g, "").slice(-10),
            qualification: user?.qualification || "",
            background: user?.background || "",
            current_location: user?.current_location || "",
            interested_course: defaultCourse || "",
        }),
        [user, defaultCourse]
    );

    const courseTitles = useMemo(() => courses.map((course) => course.title), [courses]);

    useEffect(() => {
        if (open) {
            setForm(autofillData);
            setError("");
            setSuccessMsg("");
        }
    }, [open, autofillData]);

    useEffect(() => {
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

                const publishedCourses = rawCourses
                    .filter((course) => Boolean(course?.title))
                    .map((course) => ({
                        _id: course._id,
                        title: course.title,
                        slug: course.slug,
                    }));

                setCourses(publishedCourses);

                if (defaultCourse) {
                    const matchedCourse = publishedCourses.find(
                        (course) => course.title.toLowerCase() === defaultCourse.toLowerCase()
                    );

                    if (matchedCourse) {
                        setForm((prev) => ({
                            ...prev,
                            interested_course: matchedCourse.title,
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to load courses:", err);
                setCourses([]);
                setCoursesError("Failed to load courses.");
            } finally {
                setCoursesLoading(false);
            }
        }

        if (open) {
            loadCourses();
        }
    }, [open, defaultCourse]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        if (open) {
            window.addEventListener("keydown", onKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        if (name === "mobile") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setForm((prev) => ({
                ...prev,
                mobile: digitsOnly,
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        if (!form.interested_course.trim()) return "Please select a course.";
        return "";
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccessMsg("");

            await apiFetch<{ success: boolean; message: string; data: unknown }>(
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
                ...initialState,
                interested_course: defaultCourse || "",
            });

            window.setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to submit enquiry."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-80 overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#7c3aed_0%,#9333ea_50%,#d946ef_100%)]" />

                <button
                    onClick={onClose}
                    type="button"
                    aria-label="Close enquiry popup"
                    className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-violet-300 hover:text-violet-700"
                >
                    ✕
                </button>

                <div className="bg-[linear-gradient(135deg,#f3f0ff_0%,#ffffff_42%,#f6efff_100%)] px-2 pb-2 pt-3 sm:px-3">
                    <span className="mb-2 inline-flex rounded-full border border-violet-200 bg-violet-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                        Career Enquiry
                    </span>

                    <h4 className="pr-10 text-[16px] font-bold leading-snug tracking-tight text-slate-900 sm:text-[16px]">
                        Enroll in Top IT Courses & Boost Your Career
                    </h4>

                    <p className="mt-1.5 text-[12px] leading-5 text-slate-600 sm:text-[12px]">
                        Get expert guidance for{" "}
                        <span className="font-semibold text-violet-700">
                            Data Engineering, AWS, Azure, Databricks
                        </span>{" "}
                        and more. Choose the right course with real project support.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-h-[calc(88vh-100px)] space-y-3.5 overflow-y-auto px-3 pb-3 pt-3 sm:px-4"
                >
                    <FloatingInput
                        label="Full Name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FloatingInput
                            label="Email Address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="relative">
                            <div className="flex h-10 overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
                                <div className="flex min-w-[62px] items-center justify-center border-r border-slate-200 px-3 text-[13px] font-semibold text-slate-700">
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
                                    placeholder="Mobile Number"
                                    className="h-full w-full bg-transparent px-4 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <SimpleSelect
                        name="interested_course"
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
                                  : "Select Course"
                        }
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FloatingInput
                            label="Qualification"
                            name="qualification"
                            value={form.qualification}
                            onChange={handleInputChange}
                        />

                        <FloatingInput
                            label="Background"
                            name="background"
                            value={form.background}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* <FloatingInput
                        label="Current Location"
                        name="current_location"
                        value={form.current_location}
                        onChange={handleInputChange}
                    /> */}

                    {coursesError ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] font-medium text-amber-700">
                            {coursesError}
                        </div>
                    ) : null}

                    {error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">
                            {error}
                        </div>
                    ) : null}

                    {successMsg ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-medium text-emerald-700">
                            {successMsg}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading || coursesLoading || courseTitles.length === 0}
                        className="mt-1 w-full rounded-2xl bg-[linear-gradient(90deg,#7c3aed_0%,#9333ea_50%,#c026d3_100%)] py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(147,51,234,0.24)] transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Submit Enquiry"}
                    </button>
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