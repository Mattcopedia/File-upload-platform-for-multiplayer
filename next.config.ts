import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  webpack: (config) => {
    // Allow importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Prevent pdfjs-dist from trying to load Node-only 'canvas'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure-medical-records.s3.eu-west-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
