import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tourinnovacion.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'anteriorportal.erbol.com.bo',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.abw.by',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.webmotors.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // ✅ Ignorar errores de ESLint en producción
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;