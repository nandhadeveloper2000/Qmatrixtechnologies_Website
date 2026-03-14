import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import PlacementBanner from "@/app/components/Placements/PlacementBanner";
import PlacementHiring from "@/app/components/Placements/PlacementHiring";
import PlacementSection from "@/app/components/Placements/PlacementSection";
import PlacementsFaq from "@/app/components/Placements/PlacementsFaq";

export default function PlacementsPage() {
  return (
    <>
      <PlacementBanner />
      <PlacementSection />
      <PlacementHiring />
      <PlacementsFaq />
      <NewsletterCTA />
    </>
  );
}