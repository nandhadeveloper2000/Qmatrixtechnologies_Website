export type CourseCategory = "New One" | "Recommended" | "Most Placed";
export type CourseMode = "Online" | "Offline" | "Online/Offline";

export interface ICourseImage {
  url: string;
  public_id?: string | null;
  alt?: string;
}

export interface ICourseModule {
  title: string;
  topics: string[];
}

export interface ICourseTrainer {
  name: string;
  role?: string;
  bio?: string;
  experience?: string;
  linkedin?: string;
  image?: ICourseImage | null;
}

export interface ICourseReview {
  name: string;
  rating: number;
  comment: string;
  role?: string;
}

export interface ICourse {
  _id?: string;
  title: string;
  slug: string;
  category?: CourseCategory;

  shortDesc?: string;
  description?: string;
  overview?: string;

  coverImage?: ICourseImage | null;
  galleryImages?: ICourseImage[];

  duration?: string;
  modulesCount?: string;
  rating?: number;

  sessionDuration?: string;
  classSchedule?: string;
  mode?: CourseMode;
  enrolled?: string;
  batchSize?: string;
  admissionFee?: number | null;
  placementSupport?: boolean;

  features?: string[];
  support?: string[];
  curriculum?: ICourseModule[];
  trainers?: ICourseTrainer[];
  reviews?: ICourseReview[];

  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string | null;

  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}