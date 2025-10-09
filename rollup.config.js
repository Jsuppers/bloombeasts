import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'bloombeasts/index.ts',
  output: {
    file: '../Bloombeasts-Compiled-Code.ts',
    format: 'es',
    banner: `/**
 * Bloombeasts Compiled Code
 * Auto-generated file - DO NOT EDIT
 * Generated from bloombeasts folder
 *
 * This single file contains all Bloom Beasts game code
 * compiled for Horizon Worlds compatibility
 */

/* eslint-disable */
/* tslint:disable */
`,
    intro: 'export namespace Bloombeasts {',
    outro: '}',
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      outputToFilesystem: true,
    })
  ],
  external: []
};