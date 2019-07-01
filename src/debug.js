export function debugConvexAngle (p1, p2, p3) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map
    const points = L.layerGroup([]).addTo(map)

    L.circleMarker([p1[1], p1[0]], {color: 'red', radius: 10}).addTo(points)
    L.circleMarker([p2[1], p2[0]], {color: 'orange', radius: 6}).addTo(points)
    L.circleMarker([p3[1], p3[0]], {color: 'yellow', radius: 3}).addTo(points)
    debugger
    points.clearLayers()
}
