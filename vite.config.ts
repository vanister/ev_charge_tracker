import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt',
    manifest: {
      name: 'EV Charge Tracker',
      short_name: 'Charge Tracker',
      description: 'Track your electric vehicle charging sessions',
      theme_color: '#14b8a6',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/icons/icon-192x192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icons/icon-192x192-maskable.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'maskable'
        },
        {
          src: '/icons/icon-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icons/icon-512x512-maskable.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'maskable'
        },
        {
          src: '/icons/icon-180x180.svg',
          sizes: '180x180',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icons/icon-32x32.svg',
          sizes: '32x32',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icons/icon-16x16.svg',
          sizes: '16x16',
          type: 'image/svg+xml',
          purpose: 'any'
        }
      ]
    }
  }), cloudflare()]
});