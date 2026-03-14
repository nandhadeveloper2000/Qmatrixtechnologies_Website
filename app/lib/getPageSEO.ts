export type PageSEO = {
  pageKey: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPageSEO(pageKey: string): Promise<PageSEO | null> {
  try {
    const res = await fetch(`${API_URL}/api/page-seo/public/${pageKey}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data.data || null;
  } catch {
    return null;
  }
}