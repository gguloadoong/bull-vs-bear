import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameActions } from './hooks/useGameActions'
import { getTodayAssets, type Asset } from './data/mockAssets'
import { getTodayDate } from './store/gameStore'
import AssetCard from './components/AssetCard'
import AssetStatusCard from './components/AssetStatusCard'
import StreakBadge from './components/StreakBadge'
import SelectionConfirmModal from './components/SelectionConfirmModal'
import TodayCompleted from './components/TodayCompleted'

const todayAssets = getTodayAssets()
const todayDate = getTodayDate()

export default function App() {
  const navigate = useNavigate()
  const { gameState, todaySelection, selectAsset } = useGameActions()
  const [pendingAsset, setPendingAsset] = useState<Asset | null>(null)

  const profitRate = ((gameState.virtualAsset - gameState.startAsset) / gameState.startAsset) * 100
  const profitAmount = gameState.virtualAsset - gameState.startAsset

  const handleAssetClick = (asset: Asset) => {
    if (!todaySelection) {
      setPendingAsset(asset)
    }
  }

  const handleConfirm = () => {
    if (pendingAsset) {
      selectAsset(pendingAsset)
      setPendingAsset(null)
    }
  }

  const handleCancel = () => {
    setPendingAsset(null)
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 pt-8 pb-4"
      >
        <div>
          <h1 className="text-xl font-bold text-white">돈키우기 <span className="text-lime-400">💰</span></h1>
          <p className="text-white/40 text-xs mt-0.5">매일 30초 가상 투자</p>
        </div>
        <StreakBadge streak={gameState.streak} />
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-4 pb-8 space-y-4">
        <AssetStatusCard
          virtualAsset={gameState.virtualAsset}
          startAsset={gameState.startAsset}
          profitRate={profitRate}
          profitAmount={profitAmount}
        />

        {todaySelection ? (
          <TodayCompleted selection={todaySelection} onViewResult={() => navigate('/result')} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              오늘의 투자 선택
            </h2>
            <div className="space-y-3">
              {todayAssets.map((asset, index) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  index={index}
                  todayDate={todayDate}
                  isSelected={pendingAsset?.id === asset.id}
                  isDisabled={!!todaySelection}
                  onSelect={handleAssetClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* 선택 확인 모달 */}
      <SelectionConfirmModal
        asset={pendingAsset}
        todayDate={todayDate}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* 면책 문구 */}
      <div className="px-4 pb-4 pt-2">
        <p className="text-white/20 text-xs text-center leading-relaxed">
          ⚠️ 이 서비스는 <span className="text-white/30">가상 투자 게임</span>이며 실제 투자 자문이 아닙니다.<br/>
          가상 자산은 실제 금융 상품이 아니며 실제 손익이 발생하지 않습니다.
        </p>
      </div>
    </div>
  )
}
