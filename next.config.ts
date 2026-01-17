import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Enable 'use cache' directive for caching across requests (Next.js 16+)
  cacheComponents: true,
};

export default nextConfig;
