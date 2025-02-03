import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (
    config,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    return config;
  },
};

export default nextConfig;
