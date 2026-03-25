import { KAKAO_MAP_KEY } from '../constants/map'

function KakaoMapView({ currentOrigin, mapElementRef, mapError }) {
  return (
    <div className="map-frame">
      {mapError ? <div className="map-overlay error">{mapError}</div> : null}

      {!KAKAO_MAP_KEY ? (
        <div className="map-overlay">
          <strong>카카오맵 키가 필요합니다.</strong>
          <p>
            프로젝트 루트에 <code>VITE_KAKAO_MAP_APP_KEY</code> 를 넣은 `.env` 파일을
            추가해주세요.
          </p>
        </div>
      ) : null}

      {KAKAO_MAP_KEY && mapError ? (
        <div className="map-overlay checklist">
          <strong>먼저 확인할 것</strong>
          <p>1. 카카오 디벨로퍼스 앱의 Web 플랫폼에 현재 주소를 등록</p>
          <p>
            2. 등록 주소 예시: <code>{currentOrigin}</code>
          </p>
          <p>3. 앱에서 Kakao Map 사용 설정이 켜져 있는지 확인</p>
        </div>
      ) : null}

      <div ref={mapElementRef} className="map-canvas" />
    </div>
  )
}

export default KakaoMapView
