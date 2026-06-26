import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // App Hosting clones the full monorepo; pin the workspace root here so Next.js
  // does not walk up to the repo-level package-lock.json during build.
  turbopack: {
    root: appDir,
  },
  outputFileTracingRoot: appDir,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
