import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/emergency-alerts-card.ts',
  output: {
    file: 'dist/emergency-alerts-card.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
      sourceMap: true
    })
  ],
  external: []
}; 