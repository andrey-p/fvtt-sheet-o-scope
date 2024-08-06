import { defineConfig } from 'vite';
import { resolve } from 'path';
import { checker } from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  let outDir: string;

  if (mode === 'development') {
    outDir = 'build';
  } else {
    outDir = 'dist';
  }

  return {
    build: {
      outDir,
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        formats: ['es'],
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
          },
          {
            src: 'static/*',
            dest: ''
          }
        ]
      })
    ]
  }
});
