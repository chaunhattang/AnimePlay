/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080"
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com"
      }
    ]
  }
};

export default nextConfig;
