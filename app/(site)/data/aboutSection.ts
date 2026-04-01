// app/data/aboutSection.ts
import type { LucideIcon } from "lucide-react";
import {
  Megaphone,
  UserCheck,
  ClipboardList,
  Briefcase,
  FileText,
  BadgeDollarSign,
  Award,
  MapPin,
  GraduationCap,
  MonitorSmartphone,
} from "lucide-react";

import { cldPublic } from "@/app/lib/cloudinary";

export type WhyItem = { icon: LucideIcon; text: string; href?: string };

export const WHY_ITEMS: WhyItem[] = [
  { icon: UserCheck, text: "Training by highly experienced and certified professionals" },
  { icon: ClipboardList, text: "Real-time project scenarios & certification help" },
  { icon: Briefcase, text: "Placement support for all courses" },
  { icon: FileText, text: "List of established & satisfied & students" },
  { icon: BadgeDollarSign, text: "Most competitive & affordable course fees" },
  { icon: MapPin, text: "Pallikaranai, Chennai" },
  { icon: GraduationCap, text: "1500+ Placements in 6 Years" },
  { icon: MonitorSmartphone, text: "Online & offline classes" },
];

// ✅ Cloudinary images for right collage
const img = (path: string) => cldPublic(path, "f_auto,q_auto,w_1200");

export const ABOUT_COLLAGE = {
  main: img("/qmatrix/officelocationimage.webp"),
  small1: img("/qmatrix/officelocationimage.webp"),
  small2: img("/qmatrix/officelocationimage.webp"),
};