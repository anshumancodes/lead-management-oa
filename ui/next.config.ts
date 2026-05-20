import type { NextConfig } from 'next';

const BACKEND_HOST = 'lead-management-oa.onrender.com';

const nextConfig: NextConfig = {
  // Allow images served from the Render backend
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: BACKEND_HOST,
      },
    ],
  },

  // Expose the backend URL to the browser bundle at build time
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ??
      `https://${BACKEND_HOST}/api/v1`,
  },
};

export default nextConfig;
