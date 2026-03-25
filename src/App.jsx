import { useMemo, useState } from 'react'
import HeroPanel from './components/HeroPanel'
import KakaoMapView from './components/KakaoMapView'
import RoutePanel from './components/RoutePanel'
import SearchPanel from './components/SearchPanel'
import { useCurrentLocation } from './hooks/useCurrentLocation'
import { useKakaoMap } from './hooks/useKakaoMap'
import { estimateWalkingMinutes, getDistanceMeters, getRouteDistance, optimizePlaces } from './utils/route'
import './App.css'

function App() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [places, setPlaces] = useState([])
  const { currentLocation } = useCurrentLocation()

  const optimizedRoute = useMemo(() => {
    if (!places.length) {
      return []
    }

    const startPoint = currentLocation ?? places[0]
    const candidates = currentLocation ? places : places.slice(1)
    const optimized = optimizePlaces(startPoint, candidates)

    return currentLocation ? optimized : [places[0], ...optimized]
  }, [currentLocation, places])

  const {
    currentOrigin,
    mapElementRef,
    mapError,
    mapReady,
    searchPlaces,
    searching,
    moveToCurrentLocation,
  } = useKakaoMap({
    currentLocation,
    placeCount: places.length,
    routePlaces: optimizedRoute,
    onMapPlaceAdd: (place) => {
      setPlaces((prev) => [...prev, place])
    },
  })

  const routeSummary = useMemo(() => {
    if (!optimizedRoute.length) {
      return { totalDistance: 0, totalMinutes: 0 }
    }

    const startPoint = currentLocation ?? optimizedRoute[0]
    const route = currentLocation ? optimizedRoute : optimizedRoute.slice(1)
    const totalDistance = getRouteDistance(startPoint, route)

    return {
      totalDistance,
      totalMinutes: estimateWalkingMinutes(totalDistance),
    }
  }, [currentLocation, optimizedRoute])

  function addPlace(place) {
    setPlaces((prev) => {
      const duplicated = prev.some(
        (item) =>
          Math.abs(item.lat - place.lat) < 0.00001 && Math.abs(item.lng - place.lng) < 0.00001,
      )

      if (duplicated) {
        return prev
      }

      return [...prev, { ...place, id: crypto.randomUUID() }]
    })
  }

  function removePlace(id) {
    setPlaces((prev) => prev.filter((place) => place.id !== id))
  }

  function resetPlaces() {
    setPlaces([])
    setSearchResults([])
  }

  async function handleSearchSubmit(event) {
    event.preventDefault()

    if (!searchKeyword.trim()) {
      return
    }

    const results = await searchPlaces(searchKeyword)
    setSearchResults(results)
  }

  return (
    <div className="app-shell">
      <HeroPanel />

      <section className="workspace">
        <SearchPanel
          currentLocation={currentLocation}
          mapReady={mapReady}
          onAddPlace={addPlace}
          onMoveToCurrentLocation={moveToCurrentLocation}
          onRemovePlace={removePlace}
          onResetPlaces={resetPlaces}
          onSearchKeywordChange={setSearchKeyword}
          onSubmit={handleSearchSubmit}
          places={places}
          searchKeyword={searchKeyword}
          searchResults={searchResults}
          searching={searching}
        />

        <div className="map-panel">
          <RoutePanel
            currentLocation={currentLocation}
            getDistanceMeters={getDistanceMeters}
            optimizedRoute={optimizedRoute}
            routeSummary={routeSummary}
          />

          <KakaoMapView
            currentOrigin={currentOrigin}
            mapElementRef={mapElementRef}
            mapError={mapError}
          />
        </div>
      </section>
    </div>
  )
}

export default App
