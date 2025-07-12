// File: next.config.js
const path = require('path');

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sypkptdiktvvbnmhtqtx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three: path.resolve('./node_modules/three'),
      '@': path.resolve(__dirname),
    };
    return config;
  },
};