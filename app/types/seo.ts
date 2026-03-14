export type SeoImage = {
  url: string;
  public_id?: string | null;
  alt?: string;
};

export type PageSEO = {
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

export type PageSEOResponse = {
  success: boolean;
  message?: string;
  data: PageSEO;
};

export type PageSEOListResponse = {
  success: boolean;
  data: PageSEO[];
};