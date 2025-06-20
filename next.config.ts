import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Strict mode for better error catching
  reactStrictMode: true,
};

export default nextConfig;
