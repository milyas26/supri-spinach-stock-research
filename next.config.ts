import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.stockbit.com",
        pathname: "/logos/companies/**",
      },
    ],
  },
};

export default nextConfig;
