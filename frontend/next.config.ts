import type { NextConfig } from "next";

const backendUrl = (
  process.env.BACKEND_URL?.trim() || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["10.2.0.2", "172.28.0.1"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
