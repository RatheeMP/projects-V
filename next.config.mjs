/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for production to avoid double renders
  reactStrictMode: false,
  // Configure image domains
  images: {
    domains: ['v0.blob.com', 'localhost'],
  },
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
