function HeroPanel() {
  return (
    <section className="hero-panel">
      <div>
        <p className="eyebrow">Seomyeon Route Planner</p>
        <h1>소품샵 동선을 가장 덜 헤매는 순서로 정리해보세요.</h1>
        <p className="hero-copy">
          카카오맵 위에서 장소를 추가하면 현재 위치를 기준으로 방문 순서를 최적화하고,
          각 구간별 카카오 길안내 링크까지 바로 열 수 있게 구성한  웹앱입니다.
        </p>
      </div>

      <div className="hero-card">
        <strong>이렇게 사용하면 됩니다</strong>
        <p>1. 검색하거나 지도 클릭으로 장소 담기</p>
        <p>2. 현재 위치 기준으로 추천 순서 확인하기</p>
        <p>3. 각 구간의 카카오 길안내 열기</p>
      </div>
    </section>
  )
}

export default HeroPanel
