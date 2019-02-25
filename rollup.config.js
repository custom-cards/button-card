import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.ts',
    output: {
        file: 'button-card.js',
        format: 'esm'
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        terser()
    ]
};