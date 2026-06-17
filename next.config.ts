import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
  async rewrites() {
    // Serve the standalone report (public/task.html) at a clean /task URL.
    return [{ source: "/task", destination: "/task.html" }];
  },
};

export default nextConfig;
