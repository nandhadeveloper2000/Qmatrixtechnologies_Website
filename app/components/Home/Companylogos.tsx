// app/components/Home/Companylogos.tsx
import Image from "next/image";
import { cldPublic } from "@/app/lib/cloudinary";

const logos: string[] = [
  cldPublic("qmatrix/working/3i_infotech_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/accenture_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Capgemini_Logo..png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Citius_Tech_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/cognizant_logo.svg", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/deloitte_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/globtier_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/HCL_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/HD_Supply_Logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Hexaware_logo.webp", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/himflax_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Honeywell_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/ibm_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Infosys_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Lorven_Logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/ltimindtree_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Mastech_logo.jpeg", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/mphasis_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Niq_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/oracel_logo.jpeg", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/paypal_logo.webp", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/persistent_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/saama_logo.webp", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Tata_Consultancy_Services_old_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Tech_Mahindra.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Wipro_logo.png", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Yash_Technologies_logo.webp", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/Zensar_logo.jpeg", "f_auto,q_auto,w_1000"),
  cldPublic("qmatrix/working/ramco.png", "f_auto,q_auto,w_1000"),
];

export default function CompanyLogos() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-0 text-center text-4xl font-bold text-gray-900 md:text-4xl">
          Our Amazing <span className="text-secondary">Clients</span>
        </h2>

        <div className="relative mt-8 overflow-hidden">
          <div className="marquee-track flex gap-10 animate-marquee">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex h-24 w-44 shrink-0 items-center justify-center"
              >
                <Image
                  src={logo}
                  alt="company logo"
                  width={180}
                  height={80}
                  className="h-auto max-h-20 w-auto object-contain grayscale opacity-70 transition duration-500 ease-in-out hover:grayscale-0 hover:opacity-100"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}