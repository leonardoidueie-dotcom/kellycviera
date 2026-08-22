/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // next/image converte automaticamente para AVIF/WebP na entrega.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
