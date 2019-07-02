import isClockwise from 'is-clockwise'
import isInside from 'point-in-polygon'
import { debugConvexAngle } from './debug'

export default function randomPointInPoly (contour, indexOfConvexVertice) {
    let x = indexOfConvexVertice ? indexOfConvexVertice : 0
    if (x === 0) {
        const isContourClockwise = isClockwise(contour)

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

    const triangle = [contour[x], contour[x + 1], contour[x + 2]]
    debugConvexAngle(contour[x], contour[x + 1], contour[x + 2])

    let closestPointIndex = null
    let closestDistance = Infinity

    for (let xx = 1; xx < contour.length - 1; xx++) {
        if (xx === x + 1) continue
        if (isInside(contour[xx], triangle)) {
            const dist = distance(contour[x + 1], contour[xx])
            if (dist < closestDistance) {
                closestDistance = dist
                closestPointIndex = xx
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
        const bearingPrevPoint = calculateBearing(p1, p0)
        const bearingNextPoint = calculateBearing(p1, p2)
        const angleBetweenPoints = bearingToAzimuth(bearingToAzimuth(bearingNextPoint) - bearingToAzimuth(bearingPrevPoint))
        return angleBetweenPoints < 180
    }

    function calculateBearing (point1, point2) {
        const lon1 = degreesToRadians(point1[0])
        const lon2 = degreesToRadians(point2[0])
        const lat1 = degreesToRadians(point1[1])
        const lat2 = degreesToRadians(point2[1])

        const a = Math.sin(lon2 - lon1) * Math.cos(lat2)
        const b = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)

        return radiansToDegrees(Math.atan2(a, b))
    }

    function degreesToRadians (degrees) {
        return degrees * Math.PI / 180
    }

    function radiansToDegrees (radians) {
        return radians * 180 / Math.PI
    }

    function bearingToAzimuth (bearing) {
        let angle = bearing % 360
        if (angle < 0) { angle += 360 }
        return angle
    }

    function getCentroidOfTriangle (p1, p2, p3) {
        return [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3]
    }
}


