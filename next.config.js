/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Digital-purohit',
  assetPrefix: '/Digital-purohit/',
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,

  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
