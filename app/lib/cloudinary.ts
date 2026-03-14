export const CLOUDINARY_CLOUD_NAME = "dfbbnzwmc";
export const CLOUDINARY_BASE_FOLDER = "qmatrix";

export function   cldPublic(publicPath: string, transform = "f_auto,q_auto") {
  // "/Instagram/ROW_NUMBER.png" -> "Instagram/ROW_NUMBER"
  const clean = String(publicPath)
    .replace(/^\/+/, "")
    .replace(/\.[^/.]+$/, "");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${clean}`;
}