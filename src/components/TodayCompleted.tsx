import { motion } from 'framer-motion'
import type { Selection } from '../store/gameStore'

interface Props {
  selection: Selection
  onViewResult?: () => void
}

export default function TodayCompleted({ selection, onViewResult }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-5xl mb-3"
      >
        ✅
      </motion.div>
      <h3 className="text-lg font-bold text-white mb-1">오늘 투자 완료!</h3>
      <p className="text-white/50 text-sm mb-3">
        <span className="text-lime-400 font-bold">{selection.assetName}</span>에 투자했어요
      </p>
      <div className="bg-white/5 rounded-xl p-3">
        <p className="text-white/40 text-xs">내일 결과를 확인하세요</p>
        <p className="text-yellow-400 text-sm font-bold mt-1">🌅 결과 공개 예정</p>
      </div>
      {onViewResult && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onViewResult}
          className="mt-3 w-full py-3 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-400 font-semibold text-sm"
        >
          결과 확인하기 →
        </motion.button>
      )}
    </motion.div>
  )
}
