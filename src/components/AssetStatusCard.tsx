import { motion } from 'framer-motion'
import { formatKRW, formatRate, formatRateClass } from '../utils/format'

interface Props {
  virtualAsset: number
  startAsset: number
  profitRate: number
  profitAmount: number
}

export default function AssetStatusCard({ virtualAsset, profitRate, profitAmount }: Props) {
  const isProfit = profitAmount >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-5"
    >
      <p className="text-white/50 text-xs mb-1">내 가상 자산</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatKRW(virtualAsset)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-lg font-bold ${formatRateClass(profitRate)}`}>
              {formatRate(profitRate)}
            </span>
            <span className={`text-sm ${formatRateClass(profitAmount)}`}>
              ({isProfit ? '+' : ''}{formatKRW(Math.abs(profitAmount))})
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-black ${profitRate >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
            {profitRate >= 0 ? '↗' : '↘'}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/30 text-xs">시작 자산: 10,000원 (가상)</p>
      </div>
    </motion.div>
  )
}
