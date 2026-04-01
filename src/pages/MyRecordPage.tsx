import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { battleStateAtom, getTodayDate } from '../store/battleStore'
import { getTodayBattle } from '../data/mockBattles'

export default function MyRecordPage() {
  const battleState = useAtomValue(battleStateAtom)
  const today = getTodayDate()

  const votesWithResult = battleState.votes.filter(v => v.correct !== undefined)
  const correctCount = votesWithResult.filter(v => v.correct).length
  const accuracyPct = votesWithResult.length > 0
    ? Math.round((correctCount / votesWithResult.length) * 100)
    : null

  const allVotes = [...battleState.votes].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="min-h-screen bg-navy-gradient pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-8 pb-3"
      >
        <h1 className="text-lg font-bold text-white">👤 내 기록</h1>
        <p className="text-white/40 text-xs">나의 예측 히스토리</p>
      </motion.div>

      {allVotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center px-8 pt-20 gap-4"
        >
          <span className="text-6xl">🎯</span>
          <p className="text-white/50 text-center text-sm leading-relaxed">
            아직 참여 기록이 없어요.<br />배틀에 참여해보세요!
          </p>
        </motion.div>
      ) : (
        <div className="px-4 flex flex-col gap-4">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <p className="text-white/50 text-xs mb-3 text-center">📊 나의 예측 통계</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '적중률', value: accuracyPct !== null ? `${accuracyPct}%` : '-' },
                { label: '맞춘 횟수', value: String(correctCount) },
                { label: '총 참여', value: String(allVotes.length) },
                { label: '🔥 연승', value: String(battleState.streak) },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-white font-black text-lg leading-tight">{stat.value}</p>
                  <p className="text-white/30 text-[9px] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* History list */}
          <div className="flex flex-col gap-2">
            {allVotes.map((vote, i) => {
              const battle = getTodayBattle(vote.date)
              const isToday = vote.date === today
              const resultKnown = vote.correct !== undefined

              return (
                <motion.div
                  key={vote.date}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl px-3 py-2.5 flex items-center justify-between"
                  style={{
                    background: vote.correct === true
                      ? 'rgba(168,255,62,0.06)'
                      : vote.correct === false
                      ? 'rgba(255,107,107,0.06)'
                      : 'rgba(255,255,255,0.04)',
                    border: vote.correct === true
                      ? '1px solid rgba(168,255,62,0.2)'
                      : vote.correct === false
                      ? '1px solid rgba(255,107,107,0.2)'
                      : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{battle.topic.emoji}</span>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">{battle.topic.title}</p>
                      <p className="text-white/30 text-[10px]">{vote.date}{isToday ? ' (오늘)' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: vote.side === 'bull' ? 'rgba(255,77,77,0.2)' : 'rgba(74,144,217,0.2)',
                        color: vote.side === 'bull' ? '#FF8C42' : '#4A90D9',
                      }}
                    >
                      {vote.side === 'bull' ? '🐂 강세' : '🐻 약세'}
                    </span>
                    <span className="text-sm">
                      {!resultKnown ? '⏳' : vote.correct ? '✅' : '❌'}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
