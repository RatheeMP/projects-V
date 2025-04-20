/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we handle URL construction properly during build
  output: 'standalone',
  // Disable image optimization during build to avoid URL issues
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
