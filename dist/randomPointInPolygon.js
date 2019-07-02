(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.randomPointInPolygon = factory());
}(this, function () { 'use strict';

    var isClockwise = function isClockwise(poly) {
        var sum = 0;
        for (var i=0; i<poly.length-1; i++) {
            var cur = poly[i],
                next = poly[i+1];
            sum += (next[0] - cur[0]) * (next[1] + cur[1]);
        }
        return sum > 0
    };

    var pointInPolygon = function (point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        
        var x = point[0], y = point[1];
        
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };

    function debugConvexAngle (p1, p2, p3) {
        if (process.env.NODE_ENV !== 'development') return
        const map = window.map;
        const points = L.layerGroup([]).addTo(map);

        L.circleMarker([p1[1], p1[0]], {color: 'red', radius: 10}).addTo(points);
        L.circleMarker([p2[1], p2[0]], {color: 'orange', radius: 6}).addTo(points);
        L.circleMarker([p3[1], p3[0]], {color: 'yellow', radius: 3}).addTo(points);
        debugger
        points.clearLayers();
    }

    function randomPointInPoly (contour, indexOfConvexVertice) {
        let x = indexOfConvexVertice ? indexOfConvexVertice : 0;
        if (x === 0) {
            const isContourClockwise = isClockwise(contour);

            if (!isContourClockwise) {
                for (x; x < contour.length - 3; x++) {
                    if (isAngleConvex(contour[x], contour[x + 1], contour[x + 2])) break
                }
            } else {
                for (x = contour.length - 3; x >= 0; x--) {
                    if (!isAngleConvex(contour[x], contour[x + 1], contour[x + 2])) break
                }
            }
        }

        const triangle = [contour[x], contour[x + 1], contour[x + 2]];
        debugConvexAngle(contour[x], contour[x + 1], contour[x + 2]);

        let closestPointIndex = null;
        let closestDistance = Infinity;

        for (let xx = 1; xx < contour.length - 1; xx++) {
            if (xx === x + 1) continue
            if (pointInPolygon(contour[xx], triangle)) {
                const dist = distance(contour[x + 1], contour[xx]);
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestPointIndex = xx;
                }
            }
        }

        return closestPointIndex === null ?
            getCentroidOfTriangle(contour[x], contour[x + 1], contour[x + 2]) :
            getMidpoint(contour[x + 1], contour[closestPointIndex])


        function getMidpoint(p1, p2) {
            return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        }

        function distance (p1, p2) {
            return Math.sqrt((p2[1] - p1[1]) * (p2[1] - p1[1]) + (p2[0] - p1[0]) * (p2[0] - p2[0]))
        }

        function isAngleConvex (p0, p1, p2) {
            const bearingPrevPoint = calculateBearing(p1, p0);
            const bearingNextPoint = calculateBearing(p1, p2);
            const angleBetweenPoints = bearingToAzimuth(bearingToAzimuth(bearingNextPoint) - bearingToAzimuth(bearingPrevPoint));
            return angleBetweenPoints < 180
        }

        function calculateBearing (point1, point2) {
            const lon1 = degreesToRadians(point1[0]);
            const lon2 = degreesToRadians(point2[0]);
            const lat1 = degreesToRadians(point1[1]);
            const lat2 = degreesToRadians(point2[1]);

            const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
            const b = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

            return radiansToDegrees(Math.atan2(a, b))
        }

        function degreesToRadians (degrees) {
            return degrees * Math.PI / 180
        }

        function radiansToDegrees (radians) {
            return radians * 180 / Math.PI
        }

        function bearingToAzimuth (bearing) {
            let angle = bearing % 360;
            if (angle < 0) { angle += 360; }
            return angle
        }

        function getCentroidOfTriangle (p1, p2, p3) {
            return [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3]
        }
    }

    return randomPointInPoly;

}));
