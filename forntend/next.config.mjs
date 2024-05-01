import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodeLoader = require('node-loader');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    // Adding .node files support
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Fix for Node.js modules that may cause issues with Webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Add other Node.js modules if necessary
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

export default nextConfig;
