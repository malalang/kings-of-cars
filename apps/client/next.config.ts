import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kings-of-cars/contracts", "@kings-of-cars/supabase"],
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

export default nextConfig;
