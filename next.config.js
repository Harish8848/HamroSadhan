/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  devIndicators: false, 

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imgd.aeplcdn.com" },
      { protocol: "https", hostname: "assets.nepbike.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "motoringworld.in" },
      { protocol: "https", hostname: "www.financialexpress.com" },
      { protocol: "https", hostname: "www.rentacarkerala.in" },
      { protocol: "https", hostname: "krazyhorse.co.uk" },
    ],
  },
}

module.exports = nextConfig
