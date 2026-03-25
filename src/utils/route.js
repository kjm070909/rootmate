function toRadians(degree) {
  return (degree * Math.PI) / 180
}

export function getDistanceMeters(a, b) {
  const earthRadius = 6371000
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export function estimateWalkingMinutes(distance) {
  return distance / 67
}

export function getRouteDistance(start, route) {
  let total = 0
  let previous = start

  route.forEach((place) => {
    total += getDistanceMeters(previous, place)
    previous = place
  })

  return total
}

export function optimizePlaces(start, places) {
  if (places.length <= 1) {
    return places
  }

  const remaining = [...places]
  const route = []
  let current = start

  while (remaining.length) {
    let nearestIndex = 0
    let nearestDistance = getDistanceMeters(current, remaining[0])

    for (let i = 1; i < remaining.length; i += 1) {
      const candidateDistance = getDistanceMeters(current, remaining[i])

      if (candidateDistance < nearestDistance) {
        nearestDistance = candidateDistance
        nearestIndex = i
      }
    }

    const [nearest] = remaining.splice(nearestIndex, 1)
    route.push(nearest)
    current = nearest
  }

  let improved = true
  while (improved) {
    improved = false

    for (let i = 0; i < route.length - 1; i += 1) {
      for (let j = i + 1; j < route.length; j += 1) {
        const candidate = [
          ...route.slice(0, i),
          ...route.slice(i, j + 1).reverse(),
          ...route.slice(j + 1),
        ]

        if (getRouteDistance(start, candidate) + 1 < getRouteDistance(start, route)) {
          route.splice(0, route.length, ...candidate)
          improved = true
        }
      }
    }
  }

  return route
}

export function getSegmentGuideUrl(from, to) {
  const fromName = encodeURIComponent(from.name)
  const toName = encodeURIComponent(to.name)
  return `https://map.kakao.com/link/from/${fromName},${from.lat},${from.lng}/to/${toName},${to.lat},${to.lng}`
}
