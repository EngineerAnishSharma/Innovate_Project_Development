/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "files.mastodon.social",
      },
      {
        protocol: "https",
        hostname: "mastodon.social",
      },
    ],
  },
};

export default nextConfig;
