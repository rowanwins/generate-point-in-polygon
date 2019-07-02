import test from 'ava'
import path from 'path'
import glob from 'glob'

import load from 'load-json-file'
import isInside from 'point-in-polygon'

import randomPointInPoly from '../src/main.js'

const fixtures = glob.sync(path.join(__dirname, 'fixtures', '*.geojson'))

test('fixtures', (t) => {
    fixtures.forEach((filepath) => {
        const geojson = load.sync(filepath);
        const p = randomPointInPoly(geojson.geometry.coordinates[0])
        t.true((isInside(p, geojson.geometry.coordinates[0])));
    });
})

test('test pre-seeded concave vertice', (t) => {
    const switzerland = load.sync(path.join(__dirname, 'fixtures', 'switzerland.geojson'))
    const p = randomPointInPoly(switzerland.geometry.coordinates[0], 745)
    t.true((isInside(p, switzerland.geometry.coordinates[0])));
})
