import { motion } from 'framer-motion'

interface Props {
  streak: number
}

export default function StreakBadge({ streak }: Props) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.2 }}
      className="flex items-center gap-1.5 bg-gold-500/20 border border-gold-400/30 rounded-full px-3 py-1.5"
    >
      <span className="text-base">🔥</span>
      <span className="text-gold-400 font-bold text-sm">{streak}일</span>
    </motion.div>
  )
}
