import { motion } from 'framer-motion'
import type { Asset } from '../data/mockAssets'
import { getAssetTodayRate } from '../data/mockAssets'
import { formatRate, formatRateClass } from '../utils/format'

interface Props {
  asset: Asset
  index: number
  todayDate: string
  isSelected?: boolean
  isDisabled?: boolean
  onSelect?: (asset: Asset) => void
}

export default function AssetCard({ asset, index, todayDate, isSelected, isDisabled, onSelect }: Props) {
  const todayRate = getAssetTodayRate(asset.id, todayDate)

  const handleClick = () => {
    if (!isDisabled && onSelect) {
      onSelect(asset)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index + 0.4 }}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      onClick={handleClick}
      className={`
        rounded-xl p-4 flex items-center gap-4 transition-all duration-200
        ${isSelected
          ? 'bg-lime-400/20 border border-lime-400/60'
          : isDisabled
            ? 'glass opacity-50 cursor-not-allowed'
            : 'glass-bright cursor-pointer hover:border-lime-400/30'
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
        ${isSelected ? 'bg-lime-400/20' : 'bg-white/10'}
      `}>
        {asset.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-bold text-white text-sm">{asset.name}</p>
          <div className="flex items-center gap-2">
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lime-400 text-xs font-bold bg-lime-400/20 px-2 py-0.5 rounded-full"
              >
                선택됨
              </motion.span>
            )}
            <span className={`font-bold text-sm ${formatRateClass(todayRate)}`}>
              {formatRate(todayRate)}
            </span>
          </div>
        </div>
        <p className="text-white/40 text-xs mt-0.5 truncate">{asset.description}</p>
      </div>
    </motion.div>
  )
}
