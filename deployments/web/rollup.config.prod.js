import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main-prod.ts',
  output: {
    file: 'dist/bundle-prod.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      include: ['src/**/*.ts', '../../shared/**/*.ts', '../../bloombeasts/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.integration.test.ts', '**/__tests__/**'],
      compilerOptions: {
        target: 'ES2020',
        module: 'ES2015',
        lib: ['ES2020', 'DOM'],
        moduleResolution: 'node',
        sourceMap: true,
        declaration: false,
        skipLibCheck: true,
        strict: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }),
    resolve({
      extensions: ['.ts', '.js']
    })
  ],
  external: []
};
