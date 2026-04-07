import type { Metadata } from "next";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://qmatrixtechnologies.com";

export type SeoSchemaType = "WebPage" | "Article" | "Course" | "FAQPage";

export type PageSEO = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  schemaType?: SeoSchemaType;
};

export type FallbackSEO = {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  ogImage: string;
  robots: "index,follow" | "noindex,nofollow";
  schemaType: SeoSchemaType;
};

function cleanString(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function cleanArray(value?: string[] | null) {
  if (!Array.isArray(value)) return undefined;
  const arr = value.map((item) => item?.trim()).filter(Boolean) as string[];
  return arr.length ? arr : undefined;
}

function pick(value: string | undefined, fallback: string) {
  return value && value.trim() ? value.trim() : fallback;
}

function pickArray(value: string[] | undefined, fallback: string[]) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

function normalizeCanonical(url?: string) {
  const value = cleanString(url);
  if (!value) return undefined;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export async function getPageSEO(pageKey: string): Promise<PageSEO | null> {
  try {
    const url = `${baseURL}${SummaryApi.public_page_seo(pageKey).url}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `[SEO] Fetch failed for ${pageKey}: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const json = await res.json();
    const raw = json?.data ?? json;

    if (!raw || typeof raw !== "object") {
      console.error(`[SEO] Invalid response for ${pageKey}:`, json);
      return null;
    }

    return {
      metaTitle: cleanString(raw.metaTitle),
      metaDescription: cleanString(raw.metaDescription),
      keywords: cleanArray(raw.keywords),
      canonicalUrl: normalizeCanonical(raw.canonicalUrl),
      ogTitle: cleanString(raw.ogTitle),
      ogDescription: cleanString(raw.ogDescription),
      ogImage: cleanString(raw.ogImage),
      robots: cleanString(raw.robots),
      schemaType: raw.schemaType || undefined,
    };
  } catch (error) {
    console.error(`[SEO] getPageSEO(${pageKey}) failed:`, error);
    return null;
  }
}

export function buildStaticMetadata(
  seo: PageSEO | null,
  fallback: FallbackSEO
): Metadata {
  const title = pick(seo?.metaTitle, fallback.title);
  const description = pick(seo?.metaDescription, fallback.description);
  const canonical = pick(
    normalizeCanonical(seo?.canonicalUrl),
    normalizeCanonical(fallback.canonical) || fallback.canonical
  );
  const ogTitle = pick(seo?.ogTitle, title);
  const ogDescription = pick(seo?.ogDescription, description);
  const ogImage = pick(seo?.ogImage, fallback.ogImage);
  const robots = pick(seo?.robots, fallback.robots);
  const keywords = pickArray(seo?.keywords, fallback.keywords);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: robots.includes("index"),
      follow: robots.includes("follow"),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "Qmatrix Technologies",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export function buildJsonLd(
  _pageKey: string,
  seo: PageSEO | null,
  fallback: FallbackSEO
) {
  const title = pick(seo?.metaTitle, fallback.title);
  const description = pick(seo?.metaDescription, fallback.description);
  const canonical = pick(
    normalizeCanonical(seo?.canonicalUrl),
    normalizeCanonical(fallback.canonical) || fallback.canonical
  );
  const image = pick(seo?.ogImage, fallback.ogImage);
  const schemaType = seo?.schemaType || fallback.schemaType;

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    headline: title,
    description,
    url: canonical,
    image,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Organization",
      name: "Qmatrix Technologies",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}