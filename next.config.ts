import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPE_CHECK,
  },
};

export default nextConfig;
