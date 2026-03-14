import { cldPublic } from "@/app/lib/cloudinary";

export type TrainingStep = {
  title: string;
  img: string; // ✅ Cloudinary URL
};

export const trainingSteps: TrainingStep[] = [
  { title: "Introduction",       img: cldPublic("/qmatrix/introduction.png",     "f_auto,q_auto,w_1000") },
  { title: "Regular Classes",    img: cldPublic("/qmatrix/regularclasses.png",   "f_auto,q_auto,w_1000") },
  { title: "Assignments",        img: cldPublic("/qmatrix/assignment.png",       "f_auto,q_auto,w_1000") },
  { title: "Live Projects",      img: cldPublic("/qmatrix/projectsection.png",   "f_auto,q_auto,w_1000") },
  { title: "Resume Preparation", img: cldPublic("/qmatrix/resumeprepare.png",    "f_auto,q_auto,w_1000") },
  { title: "Mock Interviews",    img: cldPublic("/qmatrix/mockinterview.png",    "f_auto,q_auto,w_1000") },
  { title: "Profile Marketing",  img: cldPublic("/qmatrix/resumemarketing.png",  "f_auto,q_auto,w_1000") },
  { title: "Placement Support",  img: cldPublic("/qmatrix/placement.png",        "f_auto,q_auto,w_1000") },
];

export const trainingAccents: string[] = [
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-fuchsia-600",
  "from-teal-500 to-cyan-600",
  "from-orange-500 to-amber-600",
];