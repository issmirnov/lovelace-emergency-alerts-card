import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/emergency-alerts-card.ts',
  output: {
    file: 'emergency-alerts-card.js',
    format: 'es',
    sourcemap: true,
    inlineDynamicImports: true
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
      sourceMap: true,
      inlineSources: true
    }),
    terser({
      // Keep sourcemaps in minified output
      sourceMap: true
    })
  ],
  external: []
}; 