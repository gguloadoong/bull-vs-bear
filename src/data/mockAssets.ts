export interface Asset {
  id: string
  name: string
  nameEn: string
  emoji: string
  description: string
  category: 'stock' | 'bond' | 'commodity' | 'crypto'
  baseVolatility: number  // 기본 변동성 (%)
}

export const MOCK_ASSETS: Asset[] = [
  { id: 'samsung', name: '삼성전자', nameEn: 'Samsung Electronics', emoji: '📱', description: '국내 최대 반도체·가전 기업', category: 'stock', baseVolatility: 2.5 },
  { id: 'sk-hynix', name: 'SK하이닉스', nameEn: 'SK Hynix', emoji: '💾', description: '세계 2위 메모리 반도체', category: 'stock', baseVolatility: 3.2 },
  { id: 'kakao', name: '카카오', nameEn: 'Kakao Corp', emoji: '💬', description: '국내 대표 IT 플랫폼 기업', category: 'stock', baseVolatility: 3.8 },
  { id: 'hyundai', name: '현대차', nameEn: 'Hyundai Motor', emoji: '🚗', description: '글로벌 전기차 확장 선도', category: 'stock', baseVolatility: 2.1 },
  { id: 'us-bond', name: '미국채 10년', nameEn: 'US Treasury 10Y', emoji: '🏛️', description: '세계에서 가장 안전한 자산', category: 'bond', baseVolatility: 0.4 },
  { id: 'kr-bond', name: '국고채 3년', nameEn: 'KR Gov Bond 3Y', emoji: '🇰🇷', description: '한국 정부 발행 안전 채권', category: 'bond', baseVolatility: 0.3 },
  { id: 'gold', name: '금 (Gold)', nameEn: 'Gold Spot', emoji: '🥇', description: '전통적 인플레이션 헤지 자산', category: 'commodity', baseVolatility: 1.2 },
  { id: 'oil', name: '원유 (WTI)', nameEn: 'WTI Crude Oil', emoji: '🛢️', description: '글로벌 경기 선행 지표', category: 'commodity', baseVolatility: 3.5 },
]

// 날짜 + 자산 기반 오늘 변동률 계산 (재현 가능한 mock)
export function getAssetTodayRate(assetId: string, date: string): number {
  const combinedStr = date + assetId + 'rate'
  const seed = combinedStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const asset = MOCK_ASSETS.find(a => a.id === assetId)
  const volatility = asset?.baseVolatility ?? 2
  return Math.round(((seed % 100) - 50) / 100 * volatility * 2 * 100) / 100
}

// 매일 3개 자산 선별 (날짜 기반 seed)
export function getTodayAssets(): Asset[] {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  // Fisher-Yates shuffle with seed
  const arr = [...MOCK_ASSETS]
  let currentSeed = seed
  for (let i = arr.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(currentSeed) % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, 3)
}
