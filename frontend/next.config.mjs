/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ["res.cloudinary.com"], // <-- just strings
  },
};

export default nextConfig;
