// app/page.tsx
import AboutBanner from "@/app/components/About/AboutBanner";
import AboutSections from "@/app/components/About/AboutSections";
import VisionMission from "@/app/components/About/VisionMission";
import QMatrixWayStats from "@/app/components/About/QMatrixWayStats";
import AlumniWorkSection from "../../components/About/AlumniWorkSection";
import WhyChooseSection from "../../components/About/WhyChooseSection";
import FloatingCertificateCard from "../../components/About/FloatingCertificateCard";

export default function AboutPage() {
  return <>
       <AboutBanner />
       <AboutSections />
       <WhyChooseSection />
       <FloatingCertificateCard />
       <QMatrixWayStats />
       <VisionMission />
       <AlumniWorkSection />
        </>;
}
