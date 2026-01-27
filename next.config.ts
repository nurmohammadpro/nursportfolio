import type { NextConfig } from "next";
const { withNextOnPages } = require("@cloudflare/next-on-pages");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default withNextOnPages(nextConfig);
