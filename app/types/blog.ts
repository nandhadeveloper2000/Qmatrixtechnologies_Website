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
  name?: string;
  role?: string;
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

  isPublished?: boolean;
  publishedAt?: string | null;

  createdBy?: IBlogCreator | string | null;
  createdAt?: string;
  updatedAt?: string;
}