/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.txt$/i,
        loader: "raw-loader",
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      }
    );

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
