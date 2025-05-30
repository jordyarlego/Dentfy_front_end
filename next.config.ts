// next.config.ts
import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: process.env.NODE_ENV === "development",
  },
  webpack: (config, { isServer }) => {
    // Configuração para arquivos de vídeo
    config.module.rules.push({
      test: /\.(mov|mp4|webm)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/videos/",
            outputPath: `${isServer ? "../" : ""}static/videos/`,
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // <-- Adicionei aqui!
  },
  // Outras configurações globais podem ser adicionadas aqui
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
