import { atomWithStorage } from 'jotai/utils'

export interface Selection {
  date: string           // YYYY-MM-DD
  assetId: string
  assetName: string
  resultRate?: number    // 결과 수익률 % (다음날 공개)
  resolved: boolean      // 결과 공개 여부
}

export interface GameState {
  virtualAsset: number
  startAsset: number
  streak: number
  selections: Selection[]
}

const INITIAL_STATE: GameState = {
  virtualAsset: 10000,
  startAsset: 10000,
  streak: 0,
  selections: [],
}

// localStorage에 자동 저장/복원
export const gameStateAtom = atomWithStorage<GameState>('grow-money-state', INITIAL_STATE)

// 오늘 날짜 (YYYY-MM-DD) - 로컬 시간 기준 (KST 대응)
export function getTodayDate(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 오늘 선택 여부 확인
export function getTodaySelection(state: GameState): Selection | undefined {
  const today = getTodayDate()
  return state.selections.find(s => s.date === today)
}
