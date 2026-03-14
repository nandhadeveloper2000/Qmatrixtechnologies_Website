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
import BlogFormProgress from "@/app/components/admin/BlogFormProgress";
import CompactRichTextEditor from "@/app/components/admin/CompactRichTextEditor";
import type {
  IBlog,
  IBlogFaq,
  IBlogImage,
  IBlogSubpoint,
} from "@/app/types/blog";

type BlogSectionPointForm = {
  title: string;
  description: string;
};

type BlogSectionSubpointForm = {
  subtitle: string;
  subdescription: string;
};

type BlogSectionForm = {
  title: string;
  description: string;
  subpoints: BlogSectionSubpointForm[];
  image: IBlogImage | null;
  points: BlogSectionPointForm[];
};

type BlogFaqForm = {
  question: string;
  answer: string;
};

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  introTitle: string;
  introDescription: string;
  category: string;
  tagsText: string;
  coverImage: IBlogImage | null;
  authorName: string;
  location: string;
  readTime: string;
  views: string;
  sections: BlogSectionForm[];
  faqs: BlogFaqForm[];
  isPublished: boolean;
};

export type BlogSubmitPayload = {
  title: string;
  slug: string;
  excerpt: string;
  introTitle: string;
  introDescription: string;
  category: string;
  tags: string[];
  coverImage: IBlogImage | null;
  authorName: string;
  location: string;
  readTime: number;
  views: number;
  sections: {
    title: string;
    description: string;
    subpoints: {
      subtitle: string;
      subdescription: string;
    }[];
    image: IBlogImage | null;
    points: {
      title: string;
      description: string;
    }[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  isPublished: boolean;
};

type Props = {
  initialData?: IBlog | null;
  onSubmit: (payload: BlogSubmitPayload) => Promise<void>;
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

function emptyPoint(): BlogSectionPointForm {
  return {
    title: "",
    description: "",
  };
}

function emptySubpoint(): BlogSectionSubpointForm {
  return {
    subtitle: "",
    subdescription: "",
  };
}

function emptySection(): BlogSectionForm {
  return {
    title: "",
    description: "",
    subpoints: [emptySubpoint()],
    image: null,
    points: [emptyPoint()],
  };
}

function toFaqForm(faqs?: IBlogFaq[]) {
  if (!faqs?.length) return [{ question: "", answer: "" }];

  return faqs.map((faq) => ({
    question: faq.question || "",
    answer: faq.answer || "",
  }));
}

function toSubpointForm(subpoints?: IBlogSubpoint[]) {
  if (!subpoints?.length) return [emptySubpoint()];

  return subpoints.map((item) => ({
    subtitle: item.subtitle || "",
    subdescription: item.subdescription || "",
  }));
}

function toFormState(blog?: IBlog | null): BlogFormState {
  return {
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    introTitle: blog?.introTitle || "",
    introDescription: blog?.introDescription || "",
    category: blog?.category || "General",
    tagsText: (blog?.tags || []).join(", "),
    coverImage: blog?.coverImage || null,
    authorName: blog?.authorName || "",
    location: blog?.location || "",
    readTime: blog?.readTime != null ? String(blog.readTime) : "5",
    views: blog?.views != null ? String(blog.views) : "0",
    sections: blog?.sections?.length
      ? blog.sections.map((section) => ({
          title: section.title || "",
          description: section.description || "",
          subpoints: toSubpointForm(section.subpoints),
          image: section.image || null,
          points: section.points?.length
            ? section.points.map((point) => ({
                title: point.title || "",
                description: point.description || "",
              }))
            : [emptyPoint()],
        }))
      : [emptySection()],
    faqs: toFaqForm(blog?.faqs),
    isPublished: Boolean(blog?.isPublished),
  };
}

export default function BlogForm({
  initialData,
  onSubmit,
  submitting = false,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<BlogFormState>(toFormState(initialData));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitMode, setSubmitMode] = useState<"default" | "publish">(
    "default"
  );
  const [activeSection, setActiveSection] = useState("blog-basic");

  const isEdit = useMemo(() => Boolean(initialData?._id), [initialData]);

  useEffect(() => {
    setForm(toFormState(initialData));
  }, [initialData]);

  const progressItems = useMemo(
    () => [
      {
        id: "blog-basic",
        label: "Basic Info",
        done: Boolean(form.title.trim()),
      },
      {
        id: "blog-intro",
        label: "Intro",
        done: Boolean(form.introTitle.trim() || form.introDescription.trim()),
      },
      {
        id: "blog-cover",
        label: "Cover Image",
        done: Boolean(form.coverImage?.url),
      },
      {
        id: "blog-sections",
        label: "Content Sections",
        done: form.sections.some(
          (section) =>
            section.title.trim() ||
            section.description.trim() ||
            section.subpoints.some(
              (subpoint) =>
                subpoint.subtitle.trim() || subpoint.subdescription.trim()
            ) ||
            section.points.some(
              (point) => point.title.trim() || point.description.trim()
            ) ||
            Boolean(section.image?.url)
        ),
      },
      {
        id: "blog-faqs",
        label: "FAQs",
        done: form.faqs.some((faq) => faq.question.trim() && faq.answer.trim()),
      },
      {
        id: "blog-publishing",
        label: "Publishing",
        done: form.isPublished,
      },
    ],
    [form]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

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

  async function uploadSingleImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    return apiFetch<{ success: boolean; data: IBlogImage }>(
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
      body: JSON.stringify({ public_id: publicId }),
      headers: {
        "Content-Type": "application/json",
      },
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

  function addFaq() {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  }

  function removeFaq(index: number) {
    setForm((prev) => ({
      ...prev,
      faqs:
        prev.faqs.length === 1
          ? [{ question: "", answer: "" }]
          : prev.faqs.filter((_, i) => i !== index),
    }));
  }

  function updateFaq(index: number, key: keyof BlogFaqForm, value: string) {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, emptySection()],
    }));
  }

  function removeSection(index: number) {
    setForm((prev) => ({
      ...prev,
      sections:
        prev.sections.length === 1
          ? [emptySection()]
          : prev.sections.filter((_, i) => i !== index),
    }));
  }

  function updateSection(
    index: number,
    key: "title" | "description",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addSubpoint(sectionIndex: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subpoints: [...section.subpoints, emptySubpoint()],
            }
          : section
      ),
    }));
  }

  function removeSubpoint(sectionIndex: number, subpointIndex: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subpoints:
                section.subpoints.length === 1
                  ? [emptySubpoint()]
                  : section.subpoints.filter((_, idx) => idx !== subpointIndex),
            }
          : section
      ),
    }));
  }

  function updateSubpoint(
    sectionIndex: number,
    subpointIndex: number,
    key: keyof BlogSectionSubpointForm,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              subpoints: section.subpoints.map((subpoint, idx) =>
                idx === subpointIndex
                  ? { ...subpoint, [key]: value }
                  : subpoint
              ),
            }
          : section
      ),
    }));
  }

  function addSectionPoint(sectionIndex: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              points: [...section.points, emptyPoint()],
            }
          : section
      ),
    }));
  }

  function removeSectionPoint(sectionIndex: number, pointIndex: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              points:
                section.points.length === 1
                  ? [emptyPoint()]
                  : section.points.filter((_, idx) => idx !== pointIndex),
            }
          : section
      ),
    }));
  }

  function updateSectionPoint(
    sectionIndex: number,
    pointIndex: number,
    key: keyof BlogSectionPointForm,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              points: section.points.map((point, idx) =>
                idx === pointIndex ? { ...point, [key]: value } : point
              ),
            }
          : section
      ),
    }));
  }

  async function handleSectionImageUpload(
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
        sections: prev.sections.map((section, i) =>
          i === index ? { ...section, image: res.data } : section
        ),
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to upload section image"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeSectionImage(index: number) {
    try {
      setUploading(true);
      setError("");

      const image = form.sections[index]?.image;
      if (image?.public_id) {
        await removeServerImage(image.public_id);
      }

      setForm((prev) => ({
        ...prev,
        sections: prev.sections.map((section, i) =>
          i === index ? { ...section, image: null } : section
        ),
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete section image"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");

      if (!form.title.trim()) {
        throw new Error("Title is required");
      }

      const payload: BlogSubmitPayload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim(),
        introTitle: form.introTitle.trim(),
        introDescription: form.introDescription.trim(),
        category: form.category.trim() || "General",
        tags: form.tagsText
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        coverImage: form.coverImage || null,
        authorName: form.authorName.trim(),
        location: form.location.trim(),
        readTime: Number(form.readTime) || 5,
        views: Number(form.views) || 0,
        sections: form.sections
          .filter(
            (section) =>
              section.title.trim() ||
              section.description.trim() ||
              section.subpoints.some(
                (subpoint) =>
                  subpoint.subtitle.trim() || subpoint.subdescription.trim()
              ) ||
              section.points.some(
                (point) => point.title.trim() || point.description.trim()
              ) ||
              Boolean(section.image?.url)
          )
          .map((section) => ({
            title: section.title.trim(),
            description: section.description.trim(),
            subpoints: section.subpoints
              .filter(
                (subpoint) =>
                  subpoint.subtitle.trim() || subpoint.subdescription.trim()
              )
              .map((subpoint) => ({
                subtitle: subpoint.subtitle.trim(),
                subdescription: subpoint.subdescription.trim(),
              })),
            image: section.image || null,
            points: section.points
              .filter((point) => point.title.trim() || point.description.trim())
              .map((point) => ({
                title: point.title.trim(),
                description: point.description.trim(),
              })),
          })),
        faqs: form.faqs
          .filter((faq) => faq.question.trim() && faq.answer.trim())
          .map((faq) => ({
            question: faq.question.trim(),
            answer: faq.answer.trim(),
          })),
        isPublished: submitMode === "publish" ? true : form.isPublished,
      };

      await onSubmit(payload);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save blog"));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="sticky top-4 z-30 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  ←
                </button>

                <div>
                  <p className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">
                    Blog Workspace
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {isEdit ? "Edit Blog" : "Create Blog"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage blog content, intro, sections, FAQs, and publishing.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/admin/blogs")}
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
                    ? "Update Blog"
                    : "Create Blog"}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <section
            id="blog-basic"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  placeholder="Blog title"
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
                  placeholder="blog-slug"
                />
              </Field>

              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="input"
                  placeholder="General"
                />
              </Field>

              <Field label="Tags (comma separated)">
                <input
                  value={form.tagsText}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tagsText: e.target.value }))
                  }
                  className="input"
                  placeholder="seo, marketing, technology"
                />
              </Field>

              <Field label="Author Name">
                <input
                  value={form.authorName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      authorName: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="Author name"
                />
              </Field>

              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="input"
                  placeholder="Chennai"
                />
              </Field>

              <Field label="Read Time">
                <input
                  type="number"
                  min="1"
                  value={form.readTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, readTime: e.target.value }))
                  }
                  className="input"
                  placeholder="5"
                />
              </Field>

              <Field label="Views">
                <input
                  type="number"
                  min="0"
                  value={form.views}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, views: e.target.value }))
                  }
                  className="input"
                  placeholder="0"
                />
              </Field>

              <Field label="Excerpt" full>
                <CompactRichTextEditor
                  value={form.excerpt}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, excerpt: value }))
                  }
                  placeholder="Short excerpt"
                  minHeight={110}
                />
              </Field>
            </div>
          </section>

          <section
            id="blog-intro"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Intro Section
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5">
              <Field label="Intro Title">
                <input
                  value={form.introTitle}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      introTitle: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="Artificial Intelligence - The Present"
                />
              </Field>

              <Field label="Intro Description">
                <CompactRichTextEditor
                  value={form.introDescription}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      introDescription: value,
                    }))
                  }
                  placeholder="Write the intro description..."
                  minHeight={120}
                />
              </Field>
            </div>
          </section>

          <section
            id="blog-cover"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Cover Image
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
              <div className="overflow-hidden rounded-2xl border bg-slate-50">
                {form.coverImage?.url ? (
                  <Image
                    src={form.coverImage.url}
                    alt={form.coverImage.alt || form.title || "Blog cover"}
                    className="h-56 w-full object-cover"
                    width={260}
                    height={224}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-500">
                    No image uploaded
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                  </label>

                  {form.coverImage ? (
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
                    placeholder="Cover image alt text"
                  />
                </Field>
              </div>
            </div>
          </section>

          <section
            id="blog-sections"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Content Sections
              </h3>
            </div>

            <div className="mt-5 space-y-6">
              {form.sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      Section {sectionIndex + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Section Title" full>
                      <input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(sectionIndex, "title", e.target.value)
                        }
                        className="input"
                        placeholder="Main content title"
                      />
                    </Field>

                    <Field label="Section Description" full>
                      <CompactRichTextEditor
                        value={section.description}
                        onChange={(value) =>
                          updateSection(sectionIndex, "description", value)
                        }
                        placeholder="Main section description"
                        minHeight={120}
                      />
                    </Field>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900">Subsections</h5>
                    </div>

                    <div className="space-y-4">
                      {section.subpoints.map((subpoint, subpointIndex) => (
                        <div
                          key={subpointIndex}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h6 className="text-sm font-semibold text-slate-900">
                              Subsection {subpointIndex + 1}
                            </h6>
                            <button
                              type="button"
                              onClick={() =>
                                removeSubpoint(sectionIndex, subpointIndex)
                              }
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <Field label="Subtitle">
                              <input
                                value={subpoint.subtitle}
                                onChange={(e) =>
                                  updateSubpoint(
                                    sectionIndex,
                                    subpointIndex,
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                                className="input"
                                placeholder="Subsection title"
                              />
                            </Field>

                            <Field label="Sub Description">
                              <CompactRichTextEditor
                                value={subpoint.subdescription}
                                onChange={(value) =>
                                  updateSubpoint(
                                    sectionIndex,
                                    subpointIndex,
                                    "subdescription",
                                    value
                                  )
                                }
                                placeholder="Subsection description"
                                minHeight={110}
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => addSubpoint(sectionIndex)}
                        className="rounded-xl bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-700"
                      >
                        + Add Subsection
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
                    <div className="overflow-hidden rounded-2xl border bg-slate-50">
                      {section.image?.url ? (
                        <Image
                          src={section.image.url}
                          alt={
                            section.image.alt ||
                            section.title ||
                            "Section image"
                          }
                          className="h-56 w-full object-cover"
                          width={260}
                          height={224}
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center text-sm text-slate-500">
                          No image uploaded
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                          {uploading ? "Uploading..." : "Upload Section Image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleSectionImageUpload(sectionIndex, e)
                            }
                          />
                        </label>

                        {section.image ? (
                          <button
                            type="button"
                            onClick={() => removeSectionImage(sectionIndex)}
                            className="rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Remove Image
                          </button>
                        ) : null}
                      </div>

                      <Field label="Image Alt Text">
                        <input
                          value={section.image?.alt || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              sections: prev.sections.map((item, i) =>
                                i === sectionIndex
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
                          placeholder="Section image alt text"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900">Points</h5>
                    </div>

                    <div className="space-y-4">
                      {section.points.map((point, pointIndex) => (
                        <div
                          key={pointIndex}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h6 className="text-sm font-semibold text-slate-900">
                              Point {pointIndex + 1}
                            </h6>
                            <button
                              type="button"
                              onClick={() =>
                                removeSectionPoint(sectionIndex, pointIndex)
                              }
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <Field label="Point Title">
                              <input
                                value={point.title}
                                onChange={(e) =>
                                  updateSectionPoint(
                                    sectionIndex,
                                    pointIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="input"
                                placeholder="Point title"
                              />
                            </Field>

                            <Field label="Point Description">
                              <CompactRichTextEditor
                                value={point.description}
                                onChange={(value) =>
                                  updateSectionPoint(
                                    sectionIndex,
                                    pointIndex,
                                    "description",
                                    value
                                  )
                                }
                                placeholder="Point description"
                                minHeight={110}
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => addSectionPoint(sectionIndex)}
                        className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                      >
                        + Add Point
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={addSection}
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  + Add Section
                </button>
              </div>
            </div>
          </section>

          <section
            id="blog-faqs"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">FAQs</h3>
            </div>

            <div className="mt-5 space-y-4">
              {form.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      FAQ {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Question">
                      <input
                        value={faq.question}
                        onChange={(e) =>
                          updateFaq(index, "question", e.target.value)
                        }
                        className="input"
                        placeholder="FAQ question"
                      />
                    </Field>

                    <Field label="Answer">
                      <CompactRichTextEditor
                        value={faq.answer}
                        onChange={(value) => updateFaq(index, "answer", value)}
                        placeholder="FAQ answer"
                        minHeight={110}
                      />
                    </Field>
                  </div>
                </div>
              ))}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={addFaq}
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  + Add FAQ
                </button>
              </div>
            </div>
          </section>

          <section
            id="blog-publishing"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Publishing
            </h3>

            <div className="mt-5">
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
                Publish Blog
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

        <div className="hidden xl:block">
          <BlogFormProgress
            items={progressItems}
            activeSection={activeSection}
          />
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