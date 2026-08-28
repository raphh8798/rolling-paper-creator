import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Without this, Turbopack auto-detects the project root by walking up
    // for a lockfile — if a parent folder happens to have its own
    // package-lock.json (e.g. C:\git\package-lock.json), it picks that
    // instead, can't find this project's `app/` directory, and every
    // route 404s. process.cwd() (rather than __dirname, which can behave
    // inconsistently once Next transpiles this file) assumes `npm run
    // dev`/`build` is invoked from the project root, which is the normal way.
    root: process.cwd(),
  },
};

export default nextConfig;
