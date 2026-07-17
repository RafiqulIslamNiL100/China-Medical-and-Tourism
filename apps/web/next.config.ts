import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No images anywhere on the site yet (no hero photos, no hospital images) — once
  // they exist, add `images.remotePatterns` here pointing at a PUBLIC-ACL image
  // bucket/CDN. Do NOT point it at services/api's existing StorageService bucket:
  // that one is private, serving 15-minute presigned URLs for medical
  // documents/visa files, which is the wrong shape for a next/image-optimized,
  // sitemap-referenced, cache-friendly public marketing image — it needs a stable
  // permanent URL, not one that expires. That's a small backend decision (new
  // bucket + upload path) to make before the first image lands, not a
  // next.config.ts-only concern.
  //
  // Conventions to follow once images land:
  //  - Required, descriptive alt text — already enforced by eslint-config-next's
  //    bundled jsx-a11y/alt-text rule (covers both <img> and next/image).
  //  - Explicit `sizes` matching the actual rendered breakpoints, not a guess.
  //  - `priority` on the single largest above-the-fold image per page (hospital
  //    hero, homepage hero) for LCP; everything else lazy by default.
};

export default nextConfig;
