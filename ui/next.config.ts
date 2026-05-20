import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // required for Docker multi-stage build
  experimental: {
    // Opt out of CSS chunking for compatibility with tailwind v4
  },
};

export default nextConfig;
