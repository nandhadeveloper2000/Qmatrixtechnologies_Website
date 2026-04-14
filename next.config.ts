import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,

  async redirects() {
    return [
      // 1) Old course URL -> new course URL
      {
        source: "/software-testing-training-in-chennai",
        destination:
          "/course-detail/snowflake-data-engineering-training-chennai",
        permanent: true,
      },

      // 2) www -> non-www
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