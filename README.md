# generate-point-in-polygon
A small module to generate a point on a polygon in O(n) time.

## Install
````
npm install generate-point-in-polygon
````

## Documentation
Valid inputs: An array of polygon coordinates

````js
    const generatePoint = require('generate-point-in-polygon')

    const poly = {type: 'Polygon', coordinates: [[[0, 5], [0, 0], [15, 0], [1, 0.5], [0, 5]]]}
    const p = generatePoint(poly.coordinates[0])
    //returns p = [0.5, 0.25]
````

Optionally, if you already know the index of a convex vertice, you can pass this in as an argument, this will help speed up the calculation.

````js
    const generatePoint = require('generate-point-in-polygon')
    generatePoint(someBigPolygon.coordinates[0], 700)
````

## Limitations
- Only works on polygons without holes.

## Benchmarks

````
// Switzerland
generate-point-in-polygon x 99,601 ops/sec ±1.59% (91 runs sampled)
turf point-on-feature x 69,499 ops/sec ±0.81% (90 runs sampled)

// Switzerland with identified convex vertice
generate-point-in-polygon x 157,610 ops/sec ±1.59% (91 runs sampled)
turf point-on-feature x 69,499 ops/sec ±0.81% (90 runs sampled)

// Spike case
// generate-point-in-polygon x 1,607,054 ops/sec ±1.00% (82 runs sampled)
// turf point-on-feature x 430,476 ops/sec ±0.68% (89 runs sampled)
````

## Further Reading
[Marco Tenuti's blog (using Google Translate!)](http://www.tencas.com/blog/articolo.asp?articolo=1174) and [this blog](http://www.alecjacobson.com/weblog/?p=1256)

