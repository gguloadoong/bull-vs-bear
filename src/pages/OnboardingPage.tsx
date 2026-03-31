import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import bullImg from '../assets/characters/bull.webp'
import bearImg from '../assets/characters/bear.webp'

const steps = [
  {
    emoji: '⚔️',
    title: 'AI가 싸운다!',
    description: '황소 AI vs 곰 AI가 매일 오늘의 주식 시장을 놓고 배틀 토론을 벌여요',
    image: 'both' as const,
  },
  {
    emoji: '🗳️',
    title: '내 편을 골라!',
    description: '황소(상승) vs 곰(하락) — 누가 맞을 것 같아? 투표하면 커뮤니티 결과도 보여요',
    image: 'both' as const,
  },
  {
    emoji: '🏆',
    title: '결과 보고 자랑!',
    description: '다음날 진짜 결과 공개! 맞추면 연승 기록 + 친구한테 자랑 카드 공유',
    image: 'both' as const,
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const navigate = useNavigate()

  const isLast = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('bvb_onboarding_done', '1')
      navigate('/')
    } else {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentStep ? 1 : -1)
    setCurrentStep(index)
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-6 text-center"
          >
            {/* Character display */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              {currentStep === 0 && (
                <>
                  <img src={bullImg} alt="bull" style={{ width: 90, filter: 'drop-shadow(0 0 16px rgba(255,80,80,0.4))' }} />
                  <span className="text-3xl pb-4">⚔️</span>
                  <img src={bearImg} alt="bear" style={{ width: 90, filter: 'drop-shadow(0 0 16px rgba(74,144,217,0.4))' }} />
                </>
              )}
              {currentStep === 1 && (
                <>
                  <img src={bullImg} alt="bull" style={{ width: 80, opacity: 0.6 }} />
                  <span className="text-4xl pb-4">🗳️</span>
                  <img src={bearImg} alt="bear" style={{ width: 80, opacity: 0.6 }} />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <div style={{ position: 'relative' }}>
                    <img src={bullImg} alt="bull" style={{ width: 100, filter: 'drop-shadow(0 0 20px rgba(168,255,62,0.6))' }} />
                    <span style={{ position: 'absolute', top: -8, right: -8, fontSize: 24 }}>🏆</span>
                  </div>
                  <img src={bearImg} alt="bear" style={{ width: 80, opacity: 0.4, transform: 'scaleX(-1)' }} />
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{steps[currentStep].title}</h1>
            <p className="text-white/70 text-base leading-relaxed">{steps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-6 bg-lime-400' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-lime-400 text-[#0a0f1e] font-bold text-lg hover:bg-lime-300 active:scale-95 transition-all duration-150"
        >
          {isLast ? '시작하기!' : '다음'}
        </button>
      </div>
    </div>
  )
}
