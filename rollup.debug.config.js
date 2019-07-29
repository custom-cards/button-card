import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  input: ['src/button-card.ts'],
  output: {
    dir: './dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs({
      namedExports: { bowser: ['getParser'] },
    }),
    typescript(),
    json(),
    babel({
      exclude: 'node_modules/**',
    })],
};
