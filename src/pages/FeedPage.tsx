import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { getHotTopics, getFeedCommunityPercent } from '../data/mockBattles'
import { getTodayDate } from '../store/battleStore'
import { feedVotesAtom } from '../store/feedStore'
import MarketFeedCard from '../components/MarketFeedCard'

export default function FeedPage() {
  const today = getTodayDate()
  const [hour, setHour] = useState(new Date().getHours())
  const feedVotes = useAtomValue(feedVotesAtom)

  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60000)
    return () => clearInterval(id)
  }, [])

  const hotTopics = useMemo(() => getHotTopics(today, 10), [today])

  const overallBull = useMemo(() => {
    const avg = hotTopics.reduce((sum, t) => sum + getFeedCommunityPercent(t.id, today), 0) / hotTopics.length
    return Math.round(avg)
  }, [hotTopics, today])
  const isBullish = overallBull >= 50

  const votedCount = hotTopics.filter(t =>
    feedVotes[`${t.id}_${today}`]
  ).length

  return (
    <div className="min-h-screen bg-navy-gradient pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-8 pb-3"
      >
        <h1 className="text-lg font-bold text-white">📊 실시간 시황</h1>
        <p className="text-white/40 text-xs">언제든 참여하는 종목별 강세/약세</p>
      </motion.div>

      {/* Overall sentiment banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mb-4 rounded-2xl p-3 flex items-center justify-between"
        style={{
          background: isBullish ? 'rgba(255,140,66,0.1)' : 'rgba(74,144,217,0.1)',
          border: `1px solid ${isBullish ? 'rgba(255,140,66,0.3)' : 'rgba(74,144,217,0.3)'}`,
        }}
      >
        <div>
          <p className="text-xs font-bold" style={{ color: isBullish ? '#FF8C42' : '#4A90D9' }}>
            {isBullish ? '🐂 강세론 우세' : '🐻 약세론 우세'}
          </p>
          <p className="text-white/40 text-[10px]">커뮤니티 전체 감성 지수</p>
        </div>
        <div className="text-right">
          <p className="font-black text-xl" style={{ color: isBullish ? '#FF8C42' : '#4A90D9' }}>
            {isBullish ? overallBull : 100 - overallBull}%
          </p>
          <p className="text-white/30 text-[10px]">{votedCount}/{hotTopics.length} 참여</p>
        </div>
      </motion.div>

      {/* Feed */}
      <div className="px-4 flex flex-col gap-3">
        {hotTopics.map((topic, i) => (
          <MarketFeedCard
            key={topic.id}
            topic={topic}
            date={today}
            hour={hour}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
