import CompanyLogos from "@/app/components/Home/Companylogos";
import CoursesSection from "@/app/components/Home/CoursesSection";
import TrainingMethodology from "@/app/components/Home/TrainingMethodology";
import WhySection from "@/app/components/Home/WhySection";
import Futureoftech from "@/app/components/Home/Futureoftech";
import InstagramFeed from "@/app/components/Home/InstagramFeed";
import HeroSection from "@/app/components/Home/HeroSection";
import Ctawrapper from "@/app/components/Home/Ctawrapper";
import FAQSection from "@/app/components/Home/FAQSection";
import Hero from "@/app/components/Home/Hero";
import GoogleReviews from "@/app/components/Home/GoogleReviews";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyLogos />
      <CoursesSection />
      <TrainingMethodology />
      <WhySection />
      <Futureoftech />
      <InstagramFeed />
      <HeroSection />
      <GoogleReviews />
      <Ctawrapper />
      <FAQSection />
    </>
  );
}