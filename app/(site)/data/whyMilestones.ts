import type { ComponentType } from "react";
import {
  LuHandCoins,
  LuUserCheck,
  LuLaptop,
  LuBadgeCheck,
} from "react-icons/lu";

export type IconComponent = ComponentType<{ className?: string }>;

export type WhyMilestone = {
  id: string;
  title: string;
  desc: string;
  Icon: IconComponent;
  tone: string;
};

export const whyMilestones: WhyMilestone[] = [
  {
    id: "01",
    title: "100% Placement Assistance",
    desc: "Dedicated placement cell with strong industry connections to help you secure your dream job.",
    Icon: LuHandCoins,
    tone: "from-secondary to-primary",
  },
  {
    id: "02",
    title: "Industry-Expert Trainers",
    desc: "Learn from certified professionals with extensive real-world industry experience.",
    Icon: LuUserCheck,
    tone: "from-indigo-500 to-sky-500",
  },
  {
    id: "03",
    title: "Real-World Projects",
    desc: "Hands-on experience with industry-relevant projects to build a professional portfolio.",
    Icon: LuLaptop,
    tone: "from-teal-500 to-cyan-500",
  },
  {
    id: "04",
    title: "Job-ready Curriculum",
    desc: "Industry-aligned syllabus designed to make you confident for interviews and work.",
    Icon: LuBadgeCheck,
    tone: "from-fuchsia-500 to-pink-500",
  },
];