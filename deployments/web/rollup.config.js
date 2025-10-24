import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

const sharedPlugins = [
  typescript({
    tsconfig: './tsconfig.json',
    include: ['src/**/*.ts', '../../bloombeasts/**/*.ts', '../../shared/**/*.ts'],
    exclude: ['**/*.test.ts', '**/*.integration.test.ts', '**/__tests__/**', 'src/unifiedGame.ts', 'src/webGameExample.ts', 'src/main.new.ts'],
    compilerOptions: {
      target: 'ES2017',
      module: 'ES2015',
      lib: ['ES2017', 'DOM'],
      moduleResolution: 'node',
      sourceMap: true,
      declaration: false,
      skipLibCheck: true,
      strict: false,
      noImplicitAny: false,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true
    }
  }),
  resolve({
    extensions: ['.ts', '.js']
  })
];

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'es',
      sourcemap: true
    },
    plugins: sharedPlugins,
    external: []
  }
];
