/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/spotify', // TODO : que en PROD je pense
  assetPrefix: '/spotify/',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval';",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  images: {
    domains: ["zhcpytnhrbxpmfbakgzx.supabase.co"],
  },
};

module.exports = nextConfig;
