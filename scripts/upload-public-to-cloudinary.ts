import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import path from "node:path";
import fg from "fast-glob";
import { v2 as cloudinary } from "cloudinary";

/* ---------- ENV ---------- */
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
const BASE = process.env.CLOUDINARY_BASE_FOLDER || "qmatrix";

console.log("CLOUD:", CLOUD);
console.log("KEY:", KEY ? "OK" : "MISSING");
console.log("SECRET:", SECRET ? "OK" : "MISSING");
console.log("BASE:", BASE);

if (!CLOUD || !KEY || !SECRET) {
  console.error("\n❌ Missing env values. Check .env.local in project root.\n");
  process.exit(1);
}

/* ---------- CLOUDINARY CONFIG ---------- */
cloudinary.config({
  cloud_name: CLOUD,
  api_key: KEY,
  api_secret: SECRET,
});

/* ---------- HELPERS ---------- */
const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]);

function toPosix(p: string) {
  return p.replace(/\\/g, "/");
}

function stripExt(file: string) {
  return file.replace(/\.[^/.]+$/, "");
}

/* ---------- MAIN ---------- */
async function main() {
  const publicDir = path.join(process.cwd(), "public");

  const files = await fg(["**/*.*"], {
    cwd: publicDir,
    onlyFiles: true,
    dot: false,
  });

  console.log(`\n📦 Found ${files.length} files in /public\n`);

  let uploaded = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED.has(ext)) continue;

    const absolutePath = path.resolve(publicDir, file);
    const relPosix = toPosix(file); // e.g. Instagram/ROW_NUMBER.png

    // ✅ Force folder structure to appear in Cloudinary UI:
    // folder = qmatrix
    // public_id = Instagram/ROW_NUMBER
    const publicId = stripExt(relPosix);

    try {
      const result = await cloudinary.uploader.upload(absolutePath, {
        folder: BASE,
        public_id: publicId,
        overwrite: true,
      });

      uploaded++;
      console.log("✅ Uploaded:", `${BASE}/${publicId}`, "->", result.secure_url);
    } catch (err: any) {
      console.error("❌ Error:", relPosix);
      console.error("   →", err?.message || err);
    }
  }

  console.log(`\n✅ Done. Uploaded ${uploaded} images.\n`);
}

main();