import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,

  async redirects() {
    return [
      // old wrong indexed URL
      {
        source: "/software-testing-training-in-chennai",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },

      // also redirect this URL if Google/user opens it
      {
        source: "/snowflake-training-in-chennai",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },

      // optional: trailing slash versions
      {
        source: "/software-testing-training-in-chennai/",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },
      {
        source: "/snowflake-training-in-chennai/",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },

      // www -> non-www
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
    ];
  },
};

export default nextConfig;