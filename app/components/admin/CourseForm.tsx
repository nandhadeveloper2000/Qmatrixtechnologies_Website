"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import CourseFormProgress from "@/app/components/admin/CourseFormProgress";
import CompactRichTextEditor from "@/app/components/admin/CompactRichTextEditor";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type {
  Course,
  CourseCategory,
  CourseImage,
  CourseMode,
  CourseModule,
} from "@/app/types/course";

type CurriculumFormItem = {
  title: string;
  topicsText: string;
};

type InterviewQuestionFormItem = {
  question: string;
  answer: string;
};

type FeatureFormItem = {
  title: string;
  description: string;
};

type CourseFormState = {
  title: string;
  slug: string;
  category: CourseCategory;

  description: string;

  coverImage: CourseImage | null;
  coverImageAlt: string;
  galleryImages: CourseImage[];

  duration: string;
  modulesCount: string;
  rating: string;

  sessionDuration: string;
  classSchedule: string;
  mode: CourseMode;
  enrolled: string;
  placementSupport: boolean;

  whatYouWillLearnText: string;
  supportAndCareerText: string;
  features: FeatureFormItem[];

  curriculum: CurriculumFormItem[];
  interviewQuestions: InterviewQuestionFormItem[];

  isFeatured: boolean;
  isPublished: boolean;
};

export type CourseSubmitPayload = {
  title: string;
  slug: string;
  category: CourseCategory;

  description: string;

  coverImage: CourseImage | null;
  galleryImages: CourseImage[];

  duration: string;
  modulesCount: string;
  rating: number;

  sessionDuration: string;
  classSchedule: string;
  mode: CourseMode;
  enrolled: string;
  placementSupport: boolean;

  whatYouWillLearn: string[];
  features: {
    title: string;
    description: string;
  }[];
  supportAndCareer: string[];

  curriculum: {
    title: string;
    topics: string[];
  }[];

  interviewQuestions: {
    question: string;
    answer: string;
  }[];

  isFeatured: boolean;
  isPublished: boolean;
};

type Props = {
  initialData?: Course | null;
  onSubmit: (payload: CourseSubmitPayload) => Promise<void>;
  submitting?: boolean;
};

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1;
  return `${month} Month${month > 1 ? "s" : ""}`;
});

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function htmlToLines(value: string) {
  if (!value?.trim()) return [];

  if (typeof window === "undefined") {
    return value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|blockquote)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");
  const lines: string[] = [];

  const blockTags = new Set([
    "P",
    "DIV",
    "LI",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "BLOCKQUOTE",
  ]);

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      if (text) lines.push(text);
      return;
    }

    if (!(node instanceof HTMLElement)) return;

    if (node.tagName === "BR") {
      lines.push("\n");
      return;
    }

    if (blockTags.has(node.tagName)) {
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      if (text) lines.push(text);
      return;
    }

    Array.from(node.childNodes).forEach(walk);
  };

  Array.from(doc.body.childNodes).forEach(walk);

  return lines
    .join("\n")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesToHtml(lines?: string[]) {
  if (!lines?.length) return "";
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}

function emptyInterviewQuestion(): InterviewQuestionFormItem {
  return {
    question: "",
    answer: "",
  };
}

function emptyFeature(): FeatureFormItem {
  return {
    title: "",
    description: "",
  };
}

function toCurriculumForm(curriculum?: CourseModule[]) {
  if (!curriculum?.length) {
    return [{ title: "", topicsText: "" }];
  }

  return curriculum.map((item) => ({
    title: item.title || "",
    topicsText: linesToHtml(item.topics || []),
  }));
}

function toInterviewQuestionForm(
  interviewQuestions?: { question?: string; answer?: string }[]
) {
  if (!interviewQuestions?.length) {
    return [emptyInterviewQuestion()];
  }

  return interviewQuestions.map((item) => ({
    question: item.question || "",
    answer: item.answer || "",
  }));
}

function toFeatureForm(
  features?: { title?: string; description?: string }[]
): FeatureFormItem[] {
  if (!features?.length) {
    return [emptyFeature()];
  }

  return features.map((item) => ({
    title: item.title || "",
    description: item.description || "",
  }));
}

function toFormState(course?: Course | null): CourseFormState {
  return {
    title: course?.title || "",
    slug: course?.slug || "",
    category: course?.category || "New One",

    description: course?.description || "",

    coverImage: course?.coverImage || null,
    coverImageAlt: course?.coverImage?.alt || "",
    galleryImages: course?.galleryImages || [],

    duration: course?.duration || "",
    modulesCount: course?.modulesCount || "",
    rating: course?.rating != null ? String(course.rating) : "",

    sessionDuration: course?.sessionDuration || "",
    classSchedule: course?.classSchedule || "",
    mode: course?.mode || "Online/Offline",
    enrolled: course?.enrolled || "",
    placementSupport: course?.placementSupport ?? true,

    whatYouWillLearnText: linesToHtml(course?.whatYouWillLearn || []),
    supportAndCareerText: linesToHtml(course?.supportAndCareer || []),
    features: toFeatureForm(course?.features),

    curriculum: toCurriculumForm(course?.curriculum),
    interviewQuestions: toInterviewQuestionForm(course?.interviewQuestions),

    isFeatured: Boolean(course?.isFeatured),
    isPublished: Boolean(course?.isPublished),
  };
}

export default function CourseForm({
  initialData,
  onSubmit,
  submitting = false,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<CourseFormState>(() => toFormState(initialData));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitMode, setSubmitMode] = useState<"default" | "publish">("default");
  const [activeSection, setActiveSection] = useState("section-basic-info");

  const isEdit = useMemo(() => Boolean(initialData?._id), [initialData]);

  useEffect(() => {
    setForm(toFormState(initialData));
  }, [initialData]);

  const progressItems = useMemo(
    () => [
      {
        id: "section-basic-info",
        label: "Basic Info",
        done: Boolean(
          form.title.trim() &&
          form.slug.trim() &&
          htmlToLines(form.description).length
        ),
      },
      {
        id: "section-cover-image",
        label: "Cover Image",
        done: Boolean(form.coverImage?.url),
      },
      {
        id: "section-gallery",
        label: "Gallery",
        done: form.galleryImages.length > 0,
      },
      {
        id: "section-highlights",
        label: "Highlights",
        done:
          htmlToLines(form.whatYouWillLearnText).length > 0 ||
          form.features.some(
            (item) =>
              item.title.trim() || htmlToLines(item.description).length > 0
          ) ||
          htmlToLines(form.supportAndCareerText).length > 0,
      },
      {
        id: "section-curriculum",
        label: "Curriculum",
        done: form.curriculum.some(
          (item) => item.title.trim() || htmlToLines(item.topicsText).length > 0
        ),
      },
      {
        id: "section-interview-questions",
        label: "Interview Q&A",
        done: form.interviewQuestions.some(
          (item) => item.question.trim() && item.answer.trim()
        ),
      },
      {
        id: "section-publishing",
        label: "Publishing",
        done: form.isPublished || form.isFeatured,
      },
    ],
    [form]
  );

  useEffect(() => {
    const sectionIds = progressItems.map((item) => item.id);

    const handler = () => {
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 160) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();

    return () => window.removeEventListener("scroll", handler);
  }, [progressItems]);

  async function uploadSingleImage(
    file: File
  ): Promise<{ success: boolean; data: CourseImage }> {
    const formData = new FormData();
    formData.append("image", file);

    return apiFetch<{ success: boolean; data: CourseImage }>(
      SummaryApi.upload_course_image.url,
      {
        method: SummaryApi.upload_course_image.method,
        body: formData,
      }
    );
  }

  async function removeServerImage(publicId?: string | null) {
    if (!publicId) return;

    await apiFetch(SummaryApi.delete_course_image.url, {
      method: SummaryApi.delete_course_image.method,
      json: { public_id: publicId },
    });
  }

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const res = await uploadSingleImage(file);

      setForm((prev) => ({
        ...prev,
        coverImage: {
          ...res.data,
          alt: prev.coverImageAlt || res.data.alt || "",
        },
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to upload cover image"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeCoverImage() {
    try {
      setUploading(true);
      setError("");

      if (form.coverImage?.public_id) {
        await removeServerImage(form.coverImage.public_id);
      }

      setForm((prev) => ({
        ...prev,
        coverImage: null,
        coverImageAlt: "",
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete cover image"));
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      setError("");

      const uploadedImages: CourseImage[] = [];

      for (const file of files) {
        const res = await uploadSingleImage(file);
        uploadedImages.push(res.data);
      }

      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedImages],
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to upload gallery images"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeGalleryImage(index: number) {
    try {
      setUploading(true);
      setError("");

      const image = form.galleryImages[index];
      if (image?.public_id) {
        await removeServerImage(image.public_id);
      }

      setForm((prev) => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete gallery image"));
    } finally {
      setUploading(false);
    }
  }

  function addCurriculumItem() {
    setForm((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: "", topicsText: "" }],
    }));
  }

  function removeCurriculumItem(index: number) {
    setForm((prev) => ({
      ...prev,
      curriculum:
        prev.curriculum.length === 1
          ? [{ title: "", topicsText: "" }]
          : prev.curriculum.filter((_, i) => i !== index),
    }));
  }

  function updateCurriculumItem(
    index: number,
    key: keyof CurriculumFormItem,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addInterviewQuestion() {
    setForm((prev) => ({
      ...prev,
      interviewQuestions: [
        ...prev.interviewQuestions,
        emptyInterviewQuestion(),
      ],
    }));
  }

  function removeInterviewQuestion(index: number) {
    setForm((prev) => ({
      ...prev,
      interviewQuestions:
        prev.interviewQuestions.length === 1
          ? [emptyInterviewQuestion()]
          : prev.interviewQuestions.filter((_, i) => i !== index),
    }));
  }

  function updateInterviewQuestion(
    index: number,
    key: keyof InterviewQuestionFormItem,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      interviewQuestions: prev.interviewQuestions.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addFeature() {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, emptyFeature()],
    }));
  }

  function removeFeature(index: number) {
    setForm((prev) => ({
      ...prev,
      features:
        prev.features.length === 1
          ? [emptyFeature()]
          : prev.features.filter((_, i) => i !== index),
    }));
  }

  function updateFeature(
    index: number,
    key: keyof FeatureFormItem,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");

      if (!form.title.trim()) {
        throw new Error("Title is required");
      }

      const curriculum = form.curriculum
        .map((item) => ({
          title: item.title.trim(),
          topics: htmlToLines(item.topicsText),
        }))
        .filter((item) => item.title || item.topics.length);

      const interviewQuestions = form.interviewQuestions
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))
        .filter((item) => item.question && item.answer);

      const features = form.features
        .map((item) => ({
          title: item.title.trim(),
          description: item.description.trim(),
        }))
        .filter(
          (item) => item.title || htmlToLines(item.description).length > 0
        );

      const ratingValue = Number(form.rating);
      const safeRating =
        form.rating.trim() && Number.isFinite(ratingValue) ? ratingValue : 0;

      const payload: CourseSubmitPayload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,

        description: form.description.trim(),

        coverImage: form.coverImage
          ? {
            ...form.coverImage,
            alt: form.coverImageAlt.trim(),
          }
          : null,
        galleryImages: form.galleryImages,

        duration: form.duration.trim(),
        modulesCount: form.modulesCount.trim(),
        rating: safeRating,

        sessionDuration: form.sessionDuration.trim(),
        classSchedule: form.classSchedule.trim(),
        mode: form.mode,
        enrolled: form.enrolled.trim(),
        placementSupport: form.placementSupport,

        whatYouWillLearn: htmlToLines(form.whatYouWillLearnText),
        features,
        supportAndCareer: htmlToLines(form.supportAndCareerText),

        curriculum,
        interviewQuestions,

        isFeatured: form.isFeatured,
        isPublished: submitMode === "publish" ? true : form.isPublished,
      };

      await onSubmit(payload);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save course"));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="order-2 xl:order-1">
          <CourseFormProgress
            items={progressItems}
            activeSection={activeSection}
          />
        </div>

        <div className="order-1 space-y-8 xl:order-2">
          <div className="sticky top-4 z-30 mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  aria-label="Go back"
                  title="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                <div>
                  <p className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">
                    Course Workspace
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {isEdit ? "Edit Course" : "Create Course"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage course information, curriculum, interview questions,
                    features, and gallery.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/admin/courses")}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  onClick={() => setSubmitMode("publish")}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save & Publish
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  onClick={() => setSubmitMode("default")}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : isEdit
                      ? "Update Course"
                      : "Create Course"}
                </button>
              </div>
            </div>
          </div>

          <section
            id="section-basic-info"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter the main course details and description.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Title *">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: prev.slug ? prev.slug : slugify(e.target.value),
                    }))
                  }
                  className="input"
                  placeholder="Enter course title"
                  required
                />
              </Field>

              <Field label="Slug *">
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: slugify(e.target.value),
                    }))
                  }
                  className="input"
                  placeholder="course-slug"
                  required
                />
              </Field>

              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value as CourseCategory,
                    }))
                  }
                  className="input"
                >
                  <option value="New One">New One</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Most Placed">Most Placed</option>
                </select>
              </Field>

              <Field label="Mode">
                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      mode: e.target.value as CourseMode,
                    }))
                  }
                  className="input"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Online/Offline">Online/Offline</option>
                </select>
              </Field>

              <Field label="Duration">
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  className="input"
                  placeholder="e.g. 3 Months / 45 Days / 120 Hours"
                />
              </Field>

              <Field label="Modules Count">
                <input
                  value={form.modulesCount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      modulesCount: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="12 Modules"
                />
              </Field>

              <Field label="Rating">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, rating: e.target.value }))
                  }
                  className="input"
                  placeholder="4.8"
                />
              </Field>

              <Field label="Session Duration">
                <input
                  value={form.sessionDuration}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sessionDuration: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="2 Hours / Day"
                />
              </Field>

              <Field label="Class Schedule">
                <input
                  value={form.classSchedule}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      classSchedule: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="Mon - Fri"
                />
              </Field>

              <Field label="Enrolled">
                <input
                  value={form.enrolled}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, enrolled: e.target.value }))
                  }
                  className="input"
                  placeholder="1200+"
                />
              </Field>

              <Field label="Description" full>
                <CompactRichTextEditor
                  value={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Detailed course description"
                  minHeight={220}
                />
              </Field>
            </div>
          </section>

          <section
            id="section-cover-image"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Cover Image
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload main course thumbnail.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
              <div className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-50">
                {form.coverImage?.url ? (
                  <div className="relative h-56 w-full">
                    <Image
                      src={form.coverImage.url}
                      alt={
                        form.coverImageAlt ||
                        form.coverImage.alt ||
                        "Course cover image"
                      }
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-500">
                    No image uploaded
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={uploading || submitting}
                    />
                  </label>

                  {form.coverImage ? (
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      disabled={uploading || submitting}
                      className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>

                <Field label="Image Alt Text">
                  <input
                    value={form.coverImageAlt}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        coverImageAlt: e.target.value,
                        coverImage: prev.coverImage
                          ? { ...prev.coverImage, alt: e.target.value }
                          : null,
                      }))
                    }
                    className="input"
                    placeholder="Course image alt text"
                  />
                </Field>
              </div>
            </div>
          </section>

          <section
            id="section-gallery"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Gallery Images
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload multiple course showcase images.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                {uploading ? "Uploading..." : "Upload Gallery"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                  disabled={uploading || submitting}
                />
              </label>
            </div>

            {form.galleryImages.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No gallery images added yet.
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {form.galleryImages.map((img, index) => (
                  <div
                    key={`${img.public_id || img.url}-${index}`}
                    className="overflow-hidden rounded-2xl border bg-white"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Gallery ${index + 1}`}
                      className="h-40 w-full object-cover"
                      width={300}
                      height={200}
                      unoptimized
                    />
                    <div className="space-y-2 p-3">
                      <input
                        value={img.alt || ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            galleryImages: prev.galleryImages.map((item, i) =>
                              i === index
                                ? { ...item, alt: e.target.value }
                                : item
                            ),
                          }))
                        }
                        className="input"
                        placeholder="Image alt text"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        disabled={uploading || submitting}
                        className="w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section
            id="section-highlights"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Highlights
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add learning outcomes, course features, and career support
                details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Field label="What You Will Learn" full>
                <CompactRichTextEditor
                  value={form.whatYouWillLearnText}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      whatYouWillLearnText: value,
                    }))
                  }
                  placeholder="Add learning outcomes as bullet points or paragraphs"
                  minHeight={220}
                />
              </Field>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900">Features</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Add feature title and description.
                  </p>
                </div>

                <div className="space-y-4">
                  {form.features.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h5 className="font-semibold text-slate-900">
                          Feature {index + 1}
                        </h5>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Feature Title">
                          <input
                            value={item.title}
                            onChange={(e) =>
                              updateFeature(index, "title", e.target.value)
                            }
                            className="input"
                            placeholder="Industry-Oriented Curriculum"
                          />
                        </Field>

                        <Field label="Feature Description">
                          <CompactRichTextEditor
                            value={item.description}
                            onChange={(value) =>
                              updateFeature(index, "description", value)
                            }
                            placeholder="Explain this feature"
                            minHeight={180}
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <Field label="Support and Career" full>
                <CompactRichTextEditor
                  value={form.supportAndCareerText}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      supportAndCareerText: value,
                    }))
                  }
                  placeholder="Add support and career details as bullet points or paragraphs"
                  minHeight={220}
                />
              </Field>
            </div>
          </section>

          <section
            id="section-curriculum"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Curriculum
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add modules and topics for the course.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {form.curriculum.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      Module {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeCurriculumItem(index)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Module Title">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateCurriculumItem(index, "title", e.target.value)
                        }
                        className="input"
                        placeholder="Introduction to Snowflake"
                      />
                    </Field>

                    <Field label="Topics">
                      <CompactRichTextEditor
                        value={item.topicsText}
                        onChange={(value) =>
                          updateCurriculumItem(index, "topicsText", value)
                        }
                        placeholder="Add topics as bullet points or paragraphs"
                        minHeight={200}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={addCurriculumItem}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Add Module
              </button>
            </div>
          </section>

          <section
            id="section-interview-questions"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Interview Questions
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add important interview questions and answers for this course.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {form.interviewQuestions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      Question {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeInterviewQuestion(index)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Question">
                      <input
                        value={item.question}
                        onChange={(e) =>
                          updateInterviewQuestion(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        className="input"
                        placeholder="What is AWS IAM?"
                      />
                    </Field>

                    <Field label="Answer">
                      <CompactRichTextEditor
                        value={item.answer}
                        onChange={(value) =>
                          updateInterviewQuestion(index, "answer", value)
                        }
                        placeholder="Enter answer"
                        minHeight={180}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={addInterviewQuestion}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Add Question
              </button>
            </div>
          </section>

          <section
            id="section-publishing"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Publishing
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.placementSupport}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      placementSupport: e.target.checked,
                    }))
                  }
                />
                Placement Support
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                />
                Featured Course
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                />
                Publish Course
              </label>
            </div>
          </section>

          <style jsx>{`
            .input {
              width: 100%;
              border: 1px solid #cbd5e1;
              border-radius: 1rem;
              padding: 0.82rem 0.95rem;
              font-size: 0.95rem;
              outline: none;
              background: #fff;
            }

            .input:focus {
              border-color: #7c3aed;
              box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
            }
          `}</style>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}