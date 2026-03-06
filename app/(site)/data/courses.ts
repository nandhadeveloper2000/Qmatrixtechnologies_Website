import { cldPublic } from "@/app/lib/cloudinary";

/* ===========================
   CATEGORY FILTERS
=========================== */
export const categoryFilters = ["New One", "Recommended", "Most Placed"] as const;
export type CourseCategory = (typeof categoryFilters)[number];

/* ===========================
   COURSE TYPE
=========================== */
export type CourseCurriculumModule = {
  title: string;
  topics: string[];
};

export type Course = {
  path: string;
  title: string;

  // ✅ Cloudinary URL string
  image: string;

  modules: string;
  duration: string;
  rating: string;
  category: CourseCategory;

  description: string;
  shortDesc?: string;
  overview?: string;
  features?: string[];
  support?: string[];
  curriculum?: CourseCurriculumModule[];
};

/* ===========================
   COURSE DATA
=========================== */
export const coursesData: Course[] = [
  {
    path: "snowflake-data-engineering-training",
    title: "Snowflake Data Engineering",
    image: cldPublic("qmatrix/Courses/snowflake.jpeg", "f_auto,q_auto,w_1200"),
    modules: "10 Modules",
    duration: "6 Months",
    rating: "4.9",
    category: "Most Placed",
    shortDesc: "Snowflake data engineering with real-time projects & placement support.",
    description:
      "Master Snowflake data engineering with industry-focused curriculum covering SQL, pipelines, warehousing concepts, and real-time projects aligned with hiring needs.",
    overview:
      "This program focuses on building strong Snowflake fundamentals and practical data engineering skills with hands-on projects, real-world use cases, and interview preparation.",
    features: [
      "Snowflake architecture & best practices",
      "SQL + data modeling for analytics",
      "Data pipelines & transformations",
      "Real-time project implementation",
      "Interview + placement support",
    ],
    support: ["Mentor support", "Placement assistance", "Mock interviews", "Doubt sessions"],
    curriculum: [
      {
        title: "Module 1: Snowflake Foundations",
        topics: ["Architecture overview", "Warehouses & databases", "Storage & compute", "Cost optimization"],
      },
      {
        title: "Module 2: SQL & Data Modeling",
        topics: ["Advanced SQL", "Schema design", "Views & materialized views", "Performance tuning"],
      },
    ],
  },

  {
    path: "aws-cloud-training",
    title: "AWS Cloud Expert",
    image: cldPublic("qmatrix/Courses/aws.webp", "f_auto,q_auto,w_1200"),
    modules: "12 Modules",
    duration: "5 Months",
    rating: "4.8",
    category: "Recommended",
    shortDesc: "AWS fundamentals to advanced with projects + interview support.",
    description:
      "Learn AWS from core services to deployment patterns with hands-on projects, best practices, and strong interview preparation aligned to real job roles.",
    overview:
      "This AWS track helps you master cloud fundamentals, architecture, and deployment workflows using real scenarios and project builds.",
    features: [
      "EC2, S3, IAM, VPC mastery",
      "Serverless + container basics",
      "Deployment + monitoring patterns",
      "Project-based learning",
      "Career support + mock interviews",
    ],
    support: ["Mentor support", "Placement assistance", "Mock interviews", "Doubt sessions"],
    curriculum: [
      {
        title: "Module 1: AWS Core",
        topics: ["IAM basics", "EC2 & security groups", "S3 + lifecycle", "CloudWatch basics"],
      },
      {
        title: "Module 2: Networking",
        topics: ["VPC design", "Subnets", "Route tables", "NAT / Internet gateway"],
      },
    ],
  },

  {
    path: "databricks-ml-ai-training",
    title: "Databricks AI & ML",
    image: cldPublic("qmatrix/Courses/databricks.webp", "f_auto,q_auto,w_1200"),
    modules: "9 Modules",
    duration: "6 Months",
    rating: "4.95",
    category: "New One",
    shortDesc: "Databricks + ML workflows with real projects & portfolio building.",
    description:
      "Become confident with Databricks, Spark workflows, and machine learning pipelines with hands-on projects and real-time training.",
    overview:
      "Learn how to process data at scale using Databricks + Spark, then build ML workflows and deployable solutions.",
    features: [
      "Databricks platform fundamentals",
      "Spark + distributed processing",
      "ML pipelines and tracking basics",
      "Project-based portfolio",
      "Interview + career support",
    ],
    support: ["Mentor support", "Placement assistance", "Mock interviews", "Doubt sessions"],
    curriculum: [
      { title: "Module 1: Databricks Fundamentals", topics: ["Workspace", "Clusters", "Notebooks", "Jobs & scheduling"] },
      { title: "Module 2: Spark Essentials", topics: ["RDD vs DataFrames", "Transformations", "Actions", "Optimizations"] },
    ],
  },

  {
    path: "microsoft-azure-training",
    title: "Microsoft Azure Pro",
    image: cldPublic("qmatrix/Courses/microsoftazure.jpeg", "f_auto,q_auto,w_1200"),
    modules: "8 Modules",
    duration: "4 Months",
    rating: "4.7",
    category: "New One",
    shortDesc: "Azure cloud fundamentals to deployment, with practical labs.",
    description:
      "Build Azure fundamentals and deployment skills with hands-on labs on compute, storage, networking, and security.",
    overview:
      "This program helps you become job-ready by covering key Azure services and deployment workflows commonly used in real projects.",
    features: [
      "Azure compute + storage services",
      "Networking basics",
      "IAM + security principles",
      "Deployment patterns",
      "Interview + career support",
    ],
    support: ["Mentor support", "Placement assistance", "Mock interviews", "Doubt sessions"],
    curriculum: [
      { title: "Module 1: Azure Basics", topics: ["Subscriptions", "Resource groups", "VM basics", "Storage accounts"] },
      { title: "Module 2: Deployments", topics: ["App Service intro", "Monitoring overview", "CI/CD concepts", "Best practices"] },
    ],
  },

  {
    path: "google-cloud-training",
    title: "Google Cloud Platform",
    image: cldPublic("qmatrix/Courses/gcp.jpeg", "f_auto,q_auto,w_1200"),
    modules: "11 Modules",
    duration: "5 Months",
    rating: "4.85",
    category: "New One",
    shortDesc: "Practical GCP training with labs, deployments, and career support.",
    description:
      "Master GCP essentials with real-world labs on compute, storage, networking, IAM security, and modern deployment patterns.",
  },

  {
    path: "oracle-database-training",
    title: "Oracle Database Master",
    image: cldPublic("qmatrix/Courses/oracle.webp", "f_auto,q_auto,w_1200"),
    modules: "7 Modules",
    duration: "4 Months",
    rating: "4.6",
    category: "Recommended",
    shortDesc: "Oracle SQL + database fundamentals with interview preparation.",
    description:
      "Learn Oracle database fundamentals, SQL mastery, and practical database handling with structured modules and interview support.",
  },
];

/* ===========================
   FILTERS
=========================== */
export const filters = ["All Courses", ...categoryFilters] as const;
export type Filter = (typeof filters)[number];

/* ===========================
   HELPERS
=========================== */
export function getCourseBySlug(slug: string) {
  const key = String(slug || "").trim().toLowerCase();
  return coursesData.find((c) => c.path.toLowerCase() === key);
}