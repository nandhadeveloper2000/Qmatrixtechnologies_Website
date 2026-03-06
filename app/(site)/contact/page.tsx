import ContactSections from "@/app/components/Contact/ContactSections";
import ContactBanner from "../../components/Contact/ContactBanner";
import OfficeLocations from "../../components/Contact/OfficeLocations";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactBanner />
      <ContactSections />
      <OfficeLocations />
    </main>
  );
}