export function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  }

  return `${(distance / 1000).toFixed(1)}km`
}

export function formatMinutes(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)}분`
  }

  const hours = Math.floor(minutes / 60)
  const remainMinutes = Math.round(minutes % 60)
  return `${hours}시간 ${remainMinutes}분`
}
