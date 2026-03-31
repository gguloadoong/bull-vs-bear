import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { useAtom } from 'jotai'
import { battleStateAtom, getYesterdayDate, getYesterdayVote } from '../store/battleStore'
import { getTodayBattle, getResultReaction, getWinReason, getLoserExcuse } from '../data/mockBattles'
import BullCharacter from '../components/BullCharacter'
import BearCharacter from '../components/BearCharacter'
import StreakMilestoneModal from '../components/StreakMilestoneModal'
import bullImg from '../assets/characters/bull.webp'
import bearImg from '../assets/characters/bear.webp'

export default function BattleResultPage() {
  const navigate = useNavigate()
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [shareError, setShareError] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneStreak, setMilestoneStreak] = useState(0)
  const [battleState, setBattleState] = useAtom(battleStateAtom)

  const yesterdayDate = getYesterdayDate()
  const yesterdayVote = getYesterdayVote(battleState)
  const battle = getTodayBattle(yesterdayDate)
  const { topic, result, communityBullPercent } = battle
  const communityBearPercent = 100 - communityBullPercent

  const userVotedSide = yesterdayVote?.side
  const userWon = userVotedSide === result
  const reaction = userVotedSide ? getResultReaction(userVotedSide, userWon) : null

  const winnerMood = 'winning' as const
  const loserMood = 'losing' as const

  const votesWithResult = battleState.votes.filter(v => v.correct !== undefined)
  const correctCount = votesWithResult.filter(v => v.correct).length
  const accuracyPct = votesWithResult.length > 0
    ? Math.round((correctCount / votesWithResult.length) * 100)
    : null

  useEffect(() => {
    if (!yesterdayVote || yesterdayVote.correct !== undefined) return
    const won = yesterdayVote.side === result
    const newStreak = won ? battleState.streak + 1 : 0
    setBattleState(prev => ({
      ...prev,
      streak: won ? prev.streak + 1 : 0,
      votes: prev.votes.map(v =>
        v.date === yesterdayDate ? { ...v, correct: won } : v
      ),
    }))
    if ([3, 7, 14, 30].includes(newStreak)) {
      setTimeout(() => { setMilestoneStreak(newStreak); setShowMilestone(true) }, 800)
    }
  }, [])

  const handleShare = async () => {
    if (!shareCardRef.current || isCapturing) return
    setIsCapturing(true)
    try {
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, pixelRatio: 2 })
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'bull-vs-bear-result.png', { type: 'image/png' })
        await navigator.share({ title: 'Bull vs Bear 배틀 결과', files: [file] })
      } else {
        const link = document.createElement('a')
        link.download = 'bull-vs-bear-result.png'
        link.href = dataUrl
        link.click()
      }
    } catch (err) {
      console.error('Share failed:', err)
      setShareError(true)
      setTimeout(() => setShareError(false), 3000)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 pt-8 pb-4"
      >
        <button onClick={() => navigate('/')} className="text-white/60 text-xl">←</button>
        <div>
          <h1 className="text-lg font-bold text-white">🏆 어제 배틀 결과</h1>
          <p className="text-white/40 text-xs">{yesterdayDate}</p>
        </div>
      </motion.header>

      <main className="flex-1 px-4 pb-8 flex flex-col gap-4">
        {/* 토픽 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 text-center"
        >
          <p className="text-3xl mb-1">{topic.emoji}</p>
          <p className="text-white font-bold text-base">{topic.title}</p>
          <p className="text-white/40 text-xs mt-1">{topic.subtitle}</p>
        </motion.div>

        {/* 캐릭터 결과 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 12 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-end justify-around">
            <div className="flex flex-col items-center gap-1">
              <BullCharacter mood={result === 'bull' ? winnerMood : loserMood} size={110} />
              <p className="text-xs font-bold" style={{ color: '#FF8C42' }}>
                황소 {result === 'bull' ? '🏆' : '😤'}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 pb-4">
              <p className="text-white/40 text-xs">결과</p>
              <p className="text-2xl font-black" style={{
                color: result === 'bull' ? '#FF8C42' : '#4A90D9'
              }}>
                {result === 'bull' ? '황소 승!' : '곰 승!'}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <BearCharacter mood={result === 'bear' ? winnerMood : loserMood} size={110} />
              <p className="text-xs font-bold" style={{ color: '#4A90D9' }}>
                곰 {result === 'bear' ? '🏆' : '😤'}
              </p>
            </div>
          </div>

          {/* 승자/패자 리액션 말풍선 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3 flex flex-col gap-2"
          >
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: result === 'bull' ? 'rgba(255,77,77,0.1)' : 'rgba(74,144,217,0.1)',
                border: result === 'bull' ? '1px solid rgba(255,77,77,0.25)' : '1px solid rgba(74,144,217,0.25)',
              }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: result === 'bull' ? '#FF8C42' : '#4A90D9' }}>
                {result === 'bull' ? '🐂 황소' : '🐻 곰'} 승자 한마디
              </p>
              <p className="text-xs leading-relaxed" style={{ color: result === 'bull' ? '#FFAA88' : '#88BBEE' }}>
                {getResultReaction(result, true)}
              </p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: result === 'bull' ? '#4A90D9' : '#FF8C42' }}>
                {result === 'bull' ? '🐻 곰' : '🐂 황소'} 패자 변명
              </p>
              <p className="text-xs leading-relaxed text-white/40">
                {getResultReaction(result === 'bull' ? 'bear' : 'bull', false)}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 판정 근거 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-white/50 text-xs text-center font-bold tracking-wide">⚖️ 판정 근거</p>
          {/* 승자 근거 */}
          <div
            className="rounded-xl p-3"
            style={{
              background: result === 'bull' ? 'rgba(255,140,66,0.12)' : 'rgba(74,144,217,0.12)',
              border: result === 'bull' ? '1px solid rgba(255,140,66,0.35)' : '1px solid rgba(74,144,217,0.35)',
            }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: result === 'bull' ? '#FFD700' : '#7EC8E3' }}>
              {result === 'bull' ? '🐂 황소 승리 이유' : '🐻 곰 승리 이유'}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: result === 'bull' ? '#FFAA88' : '#88BBEE' }}>
              {getWinReason(yesterdayDate)}
            </p>
          </div>
          {/* 패자 변명 */}
          <div
            className="rounded-xl p-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-xs font-bold mb-1 text-white/40">
              {result === 'bull' ? '😭 곰 측 변명' : '😤 황소 측 변명'}
            </p>
            <p className="text-xs leading-relaxed text-white/30 italic">
              "{getLoserExcuse(yesterdayDate, result === 'bull' ? 'bear' : 'bull')}"
            </p>
          </div>
        </motion.div>

        {/* 커뮤니티 투표율 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4"
        >
          <p className="text-white/50 text-xs mb-3 text-center">커뮤니티 투표 결과</p>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: '#FF8C42' }} className="font-bold">🐂 황소 {communityBullPercent}%</span>
            <span style={{ color: '#4A90D9' }} className="font-bold">{communityBearPercent}% 곰 🐻</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${communityBullPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #FF4D4D, #FF8C42)' }}
            />
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${communityBearPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #4A90D9, #1A4A8A)' }}
            />
          </div>
        </motion.div>

        {/* 내 결과 + 스트릭 */}
        {userVotedSide ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl p-4"
            style={{
              background: userWon ? 'rgba(168,255,62,0.08)' : 'rgba(255,255,255,0.05)',
              border: userWon ? '1px solid rgba(168,255,62,0.3)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{userWon ? '🎉' : '😢'}</span>
              <div>
                <p className={`font-bold text-sm ${userWon ? 'text-lime-400' : 'text-white/60'}`}>
                  {userWon ? '정답! 예측 성공' : '아쉽게 틀렸어요'}
                </p>
                <p className="text-white/40 text-xs">
                  내 선택: {userVotedSide === 'bull' ? '🐂 황소' : '🐻 곰'}
                  {battleState.streak > 0 && ` · 🔥 ${battleState.streak}연승`}
                </p>
              </div>
            </div>
            {reaction && (
              <p className="text-white/50 text-xs leading-relaxed pl-1">{reaction}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="glass rounded-2xl p-4 text-center"
          >
            <p className="text-white/40 text-sm">어제 배틀에 참여하지 않았어요</p>
          </motion.div>
        )}

        {/* 나의 예측 통계 */}
        {accuracyPct !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-white/40 text-xs mb-2 text-center">📊 나의 예측 통계</p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-white font-black text-xl">{accuracyPct}%</p>
                <p className="text-white/30 text-[10px]">적중률</p>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-xl">{correctCount}</p>
                <p className="text-white/30 text-[10px]">맞춘 횟수</p>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-xl">{votesWithResult.length}</p>
                <p className="text-white/30 text-[10px]">총 참여</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 공유카드 (숨겨진 캡처 대상) */}
        <div
          ref={shareCardRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            width: 375,
            padding: '28px 24px 24px',
            background: 'linear-gradient(145deg, #060D1F 0%, #0D1F3C 50%, #1A2A50 100%)',
            borderRadius: 24,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* 브랜드 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: 3, marginBottom: 4 }}>
              ⚔️ BULL vs BEAR
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{topic.title}</p>
          </div>

          {/* 캐릭터 행 */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <img src={bullImg} alt="bull" crossOrigin="anonymous"
                style={{ width: 110, height: 'auto', display: 'block', marginBottom: 6 }} />
              <p style={{
                color: result === 'bull' ? '#FF8C42' : 'rgba(255,255,255,0.3)',
                fontSize: 11, fontWeight: 700,
              }}>
                {result === 'bull' ? '🏆 황소 승리' : '😤 황소'}
              </p>
            </div>

            <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
              <div style={{
                background: result === 'bull'
                  ? 'linear-gradient(135deg, rgba(255,77,77,0.25), rgba(255,140,66,0.15))'
                  : 'linear-gradient(135deg, rgba(74,144,217,0.25), rgba(26,74,138,0.15))',
                border: `1.5px solid ${result === 'bull' ? 'rgba(255,140,66,0.5)' : 'rgba(74,144,217,0.5)'}`,
                borderRadius: 16,
                padding: '12px 10px',
                marginBottom: 8,
              }}>
                <p style={{
                  color: result === 'bull' ? '#FF8C42' : '#4A90D9',
                  fontWeight: 900, fontSize: 20, lineHeight: 1.1, marginBottom: 6,
                }}>
                  {result === 'bull' ? '🐂 황소 승!' : '🐻 곰 승!'}
                </p>
                {userVotedSide && (
                  <p style={{
                    color: userWon ? '#a8ff3e' : 'rgba(255,255,255,0.45)',
                    fontSize: 13, fontWeight: 700, marginBottom: 4,
                  }}>
                    {userWon ? '✅ 예측 성공!' : '❌ 아쉽게 실패'}
                  </p>
                )}
                {battleState.streak > 0 && (
                  <p style={{ color: '#a8ff3e', fontSize: 12, fontWeight: 700 }}>🔥 {battleState.streak}연승!</p>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img src={bearImg} alt="bear" crossOrigin="anonymous"
                style={{ width: 110, height: 'auto', display: 'block', marginBottom: 6 }} />
              <p style={{
                color: result === 'bear' ? '#4A90D9' : 'rgba(255,255,255,0.3)',
                fontSize: 11, fontWeight: 700,
              }}>
                {result === 'bear' ? '🏆 곰 승리' : '😤 곰'}
              </p>
            </div>
          </div>

          {/* 판정 근거 한줄 */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 14,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, marginBottom: 4 }}>⚖️ 판정 근거</p>
            <p style={{
              color: result === 'bull' ? '#FFAA88' : '#88BBEE',
              fontSize: 11, lineHeight: 1.5,
            }}>
              {getWinReason(yesterdayDate)}
            </p>
          </div>

          {/* 커뮤니티 바 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#FF8C42', fontSize: 11, fontWeight: 700 }}>🐂 {communityBullPercent}%</span>
              <span style={{ color: '#4A90D9', fontSize: 11, fontWeight: 700 }}>{communityBearPercent}% 🐻</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ width: `${communityBullPercent}%`, background: 'linear-gradient(90deg, #FF4D4D, #FF8C42)', height: '100%' }} />
              <div style={{ width: `${communityBearPercent}%`, background: 'linear-gradient(90deg, #4A90D9, #1A4A8A)', height: '100%' }} />
            </div>
          </div>

          {/* 하단 브랜딩 */}
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center' }}>
            Bull vs Bear · 토스 미니앱 · 매일 자정 새 배틀
          </p>
        </div>

        {/* 공유 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={isCapturing}
          className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,77,0.8) 0%, rgba(74,144,217,0.8) 100%)',
            color: 'white',
          }}
        >
          {isCapturing ? '카드 생성 중...' : '📤 결과 공유하기'}
        </motion.button>

        <AnimatePresence>
          {shareError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs mt-2"
              style={{ color: '#FF6B6B' }}
            >
              ⚠️ 공유에 실패했어요. 다시 시도해주세요.
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/')}
          className="w-full py-3 text-white/40 text-sm"
        >
          ⚔️ 오늘 배틀 참여하기
        </motion.button>
      </main>

      {showMilestone && (
        <StreakMilestoneModal
          streak={milestoneStreak}
          onClose={() => setShowMilestone(false)}
        />
      )}
    </div>
  )
}
