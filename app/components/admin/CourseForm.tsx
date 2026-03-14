"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";

import CourseFormProgress from "@/app/components/admin/CourseFormProgress";
import CompactRichTextEditor from "@/app/components/admin/CompactRichTextEditor";

import type {
  Course,
  CourseCategory,
  CourseMode,
  CourseImage,
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

type CourseSubmitPayload = {
  title: string;
  slug: string;
  category: CourseCategory;

  description: string;

  coverImage: CourseImage | null;
  galleryImages: CourseImage[];

  duration: string;
  modulesCount: string;
  rating?: number;

  sessionDuration: string;
  classSchedule: string;
  mode: CourseMode;
  enrolled: string;
  placementSupport: boolean;

  whatYouWillLearn: string[];
  features: FeatureFormItem[];
  supportAndCareer: string[];

  curriculum: {
    title: string;
    topics: string[];
  }[];

  interviewQuestions: InterviewQuestionFormItem[];

  isFeatured: boolean;
  isPublished: boolean;
};

type Props = {
  initialData?: Course | null;
  onSubmit: (payload: CourseSubmitPayload) => Promise<void>;
  submitting?: boolean;
};

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const m = index + 1;
  return `${m} Month${m > 1 ? "s" : ""}`;
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function htmlToLines(value: string) {
  if (!value?.trim()) return [];
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function linesToHtml(lines?: string[]) {
  if (!lines?.length) return "";
  return lines.map((l) => `<p>${l}</p>`).join("");
}

function emptyFeature(): FeatureFormItem {
  return { title: "", description: "" };
}

function emptyQuestion(): InterviewQuestionFormItem {
  return { question: "", answer: "" };
}

function toCurriculumForm(curriculum?: CourseModule[]): CurriculumFormItem[] {
  if (!curriculum?.length) return [{ title: "", topicsText: "" }];

  return curriculum.map((item) => ({
    title: item.title || "",
    topicsText: linesToHtml(item.topics || []),
  }));
}

function toFeatureForm(features?: FeatureFormItem[]) {
  if (!features?.length) return [emptyFeature()];
  return features.map((f) => ({
    title: f.title || "",
    description: f.description || "",
  }));
}

function toQuestionForm(
  questions?: InterviewQuestionFormItem[]
): InterviewQuestionFormItem[] {
  if (!questions?.length) return [emptyQuestion()];
  return questions.map((q) => ({
    question: q.question || "",
    answer: q.answer || "",
  }));
}

function toFormState(course?: Course | null): CourseFormState {
  return {
    title: course?.title || "",
    slug: course?.slug || "",
    category: course?.category || "New One",

    description: course?.description || "",

    coverImage: course?.coverImage || null,
    galleryImages: course?.galleryImages || [],

    duration: course?.duration || "",
    modulesCount: course?.modulesCount || "",
    rating: course?.rating ? String(course.rating) : "",

    sessionDuration: course?.sessionDuration || "",
    classSchedule: course?.classSchedule || "",
    mode: course?.mode || "Online/Offline",
    enrolled: course?.enrolled || "",
    placementSupport: course?.placementSupport ?? true,

    whatYouWillLearnText: linesToHtml(course?.whatYouWillLearn || []),
    supportAndCareerText: linesToHtml(course?.supportAndCareer || []),

    features: toFeatureForm(course?.features),
    curriculum: toCurriculumForm(course?.curriculum),
    interviewQuestions: toQuestionForm(course?.interviewQuestions),

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

  const [form, setForm] = useState<CourseFormState>(toFormState(initialData));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialData?._id);

  async function uploadSingleImage(file: File) {
    const fd = new FormData();
    fd.append("image", file);

    return apiFetch<{ success: boolean; data: CourseImage }>(
      SummaryApi.upload_course_image.url,
      {
        method: SummaryApi.upload_course_image.method,
        body: fd,
      }
    );
  }

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const res = await uploadSingleImage(file);

      setForm((prev) => ({
        ...prev,
        coverImage: res.data,
      }));
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const images: CourseImage[] = [];

      for (const f of files) {
        const res = await uploadSingleImage(f);
        images.push(res.data);
      }

      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...images],
      }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (!form.title.trim()) throw new Error("Title required");

      const payload: CourseSubmitPayload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,

        description: form.description,

        coverImage: form.coverImage,
        galleryImages: form.galleryImages,

        duration: form.duration,
        modulesCount: form.modulesCount,
        rating: form.rating ? Number(form.rating) : undefined,

        sessionDuration: form.sessionDuration,
        classSchedule: form.classSchedule,
        mode: form.mode,
        enrolled: form.enrolled,
        placementSupport: form.placementSupport,

        whatYouWillLearn: htmlToLines(form.whatYouWillLearnText),
        supportAndCareer: htmlToLines(form.supportAndCareerText),

        features: form.features,
        curriculum: form.curriculum.map((c) => ({
          title: c.title,
          topics: htmlToLines(c.topicsText),
        })),
        interviewQuestions: form.interviewQuestions,

        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BASIC INFO */}

      <section className="rounded-2xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Basic Info</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  title: e.target.value,
                  slug: slugify(e.target.value),
                }))
              }
              className="input"
            />
          </Field>

          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slug: slugify(e.target.value),
                }))
              }
              className="input"
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  category: e.target.value as CourseCategory,
                }))
              }
              className="input"
            >
              <option>New One</option>
              <option>Recommended</option>
              <option>Most Placed</option>
            </select>
          </Field>

          <Field label="Mode">
            <select
              value={form.mode}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  mode: e.target.value as CourseMode,
                }))
              }
              className="input"
            >
              <option>Online</option>
              <option>Offline</option>
              <option>Online/Offline</option>
            </select>
          </Field>
        </div>
      </section>

      {/* COVER IMAGE */}

      <section className="rounded-2xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Cover Image</h3>

        {form.coverImage?.url && (
          <Image
            src={form.coverImage.url}
            alt="cover"
            width={500}
            height={300}
            className="mb-4 rounded-xl"
          />
        )}

        <input type="file" onChange={handleCoverUpload} />
      </section>

      {/* GALLERY */}

      <section className="rounded-2xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Gallery</h3>

        <input type="file" multiple onChange={handleGalleryUpload} />

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {form.galleryImages.map((img, i) => (
            <Image
              key={i}
              src={img.url}
              alt=""
              width={200}
              height={120}
              className="rounded-xl"
            />
          ))}
        </div>
      </section>

      {/* ACTION BUTTONS */}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="rounded-xl border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-white"
        >
          {isEdit ? "Update Course" : "Create Course"}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 10px;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}