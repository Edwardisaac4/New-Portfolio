import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

/**
 * Adds a <link rel="preload"> for the self-hosted Latin Mona Sans file.
 * Its file name is content-hashed at build time, so it can't be hard-coded in
 * index.html. Preloading lets the font download alongside the JS bundle instead
 * of waiting until the CSS is parsed and the first text is rendered.
 */
const preloadLatinFont = () => ({
  name: 'preload-latin-font',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(_html, { bundle }) {
      const font = Object.keys(bundle ?? {}).find((file) =>
        /mona-sans-latin-wght-normal-[\w-]+\.woff2$/.test(file)
      )
      if (!font) return []
      return [{
        tag: 'link',
        attrs: { rel: 'preload', href: `/${font}`, as: 'font', type: 'font/woff2', crossorigin: '' },
        injectTo: 'head',
      }]
    },
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    preloadLatinFont(),
  ],
  build: {
    // Three.js lives in its own lazily loaded chunk (~1 MB raw), which is expected
    chunkSizeWarningLimit: 2000,
  }
})
