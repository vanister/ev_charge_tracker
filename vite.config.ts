import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

function getCommitSha(): string {
  // CF_PAGES_COMMIT_SHA is injected by Cloudflare Pages builds; fall back to git locally
  if (process.env.CF_PAGES_COMMIT_SHA) {
    return process.env.CF_PAGES_COMMIT_SHA.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return '';
  }
}

const commitSha = getCommitSha();
const appVersion = pkg.version + (commitSha ? `+${commitSha}` : '');

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion)
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
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
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    }),
    cloudflare()
  ]
});
