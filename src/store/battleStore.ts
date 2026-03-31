import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export type Side = 'bull' | 'bear'

export interface DailyVote {
  date: string   // YYYY-MM-DD
  side: Side
  correct?: boolean  // 결과 나온 후 채움
}

export interface BattleState {
  streak: number          // 연속 정답 수
  votes: DailyVote[]      // 투표 히스토리
}

const INITIAL_STATE: BattleState = {
  streak: 0,
  votes: [],
}

function isValidBattleState(val: unknown): val is BattleState {
  if (typeof val !== 'object' || val === null) return false
  const obj = val as Record<string, unknown>
  return (
    typeof obj.streak === 'number' &&
    Array.isArray(obj.votes) &&
    obj.votes.every(
      (v: unknown) =>
        typeof v === 'object' &&
        v !== null &&
        typeof (v as Record<string, unknown>).date === 'string' &&
        ((v as Record<string, unknown>).side === 'bull' ||
          (v as Record<string, unknown>).side === 'bear'),
    )
  )
}

const safeStorage = createJSONStorage<BattleState>(() => localStorage)
const originalGetItem = safeStorage.getItem.bind(safeStorage)
safeStorage.getItem = (key: string, initialValue: BattleState) => {
  const raw = originalGetItem(key, initialValue)
  return isValidBattleState(raw) ? raw : initialValue
}

export const battleStateAtom = atomWithStorage<BattleState>(
  'bull-vs-bear-state',
  INITIAL_STATE,
  safeStorage,
)

export function getTodayDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function getTodayVote(state: BattleState): DailyVote | undefined {
  return state.votes.find(v => v.date === getTodayDate())
}

export function getYesterdayDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function getYesterdayVote(state: BattleState): DailyVote | undefined {
  return state.votes.find(v => v.date === getYesterdayDate())
}
