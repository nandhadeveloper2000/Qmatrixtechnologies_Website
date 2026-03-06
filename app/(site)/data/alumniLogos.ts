// app/data/alumniLogos.ts
import { cldPublic } from "@/app/lib/cloudinary";

export type LogoKind = "svg" | "img";

export type LogoItem = {
  name: string;
  src: string; // ✅ keep as string URL
  kind?: LogoKind;
};

// ✅ helper to keep code short
const img = (path: string) => cldPublic(path, "f_auto,q_auto,w_600");

// ✅ public/working/... in Cloudinary base folder must match your uploader structure
export const ALUMNI_BG = img("qmatrix/it-training-institute-background.png");
export const ALUMNI_PERSON = img("qmatrix/Alumni_Image.webp");

export const LOGOS: LogoItem[] = [
  { name: "TCS", src: img("qmatrix/working/Tata_Consultancy_Services_old_logo.png") },
  { name: "HCL", src: img("qmatrix/working/HCL_logo.png") },
  { name: "Infosys", src: img("qmatrix/working/Infosys_logo.png") },
  { name: "IBM", src: img("qmatrix/working/ibm_logo.png") },
  { name: "Tech Mahindra", src: img("qmatrix/working/Tech_Mahindra.png") },
  { name: "PayPal", src: img("qmatrix/working/paypal_logo.webp") },
  { name: "Accenture", src: img("qmatrix/working/accenture_logo.png") },
  { name: "Deloitte", src: img("qmatrix/working/deloitte_logo.png") },
  { name: "Capgemini", src: img("qmatrix/working/Capgemini_Logo..png") },
  { name: "LTIMindtree", src: img("qmatrix/working/ltimindtree_logo.png") },
  { name: "Wipro", src: img("qmatrix/working/Wipro_logo.png") },
  { name: "Cognizant", src: img("qmatrix/working/cognizant_logo.svg"), kind: "svg" },
  { name: "CitiusTech", src: img("qmatrix/working/Citius_Tech_logo.png") },
  { name: "Globtier", src: img("qmatrix/working/globtier_logo.png") },
  { name: "HD Supply", src: img("qmatrix/working/HD_Supply_Logo.png") },
  { name: "Hexaware", src: img("qmatrix/working/Hexaware_logo.webp") },
  { name: "Honeywell", src: img("qmatrix/working/Honeywell_logo.png") },
  { name: "Mphasis", src: img("qmatrix/working/mphasis_logo.png") },
  { name: "Persistent", src: img("qmatrix/working/persistent_logo.png") },
  { name: "Saama", src: img("qmatrix/working/saama_logo.webp") },
  { name: "Mastech", src: img("qmatrix/working/Mastech_logo.jpeg") },
  { name: "3i Infotech", src: img("qmatrix/working/3i_infotech_logo.png") },
  { name: "NIQ", src: img("qmatrix/working/Niq_logo.png") },
  { name: "Oracle", src: img("qmatrix/working/oracel_logo.jpeg") },
  { name: "Lorven", src: img("qmatrix/working/Lorven_Logo.png") },
  { name: "Ramco", src: img("qmatrix/working/ramco.png") },
  { name: "Himflax", src: img("qmatrix/working/himflax_logo.png") },
  { name: "Yash Technologies", src: img("qmatrix/working/Yash_Technologies_logo.webp") },
  { name: "Zensar", src: img("qmatrix/working/Zensar_logo.jpeg") },
];