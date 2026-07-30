import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/index.html",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;