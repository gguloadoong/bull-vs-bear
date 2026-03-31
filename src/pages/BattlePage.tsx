import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { battleStateAtom, getTodayDate, getTodayVote } from '../store/battleStore'
import { getTodayBattle } from '../data/mockBattles'
import BattleArena from '../components/BattleArena'
import type { Side } from '../store/battleStore'

export default function BattlePage() {
  const navigate = useNavigate()
  const [battleState, setBattleState] = useAtom(battleStateAtom)

  const today = getTodayDate()
  const todayVote = getTodayVote(battleState)
  const alreadyVoted = !!todayVote

  const battle = getTodayBattle(today)
  const { topic, rounds, communityBullPercent } = battle

  const bullArguments = rounds.filter(r => r.side === 'bull').map(r => r.text)
  const bearArguments = rounds.filter(r => r.side === 'bear').map(r => r.text)

  const handleVote = (side: Side) => {
    setBattleState(prev => ({
      ...prev,
      votes: [...prev.votes.filter(v => v.date !== today), { date: today, side }],
    }))
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 pt-8 pb-4"
      >
        <div>
          <h1 className="text-lg font-bold text-white">⚔️ 오늘의 배틀</h1>
          <p className="text-white/40 text-xs">황소 vs 곰 — 누가 맞을까?</p>
        </div>
        <div className="flex items-center gap-2">
          {battleState.streak >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,140,66,0.12)',
                border: '1px solid rgba(255,140,66,0.3)',
              }}
            >
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold" style={{ color: '#FF8C42' }}>
                {battleState.streak}연승 중
              </span>
            </motion.div>
          )}
          {alreadyVoted && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-xs font-bold px-2 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30"
            >
              ✅ 참여완료
            </motion.span>
          )}
        </div>
      </motion.header>

      <main className="flex-1 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BattleArena
            ticker={topic.emoji + ' ' + topic.id.toUpperCase()}
            tickerName={topic.title}
            bullArguments={bullArguments}
            bearArguments={bearArguments}
            bullReasons={[topic.bullWinReason, ...bullArguments.slice(0, 2)]}
            bearReasons={[topic.bearWinReason, ...bearArguments.slice(0, 2)]}
            initialBullPercent={communityBullPercent}
            alreadyVoted={alreadyVoted ? (todayVote?.side ?? null) : null}
            onVote={handleVote}
          />
        </motion.div>

        {alreadyVoted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <button
              onClick={() => navigate('/result')}
              className="text-lime-400/60 text-xs underline"
            >
              어제 결과 보기 →
            </button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
