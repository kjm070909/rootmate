import { formatDistance, formatMinutes } from '../utils/format'
import { estimateWalkingMinutes, getSegmentGuideUrl } from '../utils/route'

function RoutePanel({ currentLocation, getDistanceMeters, optimizedRoute, routeSummary }) {
  return (
    <>
      <div className="map-toolbar">
        <div>
          <p className="eyebrow">Route Summary</p>
          <h2>추천 방문 순서</h2>
        </div>

        <div className="summary-metrics">
          <div>
            <span>예상 거리</span>
            <strong>{formatDistance(routeSummary.totalDistance)}</strong>
          </div>
          <div>
            <span>도보 추정</span>
            <strong>{formatMinutes(routeSummary.totalMinutes)}</strong>
          </div>
        </div>
      </div>

      <div className="route-list">
        {optimizedRoute.length ? (
          optimizedRoute.map((place, index) => {
            const from = index === 0 ? currentLocation : optimizedRoute[index - 1]
            const segmentDistance = from ? getDistanceMeters(from, place) : 0

            return (
              <article key={place.id} className="route-item">
                <div className="route-index">{index + 1}</div>
                <div className="route-content">
                  <strong>{place.name}</strong>
                  <span>
                    이전 지점에서 {formatDistance(segmentDistance)} / 약{' '}
                    {formatMinutes(estimateWalkingMinutes(segmentDistance))}
                  </span>
                </div>

                {from ? (
                  <a href={getSegmentGuideUrl(from, place)} target="_blank" rel="noreferrer">
                    카카오 길안내
                  </a>
                ) : (
                  <span className="chip">출발점</span>
                )}
              </article>
            )
          })
        ) : (
          <p className="empty-text">
            장소를 1곳 이상 추가하면 추천 방문 순서와 이동 링크가 표시됩니다.
          </p>
        )}
      </div>
    </>
  )
}

export default RoutePanel
