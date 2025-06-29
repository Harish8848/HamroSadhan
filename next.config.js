/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   allowedDevOrigins: ['http://192.168.18.4'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bikemandunepal.com',
      },
      {
        protocol: 'https',
        hostname: 'bajajautonp.com',
      },
      {
        protocol: 'https',
        hostname: 'suzukimotorcycle.com',
      },
      {
        protocol: 'https',
        hostname: 'imgd.aeplcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'mahindrascorpio.com',
      },
    ],
  },
  webpack: (config) => {
    config.output.chunkFilename = "static/chunks/[name].[contenthash].js";
    return config;
  },
}

module.exports = nextConfig