import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/camify-pages',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/camify-pages',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
