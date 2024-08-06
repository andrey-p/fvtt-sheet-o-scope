import { defineConfig } from 'vite';
import { resolve } from 'path';
import { checker } from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPack from 'vite-plugin-zip-pack';

import moduleJson from './static/module.json';

const devReleaseUrlBase = 'https://raw.githubusercontent.com/andrey-p/fvtt-sheet-o-scope/main/dist';
const versionedReleaseUrlBase = 'https://github.com/andrey-p/fvtt-sheet-o-scope/releases';

export default defineConfig(({ mode }) => {
  let outDir: string;
  let createZip: boolean = false;

  // in dev / unversioned builds, the manifest and download
  // properties can be anything
  let transformHandler = (moduleJsonString) => {
    return moduleJsonString
      .replace('{{manifestLocation}}', devReleaseUrlBase)
      .replace('{{zipLocation}}', devReleaseUrlBase);
  };

  if (mode === 'local') {
    outDir = 'build';
  } else if (mode === 'dev-release') {
    outDir = 'dist';
    createZip = true;
  } else if (mode === 'versioned-release') {
    const version = moduleJson.version as string;

    outDir = `build/${version}`;
    createZip = true;

    // in versioned releases:
    transformHandler = (moduleJsonString) => {
      return moduleJsonString
        // the manifest needs to be the _latest_ one
        // (so Foundry can check it and figure out if there's an update)
        .replace('{{manifestLocation}}', `${versionedReleaseUrlBase}/latest/download`)
        // the download needs to match the one of the _current_ version
        // (so Foundry has a consistent path to it)
        .replace('{{zipLocation}}', `${versionedReleaseUrlBase}/download/v${version}`);
    };
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
          src: 'static/lang',
          dest: ''
        },
        {
          src: 'static/module.json',
          dest: '',
          transform: {
            encoding: 'utf8',
            handler: transformHandler
          }
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
