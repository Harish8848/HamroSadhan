/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  devIndicators: false, 

  images: {
    domains: ["imgd.aeplcdn.com", "assets.nepbike.com", "upload.wikimedia.org", "motoringworld.in", "www.financialexpress.com", "www.rentacarkerala.in", "krazyhorse.co.uk"],
  },

  webpack: (config) => {
    config.output.chunkFilename = "static/chunks/[name].[contenthash].js";
    return config;
  },
}

module.exports = nextConfig
