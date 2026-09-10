const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/Snorkeling-website' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;
