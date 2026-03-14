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
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import CourseFormProgress from "@/app/components/admin/CourseFormProgress";
import type {
  ICourse,
  CourseCategory,
  CourseMode,
  ICourseImage,
  ICourseModule,
  ICourseTrainer,
  ICourseReview,
} from "@/app/types/course";
import Image from "next/image";

type CurriculumFormItem = {
  title: string;
  topicsText: string;
};

type TrainerFormItem = {
  name: string;
  role: string;
  bio: string;
  experience: string;
  linkedin: string;
  image: ICourseImage | null;
};

type ReviewFormItem = {
  name: string;
  rating: string;
  comment: string;
  role: string;
};

type CourseFormState = {
  title: string;
  slug: string;
  category: CourseCategory;

  shortDesc: string;
  description: string;
  overview: string;

  coverImage: ICourseImage | null;
  galleryImages: ICourseImage[];

  duration: string;
  modulesCount: string;
  rating: string;

  sessionDuration: string;
  classSchedule: string;
  mode: CourseMode;
  enrolled: string;
  batchSize: string;
  admissionFee: string;
  placementSupport: boolean;

  featuresText: string;
  supportText: string;

  curriculum: CurriculumFormItem[];
  trainers: TrainerFormItem[];
  reviews: ReviewFormItem[];

  isFeatured: boolean;
  isPublished: boolean;
};

type CourseSubmitPayload = {
  title: string;
  slug: string;
  category: CourseCategory;

  shortDesc: string;
  description: string;
  overview: string;

  coverImage: ICourseImage | null;
  galleryImages: ICourseImage[];

  duration: string;
  modulesCount: string;
  rating: number;

  sessionDuration: string;
  classSchedule: string;
  mode: CourseMode;
  enrolled: string;
  batchSize: string;
  admissionFee: number | null;
  placementSupport: boolean;

  features: string[];
  support: string[];

  curriculum: {
    title: string;
    topics: string[];
  }[];

  trainers: {
    name: string;
    role: string;
    bio: string;
    experience: string;
    linkedin: string;
    image: ICourseImage | null;
  }[];

  reviews: {
    name: string;
    rating: number;
    comment: string;
    role: string;
  }[];

  isFeatured: boolean;
  isPublished: boolean;
};

type Props = {
  initialData?: ICourse | null;
  onSubmit: (payload: CourseSubmitPayload) => Promise<void>;
  submitting?: boolean;
};

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
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

function emptyTrainer(): TrainerFormItem {
  return {
    name: "",
    role: "",
    bio: "",
    experience: "",
    linkedin: "",
    image: null,
  };
}

function emptyReview(): ReviewFormItem {
  return {
    name: "",
    rating: "",
    comment: "",
    role: "",
  };
}

function toCurriculumForm(curriculum?: ICourseModule[]) {
  if (!curriculum?.length) {
    return [{ title: "", topicsText: "" }];
  }

  return curriculum.map((item) => ({
    title: item.title || "",
    topicsText: (item.topics || []).join("\n"),
  }));
}

function toTrainerForm(trainers?: ICourseTrainer[]) {
  if (!trainers?.length) {
    return [emptyTrainer()];
  }

  return trainers.map((item) => ({
    name: item.name || "",
    role: item.role || "",
    bio: item.bio || "",
    experience: item.experience || "",
    linkedin: item.linkedin || "",
    image: item.image || null,
  }));
}

function toReviewForm(reviews?: ICourseReview[]) {
  if (!reviews?.length) {
    return [emptyReview()];
  }

  return reviews.map((item) => ({
    name: item.name || "",
    rating: item.rating != null ? String(item.rating) : "",
    comment: item.comment || "",
    role: item.role || "",
  }));
}

function toFormState(course?: ICourse | null): CourseFormState {
  return {
    title: course?.title || "",
    slug: course?.slug || "",
    category: course?.category || "New One",

    shortDesc: course?.shortDesc || "",
    description: course?.description || "",
    overview: course?.overview || "",

    coverImage: course?.coverImage || null,
    galleryImages: course?.galleryImages || [],

    duration: course?.duration || "",
    modulesCount: course?.modulesCount || "",
    rating: course?.rating != null ? String(course.rating) : "",

    sessionDuration: course?.sessionDuration || "",
    classSchedule: course?.classSchedule || "",
    mode: course?.mode || "Online/Offline",
    enrolled: course?.enrolled || "",
    batchSize: course?.batchSize || "",
    admissionFee:
      course?.admissionFee != null ? String(course.admissionFee) : "",
    placementSupport: course?.placementSupport ?? true,

    featuresText: (course?.features || []).join("\n"),
    supportText: (course?.support || []).join("\n"),

    curriculum: toCurriculumForm(course?.curriculum),
    trainers: toTrainerForm(course?.trainers),
    reviews: toReviewForm(course?.reviews),

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
  const [submitMode, setSubmitMode] = useState<"default" | "publish">(
    "default"
  );
  const [activeSection, setActiveSection] = useState("section-basic-info");

  const isEdit = useMemo(() => Boolean(initialData?._id), [initialData]);

  const progressItems = useMemo(
    () => [
      {
        id: "section-basic-info",
        label: "Basic Info",
        done: Boolean(
          form.title.trim() && form.slug.trim() && form.shortDesc.trim()
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
          splitLines(form.featuresText).length > 0 ||
          splitLines(form.supportText).length > 0,
      },
      {
        id: "section-curriculum",
        label: "Curriculum",
        done: form.curriculum.some(
          (item) => item.title.trim() || splitLines(item.topicsText).length > 0
        ),
      },
      {
        id: "section-trainers",
        label: "Trainers",
        done: form.trainers.some((item) => item.name.trim()),
      },
      {
        id: "section-reviews",
        label: "Reviews",
        done: form.reviews.some(
          (item) =>
            item.name.trim() &&
            item.comment.trim() &&
            Number(item.rating) > 0
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
  ): Promise<{ success: boolean; data: ICourseImage }> {
    const formData = new FormData();
    formData.append("image", file);

    return apiFetch<{ success: boolean; data: ICourseImage }>(
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
        coverImage: res.data,
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

      const uploadedImages: ICourseImage[] = [];

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

  async function handleTrainerImageUpload(
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const res = await uploadSingleImage(file);

      setForm((prev) => ({
        ...prev,
        trainers: prev.trainers.map((trainer, i) =>
          i === index ? { ...trainer, image: res.data } : trainer
        ),
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to upload trainer image"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeTrainerImage(index: number) {
    try {
      setUploading(true);
      setError("");

      const trainer = form.trainers[index];
      if (trainer?.image?.public_id) {
        await removeServerImage(trainer.image.public_id);
      }

      setForm((prev) => ({
        ...prev,
        trainers: prev.trainers.map((item, i) =>
          i === index ? { ...item, image: null } : item
        ),
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete trainer image"));
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

  function addTrainer() {
    setForm((prev) => ({
      ...prev,
      trainers: [...prev.trainers, emptyTrainer()],
    }));
  }

  function removeTrainer(index: number) {
    setForm((prev) => ({
      ...prev,
      trainers:
        prev.trainers.length === 1
          ? [emptyTrainer()]
          : prev.trainers.filter((_, i) => i !== index),
    }));
  }

  function updateTrainer(
    index: number,
    key: keyof Omit<TrainerFormItem, "image">,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      trainers: prev.trainers.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addReview() {
    setForm((prev) => ({
      ...prev,
      reviews: [...prev.reviews, emptyReview()],
    }));
  }

  function removeReview(index: number) {
    setForm((prev) => ({
      ...prev,
      reviews:
        prev.reviews.length === 1
          ? [emptyReview()]
          : prev.reviews.filter((_, i) => i !== index),
    }));
  }

  function updateReview(
    index: number,
    key: keyof ReviewFormItem,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      reviews: prev.reviews.map((item, i) =>
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
          topics: splitLines(item.topicsText),
        }))
        .filter((item) => item.title || item.topics.length);

      const trainers = form.trainers
        .map((item) => ({
          name: item.name.trim(),
          role: item.role.trim(),
          bio: item.bio.trim(),
          experience: item.experience.trim(),
          linkedin: item.linkedin.trim(),
          image: item.image || null,
        }))
        .filter((item) => item.name);

      const reviews = form.reviews
        .map((item) => ({
          name: item.name.trim(),
          rating: item.rating.trim() ? Number(item.rating) : 0,
          comment: item.comment.trim(),
          role: item.role.trim(),
        }))
        .filter((item) => item.name && item.comment && item.rating > 0);

      const payload: CourseSubmitPayload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,

        shortDesc: form.shortDesc.trim(),
        description: form.description.trim(),
        overview: form.overview.trim(),

        coverImage: form.coverImage || null,
        galleryImages: form.galleryImages,

        duration: form.duration.trim(),
        modulesCount: form.modulesCount.trim(),
        rating: form.rating.trim() ? Number(form.rating) : 0,

        sessionDuration: form.sessionDuration.trim(),
        classSchedule: form.classSchedule.trim(),
        mode: form.mode,
        enrolled: form.enrolled.trim(),
        batchSize: form.batchSize.trim(),
        admissionFee: form.admissionFee.trim()
          ? Number(form.admissionFee)
          : null,
        placementSupport: form.placementSupport,

        features: splitLines(form.featuresText),
        support: splitLines(form.supportText),

        curriculum,
        trainers,
        reviews,

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
                    Manage course information, curriculum, trainers, reviews,
                    and gallery.
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
                  className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
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
                Enter the main course details and descriptions.
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
                  value={form.duration}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  className="input"
                  placeholder="3 Months"
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

              <Field label="Admission Fee">
                <input
                  type="number"
                  min="0"
                  value={form.admissionFee}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      admissionFee: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="25000"
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

              <Field label="Batch Size">
                <input
                  value={form.batchSize}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, batchSize: e.target.value }))
                  }
                  className="input"
                  placeholder="30 Students"
                />
              </Field>

              <Field label="Short Description" full>
                <textarea
                  value={form.shortDesc}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, shortDesc: e.target.value }))
                  }
                  className="textarea"
                  placeholder="Short description"
                />
              </Field>

              <Field label="Description" full>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="textarea"
                  placeholder="Detailed description"
                />
              </Field>

              <Field label="Overview" full>
                <textarea
                  value={form.overview}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, overview: e.target.value }))
                  }
                  className="textarea"
                  placeholder="Course overview"
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
              <div className="overflow-hidden rounded-2xl border bg-slate-50">
                {form.coverImage?.url ? (
                  <Image
                    src={form.coverImage.url}
                    alt={form.coverImage.alt || form.title || "Course cover"}
                    className="h-56 w-full object-cover"
                    width={300}
                    height={200}
                  />
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
                      className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>

                <Field label="Image Alt Text">
                  <input
                    value={form.coverImage?.alt || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
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
                        className="w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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
            <h3 className="text-lg font-semibold text-slate-900">
              Highlights
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Features (one per line)" full>
                <textarea
                  value={form.featuresText}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      featuresText: e.target.value,
                    }))
                  }
                  className="textarea"
                  placeholder={`Live projects
Placement support
Mock interviews`}
                />
              </Field>

              <Field label="Support (one per line)" full>
                <textarea
                  value={form.supportText}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      supportText: e.target.value,
                    }))
                  }
                  className="textarea"
                  placeholder={`Mentor support
Resume guidance
Doubt clearing`}
                />
              </Field>
            </div>
          </section>

          <section
            id="section-curriculum"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Curriculum
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add modules and topics for the course.
                </p>
              </div>

              <button
                type="button"
                onClick={addCurriculumItem}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Add Module
              </button>
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

                    <Field label="Topics (one per line)">
                      <textarea
                        value={item.topicsText}
                        onChange={(e) =>
                          updateCurriculumItem(
                            index,
                            "topicsText",
                            e.target.value
                          )
                        }
                        className="textarea"
                        placeholder={`Snowflake basics
Architecture
Warehouses
Data loading`}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="section-trainers"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Trainers
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add trainer profiles, experience, and image.
                </p>
              </div>

              <button
                type="button"
                onClick={addTrainer}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Add Trainer
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {form.trainers.map((trainer, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      Trainer {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeTrainer(index)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-5 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
                    <div className="overflow-hidden rounded-2xl border bg-slate-50">
                      {trainer.image?.url ? (
                        <Image
                          src={trainer.image.url}
                          alt={trainer.image.alt || trainer.name || "Trainer image"}
                          className="h-52 w-full object-cover"
                          width={220}
                          height={208}
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center text-sm text-slate-500">
                          No trainer image
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                          {uploading ? "Uploading..." : "Upload Trainer Image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleTrainerImageUpload(index, e)}
                            disabled={uploading || submitting}
                          />
                        </label>

                        {trainer.image ? (
                          <button
                            type="button"
                            onClick={() => removeTrainerImage(index)}
                            disabled={uploading || submitting}
                            className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Remove Image
                          </button>
                        ) : null}
                      </div>

                      <Field label="Trainer Image Alt Text">
                        <input
                          value={trainer.image?.alt || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              trainers: prev.trainers.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      image: item.image
                                        ? { ...item.image, alt: e.target.value }
                                        : null,
                                    }
                                  : item
                              ),
                            }))
                          }
                          className="input"
                          placeholder="Trainer image alt text"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Name">
                      <input
                        value={trainer.name}
                        onChange={(e) =>
                          updateTrainer(index, "name", e.target.value)
                        }
                        className="input"
                        placeholder="Trainer name"
                      />
                    </Field>

                    <Field label="Role">
                      <input
                        value={trainer.role}
                        onChange={(e) =>
                          updateTrainer(index, "role", e.target.value)
                        }
                        className="input"
                        placeholder="Senior Data Engineer"
                      />
                    </Field>

                    <Field label="Experience">
                      <input
                        value={trainer.experience}
                        onChange={(e) =>
                          updateTrainer(index, "experience", e.target.value)
                        }
                        className="input"
                        placeholder="8+ years"
                      />
                    </Field>

                    <Field label="LinkedIn">
                      <input
                        value={trainer.linkedin}
                        onChange={(e) =>
                          updateTrainer(index, "linkedin", e.target.value)
                        }
                        className="input"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </Field>

                    <Field label="Bio" full>
                      <textarea
                        value={trainer.bio}
                        onChange={(e) =>
                          updateTrainer(index, "bio", e.target.value)
                        }
                        className="textarea"
                        placeholder="Trainer biography"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="section-reviews"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Reviews
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add student testimonials and ratings.
                </p>
              </div>

              <button
                type="button"
                onClick={addReview}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Add Review
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {form.reviews.map((review, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      Review {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeReview(index)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Student Name">
                      <input
                        value={review.name}
                        onChange={(e) =>
                          updateReview(index, "name", e.target.value)
                        }
                        className="input"
                        placeholder="Student name"
                      />
                    </Field>

                    <Field label="Role / Designation">
                      <input
                        value={review.role}
                        onChange={(e) =>
                          updateReview(index, "role", e.target.value)
                        }
                        className="input"
                        placeholder="Data Analyst"
                      />
                    </Field>

                    <Field label="Rating (1 to 5)">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="1"
                        value={review.rating}
                        onChange={(e) =>
                          updateReview(index, "rating", e.target.value)
                        }
                        className="input"
                        placeholder="5"
                      />
                    </Field>

                    <div />

                    <Field label="Comment" full>
                      <textarea
                        value={review.comment}
                        onChange={(e) =>
                          updateReview(index, "comment", e.target.value)
                        }
                        className="textarea"
                        placeholder="Student feedback"
                      />
                    </Field>
                  </div>
                </div>
              ))}
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
            .textarea {
              width: 100%;
              min-height: 120px;
              border: 1px solid #cbd5e1;
              border-radius: 1rem;
              padding: 0.9rem 0.95rem;
              font-size: 0.95rem;
              outline: none;
              resize: vertical;
              background: #fff;
            }
            .textarea:focus {
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