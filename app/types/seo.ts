export type SeoSchemaType = "WebPage" | "Article" | "Course" | "FAQPage";

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
  schemaType?: SeoSchemaType;
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