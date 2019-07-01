import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'

const output = (file, plugins) => ({
    input: './src/main.js',
    output: {
        name: 'randomPointInPolygon',
        file,
        format: 'umd',
        exports: 'default'
    },
    plugins
})

export default [
    output('./dist/randomPointInPolygon.js', [
        commonjs(),
        resolve()
    ]),
    output('./dist/randomPointInPolygon.min.js', [
        commonjs(),
        resolve(),
        terser()
    ])
]
