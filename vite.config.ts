import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }, { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },],

  },
  server: {
    open: true,
    port: 3000,
    strictPort:true
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
