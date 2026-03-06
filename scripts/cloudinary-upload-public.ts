import path from "node:path";
import fs from "node:fs";
import fg from "fast-glob";

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, "__backup_cloudinary__");

const IMAGE_EXT = /\.(png|jpe?g|webp|svg|gif)$/i;

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function backupFile(fileAbs: string) {
  const rel = path.relative(ROOT, fileAbs);
  const dest = path.join(BACKUP_DIR, rel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(fileAbs, dest);
}

function fileWriteIfChanged(fileAbs: string, next: string, prev: string) {
  if (next !== prev) {
    backupFile(fileAbs);
    fs.writeFileSync(fileAbs, next, "utf8");
    console.log("✍️ updated:", path.relative(ROOT, fileAbs));
  }
}

function needsHelperImport(src: string) {
  return src.includes("cldPublic(") && !src.includes('from "@/app/lib/cloudinary"') && !src.includes("from '../lib/cloudinary'") && !src.includes("from \"../lib/cloudinary\"");
}

// Replace "/Folder/file.png" strings → cldPublic("/Folder/file.png", "f_auto,q_auto,w_900")
function replacePublicStringUrls(src: string) {
  return src.replace(
    /(["'`])\/([A-Za-z0-9_\-\/]+?\.(png|jpe?g|webp|svg|gif))\1/g,
    (_m, quote, filePathWithExt) => {
      const full = `/${filePathWithExt}`;
      // You can tune width per folder if you want:
      const w =
        full.startsWith("/Instagram/") ? "w_900" :
        full.startsWith("/Courses/") ? "w_1200" :
        "w_1000";

      return `{cldPublic("${full}", "f_auto,q_auto,${w}")}`;
    }
  );
}

// Convert common `import x from "@/public/....png"` into string URL constant usage
function replacePublicImports(src: string) {
  // collects: import name from "@/public/Path/file.png"
  const importRegex =
    /import\s+([A-Za-z0-9_]+)\s+from\s+["']@\/public\/([^"']+\.(?:png|jpe?g|webp|svg|gif))["'];?/g;

  const imports: Array<{ name: string; rel: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = importRegex.exec(src))) {
    imports.push({ name: m[1], rel: m[2] });
  }
  if (!imports.length) return src;

  // remove those imports
  let out = src.replace(importRegex, "");

  // remove `import type { StaticImageData } from "next/image";`
  out = out.replace(/import\s+type\s+\{\s*StaticImageData\s*\}\s+from\s+["']next\/image["'];?\s*\n?/g, "");

  // Replace usage `image: snowflake,` → `image: cldPublic("/Courses/snowflake.jpeg", "..."),`
  for (const imp of imports) {
    const publicPath = `/${imp.rel.replace(/\\/g, "/")}`;
    const w =
      publicPath.startsWith("/Instagram/") ? "w_900" :
      publicPath.startsWith("/Courses/") ? "w_1200" :
      "w_1000";

    // Replace all standalone references of the variable (best-effort)
    const ref = new RegExp(`\\b${imp.name}\\b`, "g");
    out = out.replace(ref, `cldPublic("${publicPath}", "f_auto,q_auto,${w}")`);
  }

  // If your Course type had `image: StaticImageData`, you must change to `image: string`
  // (Do this manually once in your type definition.)
  return out;
}

function addHelperImportIfNeeded(fileAbs: string, src: string) {
  if (!needsHelperImport(src)) return src;

  // place after "use client"; if present, else at top
  if (src.includes('"use client";')) {
    return src.replace(
      /"use client";\s*\n/,
      `"use client";\n\nimport { cldPublic } from "@/app/lib/cloudinary";\n`
    );
  }
  return `import { cldPublic } from "@/app/lib/cloudinary";\n${src}`;
}

async function main() {
  ensureDir(BACKUP_DIR);

  const files = await fg(["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"], {
    cwd: ROOT,
    absolute: true,
    dot: false,
  });

  for (const fileAbs of files) {
    const prev = fs.readFileSync(fileAbs, "utf8");
    let next = prev;

    next = replacePublicImports(next);
    next = replacePublicStringUrls(next);
    next = addHelperImportIfNeeded(fileAbs, next);

    fileWriteIfChanged(fileAbs, next, prev);
  }

  console.log("\n✅ Done. Backup created at:", path.relative(ROOT, BACKUP_DIR));
  console.log("⚠️ After conversion, update your types:");
  console.log("- Change image types from StaticImageData -> string where needed (coursesData, etc.)");
}

main();