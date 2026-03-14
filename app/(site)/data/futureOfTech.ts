import { LuUserCheck, LuHandshake, LuMonitor, LuSend } from "react-icons/lu";

export type FutureStep = {
  id: string;
  title: string;
  desc: string;
  Icon: React.ElementType;
  color: string;
};

export const futureSteps: FutureStep[] = [
  {
    id: "01",
    title: "Expert Mentorship",
    desc: "Learn from industry veterans with 10+ years of real-world experience in top MNCs.",
    Icon: LuUserCheck,
    color: "#F97316",
  },
  {
    id: "02",
    title: "Hands-on Projects",
    desc: "Move beyond theory with live capstone projects that mirror actual industry challenges.",
    Icon: LuHandshake,
    color: "#F59E0B",
  },
  {
    id: "03",
    title: "Flexible Learning",
    desc: "Choose between interactive online sessions or intensive classroom training in Chennai.",
    Icon: LuMonitor,
    color: "#10B981",
  },
  {
    id: "04",
    title: "Career Support",
    desc: "Comprehensive guidance from resume building to personalized mock interviews.",
    Icon: LuSend,
    color: "#8B5CF6",
  },
];