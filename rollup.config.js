import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'react-use-wavelet',
      file: pkg.browser,
      format: 'umd',
      globals: {
        react: 'react',
        'wavelet-client-js': 'wavelet-client-js'
      }
    },
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [
      resolve(),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs()
    ]
  },
  {
    input: 'src/index.js',
    external: Object.keys(pkg.peerDependencies || {}),
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
