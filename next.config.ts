import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — there is no server to maintain, and the whole site
  // can be hosted anywhere that serves files.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
