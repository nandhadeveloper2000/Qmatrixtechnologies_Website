export type CourseCategory = "New One" | "Recommended" | "Most Placed";
export type CourseMode = "Online" | "Offline" | "Online/Offline";

export type SeoRobots =
  | "index,follow"
  | "noindex,follow"
  | "index,nofollow"
  | "noindex,nofollow";

export type SeoSchemaType = "Course";

export interface CourseImage {
  url: string;
  public_id?: string | null;
  alt?: string;
}

export interface CourseFeature {
  title: string;
  description: string;
}

export interface CourseModule {
  title: string;
  topics: string[];
}

export interface CourseInterviewQuestion {
  question: string;
  answer: string;
}

export interface CourseFaq {
  question: string;
  answer: string;
}

export interface CourseCreator {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface CourseSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: CourseImage | null;
  robots?: SeoRobots;
  schemaType?: SeoSchemaType;
}

export interface Course {
  _id?: string;
  title: string;
  slug: string;
  category?: CourseCategory;

  shortDesc?: string;
  description?: string;

  coverImage?: CourseImage | null;
  galleryImages?: CourseImage[];

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

  whatYouWillLearn?: string[];
  features?: CourseFeature[];
  supportAndCareer?: string[];
  curriculum?: CourseModule[];
  interviewQuestions?: CourseInterviewQuestion[];
  faq?: CourseFaq[];

  seo?: CourseSEO;

  isFeatured?: boolean;
  isPublished?: boolean;

  createdBy?: CourseCreator | string | null;
  updatedBy?: CourseCreator | string | null;

  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoursesListResponse {
  success?: boolean;
  data?: Course[];
  courses?: Course[];
}

export interface CourseSingleResponse {
  success?: boolean;
  data?: Course | null;
  course?: Course | null;
}