"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import SummaryApi from "@/app/constants/SummaryApi";
import { apiFetch } from "@/app/lib/apiFetch";
import type { PageSEO, PageSEOResponse } from "@/app/types/seo";

type Props = {
  pageKey: string;
  pageTitle?: string;
  pageDescription?: string;
};

type FormState = {
  metaTitle: string;
  metaDescription: string;
  keywordsText: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  schemaType: "WebPage" | "Article" | "Course" | "FAQPage";
};

function getFallbackCanonical(pageKey: string) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://qmatrixtechnologies.com";

  if (pageKey === "home") return siteUrl;
  return `${siteUrl}/${pageKey}`;
}

function toFormState(pageKey: string, seo?: PageSEO | null): FormState {
  return {
    metaTitle: seo?.metaTitle || "",
    metaDescription: seo?.metaDescription || "",
    keywordsText: (seo?.keywords || []).join(", "),
    canonicalUrl: seo?.canonicalUrl || getFallbackCanonical(pageKey),
    ogTitle: seo?.ogTitle || "",
    ogDescription: seo?.ogDescription || "",
    ogImage: seo?.ogImage || "",
    robots: seo?.robots || "index,follow",
    schemaType: seo?.schemaType || "WebPage",
  };
}

function getErrorMessage(err: unknown, fallback = "Something went wrong") {
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

export default function SEOEditorForm({
  pageKey,
  pageTitle,
  pageDescription,
}: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(pageKey, null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewKeywords = useMemo(
    () =>
      form.keywordsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.keywordsText]
  );

  useEffect(() => {
    let ignore = false;

    async function loadSEO() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const endpoint = SummaryApi.admin_page_seo_by_key(pageKey);

        const res = await apiFetch<PageSEOResponse>(endpoint.url, {
          method: endpoint.method,
        });

        if (!ignore) {
          setForm(toFormState(pageKey, res?.data || null));
        }
      } catch {
        if (!ignore) {
          setForm(toFormState(pageKey, null));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSEO();

    return () => {
      ignore = true;
    };
  }, [pageKey]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.metaTitle.trim()) {
        throw new Error("Meta title is required");
      }

      if (!form.metaDescription.trim()) {
        throw new Error("Meta description is required");
      }

      if (!form.canonicalUrl.trim()) {
        throw new Error("Canonical URL is required");
      }

      const endpoint = SummaryApi.admin_page_seo_upsert(pageKey);

      await apiFetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metaTitle: form.metaTitle.trim(),
          metaDescription: form.metaDescription.trim(),
          keywords: form.keywordsText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          canonicalUrl: form.canonicalUrl.trim(),
          ogTitle: form.ogTitle.trim(),
          ogDescription: form.ogDescription.trim(),
          ogImage: form.ogImage.trim(),
          robots: form.robots.trim() || "index,follow",
          schemaType: form.schemaType,
        }),
      });

      setSuccess("SEO saved successfully");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save SEO"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            SEO Manager
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {pageTitle || `Edit SEO: ${pageKey}`}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {pageDescription ||
              "Manage metadata, Open Graph, robots, and schema configuration for this page."}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading SEO data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          SEO Manager
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {pageTitle || `Edit SEO: ${pageKey}`}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {pageDescription ||
            "Manage metadata, Open Graph, robots, and schema configuration for this page."}
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Meta Title
              </label>
              <input
                value={form.metaTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                className="input"
                placeholder="Page meta title"
              />
              <p className="mt-1 text-xs text-slate-500">
                Recommended: up to 60–70 characters
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Meta Description
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                className="textarea"
                placeholder="Page meta description"
              />
              <p className="mt-1 text-xs text-slate-500">
                Recommended: up to 150–170 characters
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Keywords
              </label>
              <input
                value={form.keywordsText}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, keywordsText: e.target.value }))
                }
                className="input"
                placeholder="seo, training institute, cloud, data engineering"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Canonical URL
              </label>
              <input
                value={form.canonicalUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, canonicalUrl: e.target.value }))
                }
                className="input"
                placeholder="https://qmatrixtechnologies.com/page"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Open Graph Title
              </label>
              <input
                value={form.ogTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ogTitle: e.target.value }))
                }
                className="input"
                placeholder="Social share title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Open Graph Description
              </label>
              <textarea
                value={form.ogDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    ogDescription: e.target.value,
                  }))
                }
                className="textarea"
                placeholder="Social share description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                OG Image URL
              </label>
              <input
                value={form.ogImage}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ogImage: e.target.value }))
                }
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Robots
              </label>
              <select
                value={form.robots}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, robots: e.target.value }))
                }
                className="input"
              >
                <option value="index,follow">index,follow</option>
                <option value="noindex,follow">noindex,follow</option>
                <option value="index,nofollow">index,nofollow</option>
                <option value="noindex,nofollow">noindex,nofollow</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Schema Type
              </label>
              <select
                value={form.schemaType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    schemaType: e.target.value as FormState["schemaType"],
                  }))
                }
                className="input"
              >
                <option value="WebPage">WebPage</option>
                <option value="Article">Article</option>
                <option value="Course">Course</option>
                <option value="FAQPage">FAQPage</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save SEO"}
            </button>
          </div>

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
              min-height: 140px;
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
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Live Preview</h3>

          <p className="mt-3 text-sm text-slate-500">
            {form.metaTitle || "Meta title preview"}
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-green-700">
              {form.canonicalUrl || getFallbackCanonical(pageKey)}
            </p>

            <h4 className="mt-2 text-2xl text-blue-700">
              {form.metaTitle || "Page title preview"}
            </h4>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {form.metaDescription || "Meta description preview"}
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900">Keywords</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {previewKeywords.length ? (
                previewKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No keywords added yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900">OG Image</h4>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {form.ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.ogImage}
                  alt="OG Preview"
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-32 items-center justify-center text-sm text-slate-500">
                  No OG image
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}