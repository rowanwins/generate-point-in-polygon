const path = require('path')
const Benchmark = require('benchmark')
const generatePoint = require('../dist/generatePointInPolygon.js')
const pointOnFeature = require('@turf/point-on-feature')
const loadJsonFile = require('load-json-file')

const spike = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'super-spike.geojson'))
const switzerland = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'switzerland.geojson'))

const options = {
    onStart () { console.log(this.name) },
    onError (event) { console.log(event.target.error) },
    onCycle (event) { console.log(String(event.target)) },
    onComplete () {
        console.log(`- Fastest is ${this.filter('fastest').map('name')}`)
    }
}


// Switzerland
// randomPointInPolygon x 99,601 ops/sec ±1.59% (91 runs sampled)
// turf point-on-feature x 69,499 ops/sec ±0.81% (90 runs sampled)
// - Fastest is randomPointInPolygon
const suite = new Benchmark.Suite('Switzerland', options)
suite
    .add('generate-point-in-polygon', function () {
        generatePoint(switzerland.geometry.coordinates[0])
    })
    .add('turf point-on-feature', function () {
        pointOnFeature(switzerland)
    })
    .run()

// Switzerland with identified convex vertice
// randomPointInPolygon x 157,610 ops/sec ±1.59% (91 runs sampled)
// turf point-on-feature x 69,499 ops/sec ±0.81% (90 runs sampled)
// - Fastest is randomPointInPolygon
const suite1 = new Benchmark.Suite('Switzerland with convex identified', options)
suite1
    .add('generate-point-in-polygon', function () {
        generatePoint(switzerland.geometry.coordinates[0], 745)
    })
    .add('turf point-on-feature', function () {
        pointOnFeature(switzerland)
    })
    .run()

// Simple spike case
// randomPointInPolygon x 1,607,054 ops/sec ±1.00% (82 runs sampled)
// turf point-on-feature x 430,476 ops/sec ±0.68% (89 runs sampled)
// - Fastest is randomPointInPolygon
const suite2 = new Benchmark.Suite('Simple Case', options)
suite2
    .add('generate-point-in-polygon', function () {
        generatePoint(spike.geometry.coordinates[0])
    })
    .add('turf point-on-feature', function () {
        pointOnFeature(spike)
    })
    .run()

