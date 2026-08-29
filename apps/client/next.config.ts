import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kings-of-cars/constants'],
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
}

export default nextConfig
