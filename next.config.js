const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: assetPrefix || '/spotify/',
  basePath: basePath || '/spotify', // TODO : que en PROD je pense
  trailingSlash: true, // Ensure trailing slashes for GitHub Pages compatibility
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
    unoptimized: true,
  },
  output: 'export',
};

module.exports = nextConfig;