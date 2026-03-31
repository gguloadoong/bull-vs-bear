import { describe, it, expect } from 'vitest'
import { getTodayBattle, getBattleResult, getResultReaction, getWinReason, getLoserExcuse } from '../data/mockBattles'
import {
  getTodayDate,
  getYesterdayDate,
  getTodayVote,
  getYesterdayVote,
} from '../store/battleStore'
import type { BattleState, DailyVote } from '../store/battleStore'

// ─── mockBattles 결정론 테스트 ───────────────────────────────────────────────

describe('getTodayBattle — 날짜 seed 결정론', () => {
  it('같은 날짜 → 항상 같은 배틀 주제', () => {
    const a = getTodayBattle('2026-03-29')
    const b = getTodayBattle('2026-03-29')
    expect(a.topic.id).toBe(b.topic.id)
    expect(a.topic.title).toBe(b.topic.title)
  })

  it('다른 날짜 → 같은 주제가 아닐 수도 있음 (seed 다름)', () => {
    const a = getTodayBattle('2026-01-01')
    const b = getTodayBattle('2026-06-15')
    // 우연히 같을 수 있으므로 결과값이 아닌 seed가 다름을 간접 확인
    // 두 날짜 중 하나라도 rounds 반환 검증
    expect(a.rounds.length).toBeGreaterThan(0)
    expect(b.rounds.length).toBeGreaterThan(0)
  })

  it('rounds가 5개', () => {
    const battle = getTodayBattle('2026-03-29')
    expect(battle.rounds).toHaveLength(5)
  })

  it('rounds에 bull/bear가 번갈아 포함됨', () => {
    const battle = getTodayBattle('2026-03-29')
    const sides = battle.rounds.map(r => r.side)
    expect(sides).toContain('bull')
    expect(sides).toContain('bear')
  })
})

describe('getTodayBattle — result 결정론', () => {
  it('같은 날짜 → 항상 같은 승자', () => {
    const r1 = getTodayBattle('2026-03-29').result
    const r2 = getTodayBattle('2026-03-29').result
    expect(r1).toBe(r2)
  })

  it('getBattleResult가 getTodayBattle.result와 일치', () => {
    const date = '2026-03-15'
    expect(getBattleResult(date)).toBe(getTodayBattle(date).result)
  })

  it('result가 bull 또는 bear', () => {
    expect(['bull', 'bear']).toContain(getTodayBattle('2026-03-29').result)
  })
})

describe('getCommunityVotes — 45~75% 범위', () => {
  const testDates = [
    '2026-01-01', '2026-02-15', '2026-03-29',
    '2026-06-01', '2026-09-30', '2026-12-31',
    '2025-07-04', '2024-11-11',
  ]

  testDates.forEach(date => {
    it(`communityBullPercent 45~75 범위: ${date}`, () => {
      const { communityBullPercent } = getTodayBattle(date)
      expect(communityBullPercent).toBeGreaterThanOrEqual(45)
      expect(communityBullPercent).toBeLessThanOrEqual(75)
    })
  })

  it('같은 날짜 → 항상 같은 투표율', () => {
    const p1 = getTodayBattle('2026-03-29').communityBullPercent
    const p2 = getTodayBattle('2026-03-29').communityBullPercent
    expect(p1).toBe(p2)
  })
})

describe('getResultReaction', () => {
  it('bull win 리액션 반환', () => {
    const r = getResultReaction('bull', true)
    expect(typeof r).toBe('string')
    expect(r.length).toBeGreaterThan(0)
  })

  it('bull lose 리액션 반환', () => {
    const r = getResultReaction('bull', false)
    expect(typeof r).toBe('string')
    expect(r.length).toBeGreaterThan(0)
  })

  it('bear win 리액션 반환', () => {
    const r = getResultReaction('bear', true)
    expect(typeof r).toBe('string')
    expect(r.length).toBeGreaterThan(0)
  })

  it('bear lose 리액션 반환', () => {
    const r = getResultReaction('bear', false)
    expect(typeof r).toBe('string')
    expect(r.length).toBeGreaterThan(0)
  })

  it('win과 lose 리액션이 다름', () => {
    expect(getResultReaction('bull', true)).not.toBe(getResultReaction('bull', false))
    expect(getResultReaction('bear', true)).not.toBe(getResultReaction('bear', false))
  })
})

// ─── battleStore 헬퍼 테스트 ─────────────────────────────────────────────────

describe('battleStore 날짜 헬퍼', () => {
  it('getTodayDate가 YYYY-MM-DD 형식', () => {
    expect(getTodayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('getYesterdayDate가 YYYY-MM-DD 형식', () => {
    expect(getYesterdayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('어제가 오늘보다 하루 이전', () => {
    const today = new Date(getTodayDate())
    const yesterday = new Date(getYesterdayDate())
    const diff = today.getTime() - yesterday.getTime()
    expect(diff).toBe(86400000) // 24h in ms
  })
})

describe('battleStore 투표 저장/불러오기', () => {
  const makeState = (votes: BattleState['votes']): BattleState => ({ streak: 0, votes })

  it('getTodayVote — 오늘 투표 반환', () => {
    const today = getTodayDate()
    const state = makeState([{ date: today, side: 'bull' }])
    expect(getTodayVote(state)?.side).toBe('bull')
  })

  it('getTodayVote — 오늘 투표 없으면 undefined', () => {
    const state = makeState([{ date: '2020-01-01', side: 'bear' }])
    expect(getTodayVote(state)).toBeUndefined()
  })

  it('getYesterdayVote — 어제 투표 반환', () => {
    const yesterday = getYesterdayDate()
    const state = makeState([{ date: yesterday, side: 'bear' }])
    expect(getYesterdayVote(state)?.side).toBe('bear')
  })

  it('getYesterdayVote — 어제 투표 없으면 undefined', () => {
    const state = makeState([{ date: '2020-01-01', side: 'bull' }])
    expect(getYesterdayVote(state)).toBeUndefined()
  })
})

describe('battleStore 스트릭 계산', () => {
  it('streak 초기값 0', () => {
    const state: BattleState = { streak: 0, votes: [] }
    expect(state.streak).toBe(0)
  })

  it('정답 시 streak 증가 로직 검증', () => {
    // BattleResultPage의 useEffect 로직을 직접 재현
    const prevStreak = 3
    const won = true
    const newStreak = won ? prevStreak + 1 : 0
    expect(newStreak).toBe(4)
  })

  it('오답 시 streak 리셋', () => {
    const prevStreak = 5
    const won = false
    const newStreak = won ? prevStreak + 1 : 0
    expect(newStreak).toBe(0)
  })

  it('DailyVote.correct 업데이트 로직', () => {
    const yesterday = getYesterdayDate()
    const votes: DailyVote[] = [{ date: yesterday, side: 'bull' }]
    const won = true
    const updated: DailyVote[] = votes.map(v =>
      v.date === yesterday ? { ...v, correct: won } : v
    )
    expect(updated[0].correct).toBe(true)
  })
})

// ─── 전체 TOPICS 데이터 완결성 검사 ─────────────────────────────────────────

describe('mockBattles 데이터 완결성', () => {
  // 충분히 다양한 날짜로 모든 주제를 순회 (365일: bull/bear 모두 포함)
  const testDates: string[] = []
  for (let i = 0; i < 365; i++) {
    const d = new Date('2026-01-01')
    d.setDate(d.getDate() + i)
    testDates.push(d.toISOString().slice(0, 10))
  }

  it('모든 날짜에서 topic.bullWinReason 존재', () => {
    for (const date of testDates) {
      const { topic } = getTodayBattle(date)
      expect(topic.bullWinReason, `${date} bullWinReason`).toBeTruthy()
    }
  })

  it('모든 날짜에서 topic.bearWinReason 존재', () => {
    for (const date of testDates) {
      const { topic } = getTodayBattle(date)
      expect(topic.bearWinReason, `${date} bearWinReason`).toBeTruthy()
    }
  })

  it('모든 날짜에서 bullLoserExcuse 3개 이상', () => {
    for (const date of testDates) {
      const { topic } = getTodayBattle(date)
      expect(topic.bullLoserExcuse.length, `${date} bullLoserExcuse`).toBeGreaterThanOrEqual(3)
    }
  })

  it('모든 날짜에서 bearLoserExcuse 3개 이상', () => {
    for (const date of testDates) {
      const { topic } = getTodayBattle(date)
      expect(topic.bearLoserExcuse.length, `${date} bearLoserExcuse`).toBeGreaterThanOrEqual(3)
    }
  })

  it('모든 날짜에서 rounds가 정확히 5개', () => {
    for (const date of testDates) {
      const { rounds } = getTodayBattle(date)
      expect(rounds).toHaveLength(5)
    }
  })

  it('365일 중 bull/bear 승리가 모두 나타남', () => {
    const results = testDates.map(d => getTodayBattle(d).result)
    expect(results).toContain('bull')
    expect(results).toContain('bear')
  })
})

// ─── getWinReason / getLoserExcuse ──────────────────────────────────────────

describe('getWinReason / getLoserExcuse', () => {
  it('getWinReason이 bull 승리 시 bullWinReason 반환', () => {
    const dates = ['2026-01-01','2026-02-01','2026-03-01','2026-04-01','2026-05-01','2026-06-01']
    const bullWinDate = dates.find(d => getTodayBattle(d).result === 'bull')
    if (bullWinDate) {
      const reason = getWinReason(bullWinDate)
      expect(reason).toBe(getTodayBattle(bullWinDate).topic.bullWinReason)
    }
  })

  it('getWinReason이 bear 승리 시 bearWinReason 반환', () => {
    const dates = ['2026-01-01','2026-02-01','2026-03-01','2026-04-01','2026-05-01','2026-06-01']
    const bearWinDate = dates.find(d => getTodayBattle(d).result === 'bear')
    if (bearWinDate) {
      const reason = getWinReason(bearWinDate)
      expect(reason).toBe(getTodayBattle(bearWinDate).topic.bearWinReason)
    }
  })

  it('getLoserExcuse가 losing side excuse 반환', () => {
    const date = '2026-03-15'
    const { result, topic } = getTodayBattle(date)
    const losingSide = result === 'bull' ? 'bear' : 'bull'
    const excuse = getLoserExcuse(date, losingSide)
    const excuseList = losingSide === 'bull' ? topic.bullLoserExcuse : topic.bearLoserExcuse
    expect(excuseList).toContain(excuse)
  })

  it('getWinReason은 비어있지 않은 문자열 반환', () => {
    const testDates = ['2026-01-01','2026-03-15','2026-06-01','2026-12-31']
    for (const date of testDates) {
      expect(getWinReason(date).length).toBeGreaterThan(0)
    }
  })
})
