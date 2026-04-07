export type MongoIdLike = string | { $oid?: string };
export type MongoDateLike = string | { $date?: string };

/* =========================
   IMAGE TYPE
========================= */
export type BlogImage = {
  url: string;
  public_id?: string | null;
  alt?: string;
};

/* =========================
   COMMON SEO TYPE (REUSABLE)
========================= */
export type SeoSchemaType = "WebPage" | "Article" | "Course" | "FAQPage";

export type SEO = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: BlogImage | null;

  robots?: string;

  /* ✅ IMPORTANT (missing in your model) */
  schemaType?: SeoSchemaType;
};

/* =========================
   BLOG TYPES
========================= */
export type BlogSectionPoint = {
  title?: string;
  description?: string;
};

export type BlogSectionSubpoint = {
  subtitle?: string;
  subdescription?: string;
};

export type BlogSection = {
  title: string;
  description: string;
  image?: BlogImage | null;
  points?: BlogSectionPoint[];
  subpoints?: BlogSectionSubpoint[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type Blog = {
  _id?: MongoIdLike;
  title: string;
  slug: string;

  excerpt?: string;
  introTitle?: string;
  introDescription?: string;

  category?: string;
  tags?: string[];

  coverImage?: BlogImage | null;

  authorName?: string;
  location?: string;
  readTime?: number;
  views?: number;

  sections?: BlogSection[];
  faqs?: BlogFaq[];

  seo?: SEO; // ✅ unified SEO

  isPublished?: boolean;
  publishedAt?: MongoDateLike | null;
  createdAt?: MongoDateLike;
  updatedAt?: MongoDateLike;
};

/* =========================
   PAGE SEO MODEL (NEW)
========================= */
export type PageSEO = {
  _id?: MongoIdLike;

  /* UNIQUE KEY like: home, about, contact */
  pageKey: string;

  title?: string;
  description?: string;

  seo?: SEO; // reuse same structure

  createdAt?: MongoDateLike;
  updatedAt?: MongoDateLike;
};

/* =========================
   API RESPONSES
========================= */
export type BlogResponse = {
  success?: boolean;
  blog?: Blog;
  data?: Blog;
  message?: string;
};

export type BlogsResponse = {
  success?: boolean;
  blogs?: Blog[];
  data?: Blog[];
  message?: string;
};

export type PageSEOResponse = {
  success?: boolean;
  data?: PageSEO;
  message?: string;
};