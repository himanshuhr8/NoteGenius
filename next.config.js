// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove this:
  // output: 'export',
  // Optional: if you're using Supabase Auth with SSR
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
