import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'

const output = (file, plugins) => ({
    input: './src/main.js',
    output: {
        name: 'generatePointInPolygon',
        file,
        format: 'umd',
        exports: 'default'
    },
    plugins
})

export default [
    output('./dist/generatePointInPolygon.js', [
        commonjs(),
        resolve()
    ]),
    output('./dist/generatePointInPolygon.min.js', [
        commonjs(),
        resolve(),
        terser()
    ])
]
