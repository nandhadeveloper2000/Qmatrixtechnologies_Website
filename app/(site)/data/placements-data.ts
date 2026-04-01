import { cldPublic } from "@/app/lib/cloudinary";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

export type LogoItem = {
  name: string;
  src: string;
  kind?: "svg" | "image";
};

export type HighlightItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ProcessStepItem = {
  step: string;
  title: string;
  description: string;
};

export type StatItem = {
  label: string;
  value: string;
};

const img = (path: string) => cldPublic(path, "f_auto,q_auto,w_600");

export const placementHighlights: HighlightItem[] = [
  {
    icon: GraduationCap,
    title: "Industry-Ready Training",
    description:
      "Practical, job-oriented learning with updated syllabus, live sessions, and mentor support.",
  },
  {
    icon: FileText,
    title: "Resume & Profile Building",
    description:
      "Professional resume preparation, LinkedIn optimization, and portfolio guidance for better visibility.",
  },
  {
    icon: Users,
    title: "Mock Interviews",
    description:
      "Technical and HR mock interviews designed to improve communication, confidence, and real interview performance.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Placement Assistance",
    description:
      "Dedicated support for job applications, company referrals, interview scheduling, and career guidance.",
  },
];

export const placementProcessSteps: ProcessStepItem[] = [
  {
    step: "01",
    title: "Enroll in the Right Program",
    description:
      "Choose a career-focused course aligned with your goals and current skill level.",
  },
  {
    step: "02",
    title: "Build Real Skills",
    description:
      "Learn from experts through practical sessions, assignments, and project-based training.",
  },
  {
    step: "03",
    title: "Prepare for Interviews",
    description:
      "Sharpen your technical fundamentals with mock interviews, aptitude support, and HR preparation.",
  },
  {
    step: "04",
    title: "Attend Placement Drives",
    description:
      "Get access to hiring opportunities, interview alerts, and continuous placement support.",
  },
];

export const placementStats: StatItem[] = [
  { label: "Students Mentored", value: "500+" },
  { label: "Career Guidance Support", value: "100%" },
  { label: "Mock Interview Sessions", value: "50+" },
  { label: "Hands-on Projects", value: "Real-Time" },
];

export const placementLogos: LogoItem[] = [
 { name: "TCS", src: img("qmatrix/working/Tata_Consultancy_Services_old_logo.png") },
  { name: "HCL", src: img("qmatrix/working/HCL_logo.png") },
  { name: "Infosys", src: img("qmatrix/working/Infosys_logo.png") },
  { name: "IBM", src: img("qmatrix/working/ibm_logo.png") },
  { name: "Tech Mahindra", src: img("qmatrix/working/Tech_Mahindra.png") },
  { name: "Accenture", src: img("qmatrix/working/accenture_logo.png") },
  { name: "Deloitte", src: img("qmatrix/working/deloitte_logo.png") },
  { name: "Capgemini", src: img("qmatrix/working/Capgemini_Logo..png") },
  { name: "LTIMindtree", src: img("qmatrix/working/ltimindtree_logo.png") },
  { name: "Wipro", src: img("qmatrix/working/Wipro_logo.png") },
  { name: "Cognizant", src: img("qmatrix/working/cognizant_logo.svg"), kind: "svg" },
  { name: "CitiusTech", src: img("qmatrix/working/Citius_Tech_logo.png") },
  { name: "Globtier", src: img("qmatrix/working/globtier_logo.png") },
  { name: "HD Supply", src: img("qmatrix/working/HD_Supply_Logo.png") },
  { name: "Hexaware", src: img("qmatrix/working/Hexaware_logo.webp") },
  { name: "Honeywell", src: img("qmatrix/working/Honeywell_logo.png") },
  { name: "Mphasis", src: img("qmatrix/working/mphasis_logo.png") },
  { name: "Persistent", src: img("qmatrix/working/persistent_logo.png") },
  { name: "Saama", src: img("qmatrix/working/saama_logo.webp") },
  { name: "Mastech", src: img("qmatrix/working/Mastech_logo.jpeg") },
  { name: "3i Infotech", src: img("qmatrix/working/3i_infotech_logo.png") },
  { name: "NIQ", src: img("qmatrix/working/Niq_logo.png") },
  { name: "Oracle", src: img("qmatrix/working/oracel_logo.jpeg") },
  { name: "Lorven", src: img("qmatrix/working/Lorven_Logo.png") },
  { name: "Ramco", src: img("qmatrix/working/ramco.png") },
  { name: "Himflax", src: img("qmatrix/working/himflax_logo.png") },
  { name: "Yash Technologies", src: img("qmatrix/working/Yash_Technologies_logo.webp") },
  { name: "Zensar", src: img("qmatrix/working/Zensar_logo.jpeg") },
];