import { useEffect, useState } from 'react'

export function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          name: '현재 위치',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    )
  }, [])

  return { currentLocation }
}
