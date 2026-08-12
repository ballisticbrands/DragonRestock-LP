import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // Absolute, never relative: the site is served at the custom-domain root,
  // and a relative base breaks the nested prerendered route stubs
  // (/demo/, /pricing/) that scripts/postbuild-spa-routes.mjs writes.
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
