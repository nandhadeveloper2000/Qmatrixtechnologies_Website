import Navbar from "@/app/components/Main/Navbar";
import Footer from "@/app/components/Main/Footer";
import FloatingContact from "@/app/components/common/FloatingContact";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <FloatingContact />
      <Footer />
    </>
  );
}