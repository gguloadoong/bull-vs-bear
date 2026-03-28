import { motion, AnimatePresence } from 'framer-motion'
import type { Asset } from '../data/mockAssets'
import { getAssetTodayRate } from '../data/mockAssets'
import { formatRate } from '../utils/format'

interface Props {
  asset: Asset | null
  todayDate: string
  onConfirm: () => void
  onCancel: () => void
}

export default function SelectionConfirmModal({ asset, todayDate, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {asset && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
          >
            <div className="glass rounded-2xl p-6 max-w-sm mx-auto">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{asset.emoji}</div>
                <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                <p className="text-white/50 text-sm mt-1">{asset.description}</p>
                <p className="text-lime-400 font-bold mt-2">
                  오늘 예상: {formatRate(getAssetTodayRate(asset.id, todayDate))}
                </p>
              </div>

              <p className="text-white/60 text-sm text-center mb-6">
                한 번 선택하면 오늘은 변경할 수 없어요.<br/>
                <span className="text-yellow-400">정말 투자할까요?</span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-white/60 font-medium hover:bg-white/5 transition-colors"
                >
                  취소
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-xl bg-lime-400 text-slate-900 font-bold hover:bg-lime-500 transition-colors"
                >
                  투자하기 💰
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
