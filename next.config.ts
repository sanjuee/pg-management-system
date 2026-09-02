import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@react-pdf/renderer",
    "@react-pdf/layout",
    "@react-pdf/pdfkit",
    "@react-pdf/font",
  ],
  webpack: (config) => {
    // Prevent @react-pdf/renderer from being processed on the server side
    config.resolve.alias = {
      ...config.resolve.alias,
      // canvas is an optional dependency of @react-pdf/renderer
      canvas: false,
    };
    return config;
  },
  turbopack: {},
};

export default nextConfig;
