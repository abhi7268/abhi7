/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    // Ye build ke waqt ESLint errors ko ignore karega
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ye build ke waqt TypeScript errors ko ignore karega
    ignoreBuildErrors: true,
  },
};

export default nextConfig;