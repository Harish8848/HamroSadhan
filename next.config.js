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
      { protocol: "https", hostname: "www.motoroids.com" },
      { protocol: "https", hostname: "www.ideacdn.net" },
      { protocol: "https", hostname: "ideacdn.net" },
      { protocol: "https", hostname: "www.austinracingexhausts.com.au" },
      { protocol: "https", hostname: "nepaldrives.com" },
    ],
  },
}

module.exports = nextConfig
