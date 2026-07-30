import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Web-first architecture: builds directly to a PWA that wraps cleanly
// into Android via Capacitor/Bubblewrap (see README "Android packaging").
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Assam Jobs Repository',
        short_name: 'AssamJobs',
        description: 'Sarkari & Private Jobs, Eligibility Map, CV Builder for Assam',
        theme_color: '#0B6E4F',
        background_color: '#F7F5F0',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'firestore-cache', networkTimeoutSeconds: 4 }
          }
        ]
      }
    })
  ],
  server: { port: 5173 },
  build: { target: 'es2019', sourcemap: false }
})
