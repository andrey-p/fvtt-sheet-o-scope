import { defineConfig } from 'vite';
import { resolve } from 'path';
import { checker } from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'sheet-o-scope',
      fileName: 'sheet-o-scope'
    }
  },
  test: {
    include: ['./tests/**/*.ts']
  },
  plugins: [
    checker({
      typescript: true
    }),
    // caveat: during --watch, changes to this file don't get copied over
    // probably not worth addressing unless this became a more css-heavy project
    viteStaticCopy({
      targets: [
        {
          src: 'styles/*',
          dest: ''
        }
      ]
    })
  ]
});
