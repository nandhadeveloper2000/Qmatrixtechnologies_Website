import NewsletterCTA from "@/app/components/Blogs/NewsletterCTA";
import GoogleReviews from "@/app/components/Home/GoogleReviews";
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
      <GoogleReviews />
      <PlacementsFaq />
      <NewsletterCTA />
    </>
  );
}