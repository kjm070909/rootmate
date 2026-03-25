export function loadKakaoMapScript(appKey) {
  return new Promise((resolve, reject) => {
    if (!appKey) {
      reject(new Error('missing-app-key'))
      return
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(() => resolve(window.kakao))
      return
    }

    const existingScript = document.querySelector('script[data-kakao-map-sdk]')

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.kakao.maps.load(() => resolve(window.kakao))
      })
      existingScript.addEventListener('error', () => reject(new Error('script-load-failed')))
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
    script.async = true
    script.dataset.kakaoMapSdk = 'true'
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    script.onerror = () => reject(new Error('script-load-failed'))
    document.head.appendChild(script)
  })
}

export function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
