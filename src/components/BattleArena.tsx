import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BullCharacter from './BullCharacter'
import BearCharacter from './BearCharacter'

type Side = 'bull' | 'bear' | null
type CharacterMood = 'idle' | 'arguing' | 'winning' | 'losing'

interface Argument {
  side: 'bull' | 'bear'
  text: string
}

interface Props {
  ticker?: string
  tickerName?: string
  bullArguments?: string[]
  bearArguments?: string[]
  bullReasons?: string[]
  bearReasons?: string[]
  initialBullPercent?: number
  alreadyVoted?: 'bull' | 'bear' | null
  onVote?: (side: 'bull' | 'bear') => void
}

const DEFAULT_BULL_ARGS = [
  'HBM3E 수요 분기 28% 증가 ㄷㄷ 근데 곰은 이것도 모르지ㅋ',
  '외국인 순매수 8일 연속이야 ㄹㅇ 이건 그냥 올라',
  '영업이익률 18%... 이 종목 지금 줍줍각 아니면 뭐임',
  '반도체 슈퍼사이클 왔는데 아직도 관망? 나는 이해를 못하겠어',
]

const DEFAULT_BEAR_ARGS = [
  'PER 22배인데 역사 평균 15배야 ㄹㅇ 고평가 맞음 저도 인정하기 싫었어',
  '미국 10년물 4.6%인데 주식 왜 삼? 채권이 낫잖아 현실 직시해',
  '가계부채 GDP 대비 108%... 내수 소비 어떻게 살아남냐 솔직히',
  '인플레 다시 튀어오르면 금리 또 올려 그럼 끝이야 곰이 맞아',
]

// Typewriter hook
function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return { displayed, done }
}

export default function BattleArena({
  ticker = 'KOSPI',
  tickerName = '코스피',
  bullArguments = DEFAULT_BULL_ARGS,
  bearArguments = DEFAULT_BEAR_ARGS,
  bullReasons,
  bearReasons,
  initialBullPercent = 68,
  alreadyVoted = null,
  onVote,
}: Props) {
  const resolvedBullReasons = bullReasons ?? bullArguments.slice(0, 3)
  const resolvedBearReasons = bearReasons ?? bearArguments.slice(0, 3)
  const [voted, setVoted] = useState<Side>(alreadyVoted)
  const [bullVotes, setBullVotes] = useState(initialBullPercent)
  const [bearVotes, setBearVotes] = useState(100 - initialBullPercent)
  const [currentArgIndex, setCurrentArgIndex] = useState(0)
  const [currentSide, setCurrentSide] = useState<'bull' | 'bear'>('bull')
  const [showResult, setShowResult] = useState(alreadyVoted !== null)
  const [openPanel, setOpenPanel] = useState<'bull' | 'bear' | null>(null)
  const [secondsUntilMidnight, setSecondsUntilMidnight] = useState(0)

  useEffect(() => {
    const calc = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      setSecondsUntilMidnight(Math.floor((midnight.getTime() - now.getTime()) / 1000))
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  const allArguments: Argument[] = []
  const maxLen = Math.max(bullArguments.length, bearArguments.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < bullArguments.length) allArguments.push({ side: 'bull', text: bullArguments[i] })
    if (i < bearArguments.length) allArguments.push({ side: 'bear', text: bearArguments[i] })
  }

  const currentArg = allArguments[currentArgIndex % allArguments.length]
  const { displayed, done } = useTypewriter(currentArg.text, 30)

  // Advance argument every ~5s after typewriter finishes
  useEffect(() => {
    if (!done) return
    const timer = setTimeout(() => {
      setCurrentArgIndex(i => i + 1)
      setCurrentSide(allArguments[(currentArgIndex + 1) % allArguments.length].side)
    }, 2800)
    return () => clearTimeout(timer)
  }, [done, currentArgIndex, allArguments])

  useEffect(() => {
    setCurrentSide(currentArg.side)
  }, [currentArg.side])

  const handleVote = (side: Side) => {
    if (voted || !side) return
    setVoted(side)
    if (side === 'bull') {
      setBullVotes(v => Math.min(95, v + 3))
      setBearVotes(v => Math.max(5, v - 3))
    } else {
      setBearVotes(v => Math.min(95, v + 3))
      setBullVotes(v => Math.max(5, v - 3))
    }
    setTimeout(() => setShowResult(true), 400)
    onVote?.(side)
  }

  const handleCharacterTap = (side: 'bull' | 'bear') => {
    setOpenPanel(prev => (prev === side ? null : side))
  }

  const bullMood: CharacterMood =
    voted === 'bull'
      ? 'winning'
      : voted === 'bear'
      ? 'losing'
      : currentSide === 'bull'
      ? 'arguing'
      : 'idle'

  const bearMood: CharacterMood =
    voted === 'bear'
      ? 'winning'
      : voted === 'bull'
      ? 'losing'
      : currentSide === 'bear'
      ? 'arguing'
      : 'idle'

  const communityVoteCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const seed = today.split('-').reduce((acc: number, p: string) => acc * 100 + parseInt(p), 0)
    const base = 8000 + (seed % 42000)  // 8,000 ~ 50,000
    return base.toLocaleString('ko-KR')
  }, [])

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const totalVotes = bullVotes + bearVotes
  const bullPct = Math.round((bullVotes / totalVotes) * 100)
  const bearPct = 100 - bullPct

  return (
    <div className="w-full max-w-md mx-auto select-none">
      {/* ── Header: 오늘의 종목 ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">오늘의 대결 종목</p>
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
          <span className="text-lime-400 font-bold text-sm tracking-wide">{ticker}</span>
          <span className="text-white/60 text-sm">{tickerName}</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block"
          />
        </div>
      </motion.div>

      {/* ── Characters + Debate Box ── */}
      <div className="relative flex items-end justify-between gap-2 px-1">
        {/* Bull side */}
        <div className="flex flex-col items-center flex-1">
          <motion.div
            animate={currentSide === 'bull' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, repeat: currentSide === 'bull' ? Infinity : 0 }}
            onClick={() => handleCharacterTap('bull')}
            className="cursor-pointer"
          >
            <BullCharacter mood={bullMood} size={130} />
          </motion.div>
          <p className="text-xs font-bold mt-1" style={{ color: '#FF8C42' }}>
            황소 AI
          </p>
          <p className="text-white/30 text-[10px]">강세론자</p>
          <p className="text-white/20 text-[9px] mt-0.5">탭해서 근거 보기</p>
        </div>

        {/* VS badge + speech bubble */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0" style={{ minWidth: 100 }}>
          {/* VS */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #FF4D4D 0%, #4A90D9 100%)', color: 'white' }}
          >
            VS
          </motion.div>

          {/* Speech bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArgIndex}
              initial={{ opacity: 0, scale: 0.92, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl px-3 py-2.5 text-center"
              style={{
                background:
                  currentArg.side === 'bull'
                    ? 'rgba(255,77,77,0.12)'
                    : 'rgba(74,144,217,0.12)',
                border: `1px solid ${currentArg.side === 'bull' ? 'rgba(255,77,77,0.3)' : 'rgba(74,144,217,0.3)'}`,
                minHeight: 72,
                width: 130,
              }}
            >
              {/* Tail pointing to speaker */}
              <div
                className="absolute bottom-full"
                style={{
                  left: currentArg.side === 'bull' ? '18%' : '78%',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: `8px solid ${currentArg.side === 'bull' ? 'rgba(255,77,77,0.3)' : 'rgba(74,144,217,0.3)'}`,
                }}
              />
              <p
                className="text-[11px] leading-relaxed text-left"
                style={{ color: currentArg.side === 'bull' ? '#FFAA88' : '#88BBEE' }}
              >
                {displayed}
                {!done && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 ml-0.5 align-middle"
                    style={{ background: currentArg.side === 'bull' ? '#FF8C42' : '#4A90D9' }}
                  />
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bear side */}
        <div className="flex flex-col items-center flex-1">
          <motion.div
            animate={currentSide === 'bear' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, repeat: currentSide === 'bear' ? Infinity : 0 }}
            onClick={() => handleCharacterTap('bear')}
            className="cursor-pointer"
          >
            <BearCharacter mood={bearMood} size={130} />
          </motion.div>
          <p className="text-xs font-bold mt-1" style={{ color: '#4A90D9' }}>
            곰 AI
          </p>
          <p className="text-white/30 text-[10px]">약세론자</p>
          <p className="text-white/20 text-[9px] mt-0.5">탭해서 근거 보기</p>
        </div>
      </div>

      {/* ── Reason Panels ── */}
      <AnimatePresence>
        {openPanel === 'bull' && (
          <motion.div
            key="bull-panel"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden px-2"
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,77,77,0.08)',
                border: '1.5px solid rgba(255,77,77,0.4)',
              }}
            >
              <p className="text-xs font-bold mb-3" style={{ color: '#FF8C42' }}>
                🐂 황소의 상승 근거 (ㄹㅇ 팩트임)
              </p>
              <div className="flex flex-col gap-2.5">
                {resolvedBullReasons.map((text, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx + 1) * 0.08 }}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                      style={{ background: 'rgba(255,77,77,0.25)', color: '#FF8C42' }}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-[11px] leading-relaxed" style={{ color: '#FFAA88' }}>
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {openPanel === 'bear' && (
          <motion.div
            key="bear-panel"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden px-2"
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(74,144,217,0.08)',
                border: '1.5px solid rgba(74,144,217,0.4)',
              }}
            >
              <p className="text-xs font-bold mb-3" style={{ color: '#4A90D9' }}>
                🐻 곰의 하락 근거 (팩트폭행 주의)
              </p>
              <div className="flex flex-col gap-2.5">
                {resolvedBearReasons.map((text, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx + 1) * 0.08 }}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                      style={{ background: 'rgba(74,144,217,0.25)', color: '#4A90D9' }}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-[11px] leading-relaxed" style={{ color: '#88BBEE' }}>
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vote buttons ── */}
      <div className="mt-5 px-2">
        {!voted ? (
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleVote('bull')}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FF4D4D 0%, #FF8C42 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(255,77,77,0.35)',
              }}
            >
              <span className="relative z-10">🐂 Bullish</span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.08 }}
              />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleVote('bear')}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1A4A8A 0%, #4A90D9 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(74,144,217,0.35)',
              }}
            >
              <span className="relative z-10">🐻 Bearish</span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.08 }}
              />
            </motion.button>
          </div>
        ) : (
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* My vote badge */}
                <div className="text-center mb-3">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: voted === 'bull' ? 'rgba(255,77,77,0.2)' : 'rgba(74,144,217,0.2)',
                      color: voted === 'bull' ? '#FF8C42' : '#4A90D9',
                      border: `1px solid ${voted === 'bull' ? 'rgba(255,77,77,0.4)' : 'rgba(74,144,217,0.4)'}`,
                    }}
                  >
                    {voted === 'bull' ? '🐂 Bullish 선택!' : '🐻 Bearish 선택!'}
                  </motion.span>
                </div>

                {/* Vote ratio bar */}
                <div className="rounded-2xl overflow-hidden p-3 mb-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: '#FF8C42' }} className="font-bold">
                      🐂 Bullish {bullPct}%
                    </span>
                    <span style={{ color: '#4A90D9' }} className="font-bold">
                      {bearPct}% Bearish 🐻
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="h-4 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      initial={{ width: '50%' }}
                      animate={{ width: `${bullPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #FF4D4D, #FF8C42)' }}
                    />
                    <motion.div
                      initial={{ width: '50%' }}
                      animate={{ width: `${bearPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #4A90D9, #1A4A8A)' }}
                    />
                  </div>

                  <p className="text-white/30 text-[10px] text-center mt-2">
                    커뮤니티 {communityVoteCount}명 참여
                  </p>
                </div>

                {/* Winner label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <p className="text-white/40 text-[11px]">
                    {bullPct > bearPct
                      ? `🐂 Bullish가 ${bullPct - bearPct}%p 앞서고 있어요`
                      : `🐻 Bearish가 ${bearPct - bullPct}%p 앞서고 있어요`}
                  </p>
                </motion.div>

                {/* Tomorrow countdown */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-3 rounded-2xl p-3 text-center"
                  style={{
                    background: 'rgba(168,255,62,0.06)',
                    border: '1px solid rgba(168,255,62,0.2)',
                  }}
                >
                  <p className="text-white/40 text-[10px] mb-1">⏰ 결과 공개까지</p>
                  <p className="font-black text-lg tracking-widest" style={{ color: '#a8ff3e', fontVariantNumeric: 'tabular-nums' }}>
                    {formatCountdown(secondsUntilMidnight)}
                  </p>
                  <p className="text-white/30 text-[10px] mt-1">자정에 승자가 결정됩니다</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-white/20 text-[10px] text-center mt-4 px-4">
        본 콘텐츠는 가상 게임입니다. 투자 자문이 아닙니다.
      </p>
    </div>
  )
}
