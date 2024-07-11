import { defineConfig } from 'vite';
import { resolve } from 'path';
import { checker } from 'vite-plugin-checker';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'sheet-o-scope',
      fileName: 'sheetoscope'
    }
  },
  plugins: [
    checker({
      typescript: true
    })
  ]
});