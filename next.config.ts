import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/camify-pages',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
