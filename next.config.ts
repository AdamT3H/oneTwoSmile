const nextConfig = {
  allowedDevOrigins: [
    "192.168.68.108",
    "localhost",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jfabsbeoollsulcjyorr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "kamon.ua",
      },
      {
        protocol: "https",
        hostname: "beautycarebag.com",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
      },
    ],
  },
};

export default nextConfig;