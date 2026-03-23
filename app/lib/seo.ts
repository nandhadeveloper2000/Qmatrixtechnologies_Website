import type { Metadata } from "next";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";

export const SITE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://qmatrixtechnologies-website.vercel.app";

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dfbbnzwmc/image/upload/f_auto,q_auto/v1/qmatrix/default-og.jpg";

export type SEORecord = {
  _id?: string;
  pageKey: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  schemaType?: "WebPage" | "Article" | "Course" | "FAQPage";
  createdAt?: string;
  updatedAt?: string;
};

export type BuiltSEO = {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  schemaType?: "WebPage" | "Article" | "Course" | "FAQPage";
};

type SEOResponse = {
  success: boolean;
  data?: SEORecord;
  message?: string;
};

type StaticSEOInput = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  ogImage?: string;
  robots?: string;
  schemaType?: "WebPage" | "Article" | "Course" | "FAQPage";
};

export const PAGE_SEO_FALLBACKS: Record<string, StaticSEOInput> = {
  home: {
    title: "Best Software Training Institute in Chennai | QMatrix Technologies",
    description:
      "QMatrix Technologies offers job-ready software training in Chennai with expert mentors, real-time projects, and placement support.",
    canonical: `${SITE_URL}/`,
    keywords: [
      "software training institute in chennai",
      "best IT training institute in chennai",
      "cloud computing course in chennai",
      "data engineering training in chennai",
      "qmatrix technologies",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    robots: "index,follow",
    schemaType: "WebPage",
  },
  about: {
    title: "About QMatrix Technologies",
    description:
      "Learn about QMatrix Technologies, our mission, expert mentors, placement-focused training model, and future-ready IT programs.",
    canonical: `${SITE_URL}/about`,
    keywords: [
      "about qmatrix technologies",
      "software institute in chennai",
      "IT training center in chennai",
      "placement support institute",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    robots: "index,follow",
    schemaType: "WebPage",
  },
  contact: {
    title: "Contact QMatrix Technologies | Chennai",
    description:
      "Contact QMatrix Technologies for course details, counseling, batch timings, fees, and placement support in Chennai.",
    canonical: `${SITE_URL}/contact`,
    keywords: [
      "contact qmatrix technologies",
      "course enquiry chennai",
      "IT training contact",
      "software institute contact chennai",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    robots: "index,follow",
    schemaType: "WebPage",
  },
  blogs: {
    title: "Blogs & Insights | QMatrix Technologies",
    description:
      "Explore premium blogs on career guidance, AI, cloud, development, and future-ready technologies.",
    canonical: `${SITE_URL}/blogs`,
    keywords: [
      "tech blog india",
      "IT career blog",
      "cloud computing blog",
      "data engineering blog",
      "software training blog",
      "qmatrix blog",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    robots: "index,follow",
    schemaType: "Article",
  },
  courses: {
    title: "Software Courses in Chennai | QMatrix Technologies",
    description:
      "Explore software training courses in Chennai with real-time projects, expert mentors, and placement support.",
    canonical: `${SITE_URL}/courses`,
    keywords: [
      "software courses in chennai",
      "IT courses in chennai",
      "best software training institute",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    robots: "index,follow",
    schemaType: "Course",
  },
};

export async function getPageSEO(pageKey: string): Promise<SEORecord | null> {
  try {
    const endpoint = SummaryApi.public_page_seo(pageKey);

    const res = await fetch(`${baseURL}${endpoint.url}`, {
      method: endpoint.method,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: SEOResponse = await res.json();
    return data.data || null;
  } catch (error) {
    console.error(`getPageSEO(${pageKey}) error:`, error);
    return null;
  }
}

export function normalizeDbSeo(
  dbSeo: SEORecord | null | undefined,
  pageKey: string
): BuiltSEO {
  const fallback = PAGE_SEO_FALLBACKS[pageKey] || {
    title: "QMatrix Technologies",
    description: "Premium IT training institute in Chennai.",
    canonical: SITE_URL,
    keywords: [],
    ogImage: DEFAULT_OG_IMAGE,
    robots: "index,follow",
    schemaType: "WebPage" as const,
  };

  return {
    title: dbSeo?.metaTitle || fallback.title,
    description: dbSeo?.metaDescription || fallback.description,
    canonical: dbSeo?.canonicalUrl || fallback.canonical,
    keywords:
      dbSeo?.keywords && dbSeo.keywords.length
        ? dbSeo.keywords
        : (fallback.keywords ?? []),
    ogTitle: dbSeo?.ogTitle || dbSeo?.metaTitle || fallback.title,
    ogDescription:
      dbSeo?.ogDescription || dbSeo?.metaDescription || fallback.description,
    ogImage: dbSeo?.ogImage || fallback.ogImage || DEFAULT_OG_IMAGE,
    robots: dbSeo?.robots || fallback.robots || "index,follow",
    schemaType: dbSeo?.schemaType || fallback.schemaType || "WebPage",
  };
}

export function buildStaticMetadata(
  dbSeo: SEORecord | null,
  fallback: StaticSEOInput
): Metadata {
  const normalized = normalizeDbSeo(dbSeo, "__custom__");

  const title = dbSeo?.metaTitle || fallback.title || normalized.title;
  const description =
    dbSeo?.metaDescription || fallback.description || normalized.description;
  const canonical = dbSeo?.canonicalUrl || fallback.canonical || normalized.canonical;
  const keywords =
    dbSeo?.keywords && dbSeo.keywords.length
      ? dbSeo.keywords
      : (fallback.keywords ?? normalized.keywords ?? []);
  const ogTitle = dbSeo?.ogTitle || title;
  const ogDescription = dbSeo?.ogDescription || description;
  const ogImage = dbSeo?.ogImage || fallback.ogImage || DEFAULT_OG_IMAGE;
  const robots = dbSeo?.robots || fallback.robots || "index,follow";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "QMatrix Technologies",
      type: "website",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export function imageToUrl(
  image?: string | { url?: string | null } | null
): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
}

export function buildJsonLd(
  pageKey: string,
  dbSeo: SEORecord | null,
  fallback?: StaticSEOInput
) {
  const normalized = fallback
    ? {
        title: dbSeo?.metaTitle || fallback.title,
        description: dbSeo?.metaDescription || fallback.description,
        canonical: dbSeo?.canonicalUrl || fallback.canonical,
        schemaType: dbSeo?.schemaType || fallback.schemaType || "WebPage",
      }
    : {
        title: dbSeo?.metaTitle || "QMatrix Technologies",
        description:
          dbSeo?.metaDescription || "Premium IT training institute in Chennai.",
        canonical: dbSeo?.canonicalUrl || SITE_URL,
        schemaType: dbSeo?.schemaType || "WebPage",
      };

  if (pageKey === "contact") {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: normalized.title,
      description: normalized.description,
      url: normalized.canonical,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": normalized.schemaType,
    name: normalized.title,
    description: normalized.description,
    url: normalized.canonical,
  };
}