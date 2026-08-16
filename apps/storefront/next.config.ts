import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Agar standalone output tahu di mana shared packages berada
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../../'),
  },
};

export default nextConfig;
