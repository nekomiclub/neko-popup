import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error resolve unresolvable
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';



// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: `${path.resolve()}/src/_package/index.ts`,
      name: 'neko-popup',
      fileName: (format) => `index.${format}.js`,
      cssFileName: 'styles'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
        exports: 'named'
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: [react(), dts(), tailwindcss()],
});
