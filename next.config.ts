import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for puppeteer-core and @sparticuz/chromium in serverless
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium", "puppeteer"],

  // Allow images from any source (for uploaded deity images)
  images: {
    unoptimized: true,
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
