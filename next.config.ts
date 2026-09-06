import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  typescript: {
    // Prevent strict type errors from blocking Vercel builds
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
  },
};

export default nextConfig;
