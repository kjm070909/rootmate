function SearchPanel({
  currentLocation,
  mapReady,
  onAddPlace,
  onMoveToCurrentLocation,
  onRemovePlace,
  onResetPlaces,
  onSearchKeywordChange,
  onSubmit,
  places,
  searchKeyword,
  searchResults,
  searching,
}) {
  return (
    <aside className="control-panel">
      <form className="search-box" onSubmit={onSubmit}>
        <label htmlFor="keyword">장소 검색</label>
        <div className="search-row">
          <input
            id="keyword"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="예: 서면 소품샵, 전포 편집샵"
          />
          <button type="submit" disabled={!mapReady || searching}>
            {searching ? '검색중' : '검색'}
          </button>
        </div>
      </form>

      <div className="panel-block">
        <div className="panel-title">
          <h2>검색 결과</h2>
          <span>{searchResults.length}곳</span>
        </div>

        <div className="result-list">
          {searchResults.length ? (
            searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                className="place-card"
                onClick={() => onAddPlace(result)}
              >
                <strong>{result.name}</strong>
                <span>{result.address}</span>
              </button>
            ))
          ) : (
            <p className="empty-text">검색 후 장소를 눌러 경유지 목록에 추가하세요.</p>
          )}
        </div>
      </div>

      <div className="panel-block">
        <div className="panel-title">
          <h2>선택한 장소</h2>
          <span>{places.length}곳</span>
        </div>

        <div className="action-row">
          <button type="button" onClick={onMoveToCurrentLocation} disabled={!currentLocation}>
            현재 위치로 이동
          </button>
          <button type="button" className="ghost" onClick={onResetPlaces} disabled={!places.length}>
            전체 초기화
          </button>
        </div>

        <p className="helper-text">
          지도 클릭으로도 장소를 추가할 수 있습니다. 현재 구현의 최적화는 직선 거리 기준
          추천이며, 실제 길찾기는 아래 카카오 링크에서 이어집니다.
        </p>

        <div className="selected-list">
          {places.length ? (
            places.map((place) => (
              <article key={place.id} className="selected-item">
                <div>
                  <strong>{place.name}</strong>
                  <span>
                    {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
                  </span>
                </div>
                <button type="button" className="delete" onClick={() => onRemovePlace(place.id)}>
                  삭제
                </button>
              </article>
            ))
          ) : (
            <p className="empty-text">아직 추가된 장소가 없습니다.</p>
          )}
        </div>
      </div>
    </aside>
  )
}

export default SearchPanel
