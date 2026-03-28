import { useAtom } from 'jotai'
import { gameStateAtom, getTodayDate, getTodaySelection } from '../store/gameStore'
import { MOCK_ASSETS, type Asset } from '../data/mockAssets'

export function useGameActions() {
  const [gameState, setGameState] = useAtom(gameStateAtom)
  const todaySelection = getTodaySelection(gameState)

  function selectAsset(asset: Asset) {
    // 이미 오늘 선택했으면 무시
    if (todaySelection) return

    const today = getTodayDate()

    setGameState(prev => {
      // 마지막 선택이 어제이면 streak 유지, 아니면 1로 리셋
      const lastSelection = prev.selections[prev.selections.length - 1]
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const y = yesterday
      const yesterdayStr = `${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,'0')}-${String(y.getDate()).padStart(2,'0')}`

      const newStreak = lastSelection?.date === yesterdayStr
        ? prev.streak + 1
        : 1

      return {
        ...prev,
        streak: newStreak,
        selections: [
          ...prev.selections,
          {
            date: today,
            assetId: asset.id,
            assetName: asset.name,
            resolved: false,
          }
        ]
      }
    })
  }

  function resolveResult(date: string, assetId: string) {
    setGameState(prev => {
      const selectionIndex = prev.selections.findIndex(s => s.date === date)
      if (selectionIndex === -1 || prev.selections[selectionIndex].resolved) return prev

      // 날짜 + 자산 ID 기반 seed (자산별 다른 결과)
      const combinedStr = date + assetId
      const seed = combinedStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

      // 자산별 변동성: MOCK_ASSETS.baseVolatility 단일 소스
      const assetDef = MOCK_ASSETS.find(a => a.id === assetId)
      const volatility = assetDef?.baseVolatility ?? 2
      const resultRate = ((seed % 100) - 50) / 100 * volatility * 2  // -volatility ~ +volatility

      const newSelections = [...prev.selections]
      newSelections[selectionIndex] = {
        ...newSelections[selectionIndex],
        resultRate,
        resolved: true,
      }

      const newAsset = Math.round(prev.virtualAsset * (1 + resultRate / 100))

      return {
        ...prev,
        virtualAsset: newAsset,
        selections: newSelections,
      }
    })
  }

  return { gameState, todaySelection, selectAsset, resolveResult }
}
