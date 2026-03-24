export type MongoIdLike = string | { $oid?: string };

export type MongoDateLike = string | { $date?: string };

export type BlogImage = {
  url: string;
  public_id?: string | null;
  alt?: string;
};

export type BlogSeo = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: BlogImage | null;
  robots?: string;
};

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
  seo?: BlogSeo;
  isPublished?: boolean;
  publishedAt?: MongoDateLike | null;
  createdAt?: MongoDateLike;
  updatedAt?: MongoDateLike;
};

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