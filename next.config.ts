import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      // -------------------------------
      // www -> non-www
      // -------------------------------
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.qmatrixtechnologies.com",
          },
        ],
        destination: "https://qmatrixtechnologies.com/:path*",
        permanent: true,
      },

      // -------------------------------
      // Old wrong indexed URLs -> correct pages
      // -------------------------------

      // Software Testing old URL -> Snowflake course detail
      {
        source: "/software-testing-training-in-chennai",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },

      // Snowflake short old URL -> Snowflake course detail
      {
        source: "/snowflake-training-in-chennai",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },

      // Data Analytics old URL -> Data Analyst Master Program detail
      {
        source: "/data-analytics-course-in-chennai",
        destination: "/course-detail/data-analyst-master-program-chennai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;