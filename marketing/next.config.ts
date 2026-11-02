import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  webpack: (config) => {
    for (const rule of config.module.rules) {
      if (Array.isArray(rule.oneOf)) {
        for (const oneOfRule of rule.oneOf) {
          if (
            oneOfRule.use &&
            Array.isArray(oneOfRule.use) &&
            oneOfRule.use.some(
              (u: { loader?: string }) =>
                typeof u === "object" &&
                u !== null &&
                typeof u.loader === "string" &&
                u.loader.includes("css-loader") &&
                !u.loader.includes("postcss-loader")
            )
          ) {
            oneOfRule.use.push("@tailwindcss/turbopack");
          }
        }
      }
    }
    return config;
  },
};

export default nextConfig;

