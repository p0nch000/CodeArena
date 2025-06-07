/** @type {import('next').NextConfig} */

const repo = 'CodeArena';

const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Recomendado para compatibilidad con GitHub Pages
};

export default nextConfig;
