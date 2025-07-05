/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  devIndicators: false, // ✅ Hides the "N" overlay

  webpack: (config) => {
    config.output.chunkFilename = "static/chunks/[name].[contenthash].js";
    return config;
  },
}

module.exports = nextConfig