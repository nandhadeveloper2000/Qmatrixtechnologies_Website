import type { Metadata } from "next";
import { getPageSEO } from "./getPageSEO";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://qmatrixtechnologies.com";

export async function generatePageMetadata(
  pageKey: string
): Promise<Metadata> {
  const seo = await getPageSEO(pageKey);

  return {
    title: seo?.metaTitle || "Qmatrix Technologies",
    description:
      seo?.metaDescription ||
      "Qmatrix Technologies - Best software training institute",
    keywords: seo?.keywords || [],

    alternates: {
      canonical: seo?.canonicalUrl || `${SITE_URL}/${pageKey}`,
    },

    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || "",
      description: seo?.ogDescription || seo?.metaDescription || "",
      url: seo?.canonicalUrl || `${SITE_URL}/${pageKey}`,
      siteName: "Qmatrix Technologies",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      type: "website",
    },

    robots: seo?.robots || "index,follow",
  };
}