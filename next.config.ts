import type { NextConfig } from "next";
const { withVercelTurbo } = require("@vercel/next");

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // The 'domains' property is deprecated. Use 'remotePatterns' instead.
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
    ],
  },
};

export default withVercelTurbo(nextConfig);
