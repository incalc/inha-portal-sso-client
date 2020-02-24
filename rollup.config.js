import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  external: [
    'axios',
  ],
  plugins: [
    terser(),
    typescript(),
  ],
};