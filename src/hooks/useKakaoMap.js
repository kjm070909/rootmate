import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { DEFAULT_CENTER, KAKAO_MAP_KEY } from '../constants/map'
import { escapeHtml, loadKakaoMapScript } from '../utils/kakaoMap'

export function useKakaoMap({ currentLocation, onMapPlaceAdd, placeCount, routePlaces }) {
  const mapElementRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const routeLineRef = useRef(null)
  const currentMarkerRef = useRef(null)
  const placesCountRef = useRef(0)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState('')
  const [searching, setSearching] = useState(false)
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
  const handleMapPlaceAdd = useEffectEvent(onMapPlaceAdd)

  useEffect(() => {
    placesCountRef.current = placeCount
  }, [placeCount])

  useEffect(() => {
    let cancelled = false

    loadKakaoMapScript(KAKAO_MAP_KEY)
      .then((kakao) => {
        if (cancelled || !mapElementRef.current) {
          return
        }

        const map = new kakao.maps.Map(mapElementRef.current, {
          center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: 4,
        })

        mapRef.current = map
        setMapReady(true)
        setMapError('')

        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          const latLng = mouseEvent.latLng
          handleMapPlaceAdd({
            id: crypto.randomUUID(),
            name: `직접 추가한 장소 ${placesCountRef.current + 1}`,
            lat: latLng.getLat(),
            lng: latLng.getLng(),
            source: 'manual',
          })
        })
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        if (error.message === 'missing-app-key') {
          setMapError('카카오맵 JavaScript 키가 `.env`에 없습니다.')
          return
        }

        setMapError(
          `카카오맵 스크립트를 불러오지 못했습니다. 카카오 디벨로퍼스 Web 플랫폼에 현재 주소(${currentOrigin})가 등록되어 있고 Kakao Map 사용 설정이 켜져 있는지 확인해주세요.`,
        )
      })

    return () => {
      cancelled = true
    }
  }, [currentOrigin, handleMapPlaceAdd])

  useEffect(() => {
    const map = mapRef.current
    const kakao = window.kakao

    if (!map || !kakao?.maps) {
      return
    }

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (routeLineRef.current) {
      routeLineRef.current.setMap(null)
      routeLineRef.current = null
    }

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null)
      currentMarkerRef.current = null
    }

    const bounds = new kakao.maps.LatLngBounds()
    const linePath = []

    if (currentLocation) {
      const currentPosition = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
      currentMarkerRef.current = new kakao.maps.Marker({
        map,
        position: currentPosition,
      })
      bounds.extend(currentPosition)
      linePath.push(currentPosition)
    }

    routePlaces.forEach((place, index) => {
      const position = new kakao.maps.LatLng(place.lat, place.lng)
      const marker = new kakao.maps.Marker({
        map,
        position,
        title: `${index + 1}. ${place.name}`,
      })

      const info = new kakao.maps.InfoWindow({
        content: `<div style="padding:8px 10px;font-size:12px;"><strong>${index + 1}. ${escapeHtml(place.name)}</strong></div>`,
      })

      kakao.maps.event.addListener(marker, 'click', () => info.open(map, marker))
      markersRef.current.push(marker)
      bounds.extend(position)
      linePath.push(position)
    })

    if (linePath.length >= 2) {
      routeLineRef.current = new kakao.maps.Polyline({
        map,
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#d34a24',
        strokeOpacity: 0.85,
        strokeStyle: 'solid',
      })
    }

    if (!bounds.isEmpty()) {
      map.setBounds(bounds, 80, 80, 80, 80)
    }
  }, [currentLocation, routePlaces])

  async function searchPlaces(keyword) {
    if (!keyword.trim()) {
      return []
    }

    if (!window.kakao?.maps?.services || !mapRef.current) {
      setMapError('지도가 아직 준비되지 않았습니다.')
      return []
    }

    setSearching(true)
    setMapError('')

    const results = await new Promise((resolve) => {
      const placesService = new window.kakao.maps.services.Places()

      placesService.keywordSearch(keyword, (data, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          setMapError('검색 결과를 찾지 못했습니다.')
          resolve([])
          return
        }

        resolve(
          data.slice(0, 8).map((item) => ({
            id: item.id,
            name: item.place_name,
            address: item.road_address_name || item.address_name,
            lat: Number(item.y),
            lng: Number(item.x),
            source: 'search',
          })),
        )
      })
    })

    setSearching(false)
    return results
  }

  function moveToCurrentLocation() {
    if (!currentLocation || !mapRef.current || !window.kakao?.maps) {
      return
    }

    mapRef.current.panTo(new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng))
  }

  return {
    currentOrigin,
    mapElementRef,
    mapError,
    mapReady,
    moveToCurrentLocation,
    searchPlaces,
    searching,
  }
}
