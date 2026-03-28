import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { useAtom } from 'jotai'
import { gameStateAtom, getTodayDate, getTodaySelection } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'
import ShareCard from '../components/ShareCard'
import { formatKRW, formatRate, formatRateClass } from '../utils/format'

export default function ResultPage() {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [gameState] = useAtom(gameStateAtom)
  const { resolveResult } = useGameActions()

  const todayDate = getTodayDate()
  const todaySelection = getTodaySelection(gameState)

  // 결과가 없으면 resolve (mock 결과 생성)
  useEffect(() => {
    if (todaySelection && !todaySelection.resolved) {
      resolveResult(todayDate, todaySelection.assetId)
    }
  }, [])

  // resolve 후 최신 상태 가져오기
  const resolvedSelection = getTodaySelection(gameState)
  const resultRate = resolvedSelection?.resultRate ?? 0
  const profitRate = ((gameState.virtualAsset - gameState.startAsset) / gameState.startAsset) * 100

  // Mock 상위 % (결과율 기반)
  const topPercent = Math.max(1, Math.min(99, Math.round(50 - resultRate * 5)))

  // 홈에서 오지 않은 경우 (선택이 없으면 홈으로)
  if (!todaySelection && !resolvedSelection) {
    navigate('/')
    return null
  }

  const handleShare = async () => {
    if (!cardRef.current || isCapturing) return
    setIsCapturing(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })

      // Web Share API 시도
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'grow-money-result.png', { type: 'image/png' })
        await navigator.share({
          title: '돈키우기 결과 공유',
          text: `오늘 투자 결과: ${formatRate(resultRate)} 수익! 상위 ${topPercent}%`,
          files: [file],
        })
      } else {
        // fallback: 다운로드
        const link = document.createElement('a')
        link.download = 'grow-money-result.png'
        link.href = dataUrl
        link.click()
      }
    } catch (err) {
      console.error('Share failed:', err)
    } finally {
      setIsCapturing(false)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current || isCapturing) return
    setIsCapturing(true)
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'grow-money-result.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center px-4 pt-8 pb-4"
      >
        <button onClick={() => navigate('/')} className="text-white/60 mr-3 text-xl">←</button>
        <h1 className="text-lg font-bold text-white">오늘의 결과</h1>
      </motion.header>

      <main className="flex-1 px-4 pb-8 space-y-4">
        {/* 결과 요약 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 text-center"
        >
          <p className="text-white/50 text-sm mb-2">
            {resolvedSelection?.assetName ?? ''} 투자 결과
          </p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2, damping: 10 }}
            className={`text-5xl font-black mb-2 ${formatRateClass(resultRate)}`}
          >
            {formatRate(resultRate)}
          </motion.p>
          <p className="text-white/40 text-sm">
            누적 수익률: <span className={formatRateClass(profitRate)}>{formatRate(profitRate)}</span>
          </p>
          <p className="text-white/40 text-sm">
            현재 자산: <span className="text-white font-bold">{formatKRW(gameState.virtualAsset)}</span>
          </p>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-yellow-400 font-bold">🏆 상위 {topPercent}%</p>
          </div>
        </motion.div>

        {/* 공유 카드 프리뷰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="scale-[0.85] origin-top">
            <ShareCard
              ref={cardRef}
              assetName={resolvedSelection?.assetName ?? ''}
              resultRate={resultRate}
              virtualAsset={gameState.virtualAsset}
              startAsset={gameState.startAsset}
              streak={gameState.streak}
              topPercent={topPercent}
            />
          </div>
        </motion.div>

        {/* 공유 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            disabled={isCapturing}
            className="w-full py-4 rounded-2xl bg-lime-400 text-navy-900 font-bold text-base disabled:opacity-50"
          >
            {isCapturing ? '카드 생성 중...' : '📤 카드 공유하기'}
          </motion.button>
          <button
            onClick={handleDownload}
            disabled={isCapturing}
            className="w-full py-3 rounded-2xl glass border border-white/20 text-white/70 font-medium text-sm"
          >
            💾 이미지 저장
          </button>
        </motion.div>

        {/* 홈으로 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/')}
          className="w-full py-3 text-white/40 text-sm"
        >
          홈으로 돌아가기
        </motion.button>
      </main>
    </div>
  )
}
