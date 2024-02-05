import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@utils': resolve('src/renderer/src/utils'),
        '@store': resolve('src/renderer/src/store'),
        '@layouts': resolve('src/renderer/src/layouts'),
        '@components': resolve('src/renderer/src/components'),
        '@pages': resolve('src/renderer/src/pages'),
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
