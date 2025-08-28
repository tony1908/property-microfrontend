import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "propertyService",
      filename: "remoteEntry.js",
      exposes: {
        './PropertyApp': './src/PropertyApp',
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssMinify: false,
  },
  server: {
    port: 3001,
  }
})
