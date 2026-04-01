import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { feedVotesAtom, getFeedVoteKey } from '../store/feedStore'
import { getSimulatedChange, getFeedCommunityPercent } from '../data/mockBattles'
import type { BattleTopic } from '../data/mockBattles'

interface Props {
  topic: BattleTopic
  date: string
  hour: number
  index: number
}

export default function MarketFeedCard({ topic, date, hour, index }: Props) {
  const [feedVotes, setFeedVotes] = useAtom(feedVotesAtom)
  const voteKey = getFeedVoteKey(topic.id, date)
  const myVote = feedVotes[voteKey] ?? null
  const priceChange = getSimulatedChange(topic.id, date, hour)
  const isUp = priceChange >= 0
  const communityBull = getFeedCommunityPercent(topic.id, date)
  const communityBear = 100 - communityBull

  const handleVote = (side: 'bull' | 'bear') => {
    if (myVote) return
    setFeedVotes(prev => ({ ...prev, [voteKey]: side }))
  }

  const bullQuote = topic.bullWinReason.length > 60
    ? topic.bullWinReason.slice(0, 58) + '…'
    : topic.bullWinReason
  const bearQuote = topic.bearWinReason.length > 60
    ? topic.bearWinReason.slice(0, 58) + '…'
    : topic.bearWinReason

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{topic.emoji}</span>
          <div>
            <p className="text-white text-sm font-bold leading-tight">{topic.title}</p>
            <p className="text-white/40 text-[10px]">{topic.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p
            className="text-base font-black"
            style={{ color: isUp ? '#a8ff3e' : '#FF6B6B' }}
          >
            {isUp ? '+' : ''}{priceChange}%
          </p>
          <p className="text-white/30 text-[10px]">{isUp ? '▲ 강세' : '▼ 약세'}</p>
        </div>
      </div>

      {/* AI Quotes */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div
          className="rounded-xl px-3 py-2"
          style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)' }}
        >
          <span className="text-[10px] font-bold mr-1" style={{ color: '#FF8C42' }}>🐂</span>
          <span className="text-[11px]" style={{ color: '#FFAA88' }}>{bullQuote}</span>
        </div>
        <div
          className="rounded-xl px-3 py-2"
          style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.2)' }}
        >
          <span className="text-[10px] font-bold mr-1" style={{ color: '#4A90D9' }}>🐻</span>
          <span className="text-[11px]" style={{ color: '#88BBEE' }}>{bearQuote}</span>
        </div>
      </div>

      {/* Vote */}
      {!myVote ? (
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleVote('bull')}
            className="flex-1 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(255,77,77,0.2)', color: '#FF8C42', border: '1px solid rgba(255,77,77,0.3)' }}
          >
            🐂 강세
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleVote('bear')}
            className="flex-1 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(74,144,217,0.2)', color: '#4A90D9', border: '1px solid rgba(74,144,217,0.3)' }}
          >
            🐻 약세
          </motion.button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span style={{ color: '#FF8C42' }} className="font-bold">🐂 {communityBull}%</span>
            <span style={{ color: myVote === 'bull' ? '#FF8C42' : '#4A90D9' }} className="font-bold text-[10px]">
              내 선택: {myVote === 'bull' ? '강세 🐂' : '약세 🐻'}
            </span>
            <span style={{ color: '#4A90D9' }} className="font-bold">{communityBear}% 🐻</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${communityBull}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg,#FF4D4D,#FF8C42)', height: '100%' }}
            />
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${communityBear}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg,#4A90D9,#1A4A8A)', height: '100%' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
