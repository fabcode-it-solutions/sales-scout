import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['192.168.0.66:3000', 'localhost:3000'],
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.0.66:3000', 'localhost:3000']
    }
  }
};

export default nextConfig;
