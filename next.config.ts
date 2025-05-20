// import type { NextConfig } from "next";
import i18nConfig from './next-i18next.config.js';

const nextConfig = {
  ...i18nConfig,
  images: {
    
    domains: ['jfabsbeoollsulcjyorr.supabase.co',  'example.com'], // заміни на свій actual домен Supabase, якщо інший
  },
};

export default nextConfig;