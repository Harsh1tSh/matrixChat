import webpack from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: 'crypto-browserify',
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          global: 'global',
        })
      );
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_MATRIX_USER_ID: process.env.MATRIX_USER_ID,
    NEXT_PUBLIC_MATRIX_ACCESS_TOKEN: process.env.MATRIX_ACCESS_TOKEN,
  },
};

export default nextConfig;