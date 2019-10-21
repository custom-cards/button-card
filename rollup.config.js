import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: ['src/button-card.ts'],
  output: {
    dir: './dist',
    format: 'es',
    sourcemap: false,
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
    }),
    terser({
      mangle: {
        safari10: true,
      },
      output: {
        comments: function (node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        }
      }
    }),
  ],
};
