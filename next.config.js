/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{ source: '/shop', destination: '/#shop', permanent: false }]
  },
}

module.exports = nextConfig
