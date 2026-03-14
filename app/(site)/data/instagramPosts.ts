// app/data/instagramPosts.ts
import { cldPublic } from "@/app/lib/cloudinary";

export type InstagramPost = {
  image: string;
  link: string;
};

export const instagramPosts: InstagramPost[] = [
  {
    image: cldPublic("qmatrix/Instagram/cloud_career_time_line.png", "f_auto,q_auto,w_900"),
    link: "https://www.instagram.com/qmatrixtech/",
  },
  {
    image: cldPublic("qmatrix/Instagram/CTE_vs_Subquery.png", "f_auto,q_auto,w_900"),
    link: "https://www.instagram.com/qmatrixtech/",
  },
  {
    image: cldPublic("qmatrix/Instagram/Internal_Stage_In_Snowflake.png", "f_auto,q_auto,w_900"),
    link: "https://www.instagram.com/qmatrixtech/",
  },
  {
    image: cldPublic("qmatrix/Instagram/Materialized_View.png", "f_auto,q_auto,w_900"),
    link: "https://www.instagram.com/qmatrixtech/",
  },
  {
    image: cldPublic("qmatrix/Instagram/ROW_NUMBER.png", "f_auto,q_auto,w_900"),
    link: "https://www.instagram.com/qmatrixtech/",
  },
  {
    image: cldPublic("qmatrix/Instagram/SQL_Execution_Order.png", "f_auto,q_auto,w_900"),
    link: "https://www.instagram.com/qmatrixtech/",
  },
  {
    image: cldPublic(
      "qmatrix/Instagram/Traditional_Data_Ware_House_vd_Snowflake.png",
      "f_auto,q_auto,w_900"
    ),
    link: "https://www.instagram.com/qmatrixtech/",
  },
];