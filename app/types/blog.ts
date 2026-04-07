export type SeoRobots =
  | "index,follow"
  | "noindex,follow"
  | "index,nofollow"
  | "noindex,nofollow";

export type SeoSchemaType = "WebPage" | "Article" | "Course" | "FAQPage";

export interface IBlogImage {
  url: string;
  public_id?: string | null;
  alt?: string;
}

export interface IBlogPoint {
  title: string;
  description: string;
}

export interface IBlogSubpoint {
  subtitle: string;
  subdescription: string;
}

export interface IBlogSection {
  title: string;
  description: string;
  subpoints: IBlogSubpoint[];
  image?: IBlogImage | null;
  points: IBlogPoint[];
}

export interface IBlogFaq {
  question: string;
  answer: string;
}

export interface IBlogCreator {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IBlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: IBlogImage | null;
  robots?: SeoRobots;
  schemaType?: SeoSchemaType;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;

  introTitle?: string;
  introDescription?: string;

  category?: string;
  tags?: string[];

  coverImage?: IBlogImage | null;

  authorName?: string;
  location?: string;
  readTime?: number;
  views?: number;

  sections?: IBlogSection[];
  faqs?: IBlogFaq[];

  seo?: IBlogSEO;

  isPublished?: boolean;
  publishedAt?: string | null;

  createdBy?: IBlogCreator | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogsListResponse {
  success?: boolean;
  data?: IBlog[];
  blogs?: IBlog[];
}

export interface BlogSingleResponse {
  success?: boolean;
  data?: IBlog | null;
  blog?: IBlog | null;
}