import { atomWithStorage } from 'jotai/utils'

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

export const battleStateAtom = atomWithStorage<BattleState>('bull-vs-bear-state', INITIAL_STATE)

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
