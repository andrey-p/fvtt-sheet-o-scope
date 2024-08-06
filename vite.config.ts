import { defineConfig } from 'vite';
import { resolve } from 'path';
import { checker } from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPack from 'vite-plugin-zip-pack';

import moduleJson from './static/module.json';

export default defineConfig(({ mode }) => {
  let outDir: string;
  let createZip: boolean = false;
  const version = moduleJson.version as string;

  if (mode === 'local') {
    outDir = 'build';
  } else if (mode === 'dev-release') {
    outDir = 'dist';
    createZip = true;
  } else if (mode === 'versioned-release') {
    outDir = `build/${version}`;
    createZip = true;
  }

  const plugins = [
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
  ];

  if (createZip) {
    plugins.push(zipPack({
      inDir: outDir,
      outDir,
      outFileName: 'sheet-o-scope.zip'
    }));
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
    plugins
  }
});
