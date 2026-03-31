import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  streak: number
  onClose: () => void
}

const MILESTONES: Record<number, { title: string; emoji: string; desc: string; color: string }> = {
  3:  { title: '3연승!', emoji: '🔥', desc: '감각이 살아있네요 ㄷㄷ', color: '#FF8C42' },
  7:  { title: '7연승!!', emoji: '⚡', desc: '황소도 곰도 당신 앞엔 무릎 ㄹㅇ', color: '#FFD700' },
  14: { title: '14연승!!!', emoji: '👑', desc: '시장의 신이 강림하셨다 ㄷㄷ', color: '#a8ff3e' },
  30: { title: '30연승 LEGENDARY', emoji: '🏆', desc: '당신이 바로 워런 버핏 급 ㄹㅇ', color: '#FF4DFF' },
}

export default function StreakMilestoneModal({ streak, onClose }: Props) {
  const milestone = MILESTONES[streak]
  if (!milestone) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #0A0F1E 0%, #1A2A4A 100%)',
            border: `2px solid ${milestone.color}`,
            borderRadius: 24,
            padding: 32,
            textAlign: 'center',
            maxWidth: 320,
            width: '100%',
            boxShadow: `0 0 40px ${milestone.color}44`,
            position: 'relative',
          }}
        >
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-20, -80],
                x: [(i - 2.5) * 20, (i - 2.5) * 40],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
              style={{
                position: 'absolute',
                fontSize: 16,
                pointerEvents: 'none',
              }}
            >
              {(['✨', '⭐', '💫', '🌟', '✨', '💥'] as const)[i]}
            </motion.div>
          ))}

          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ fontSize: 64, lineHeight: 1, marginBottom: 16 }}
          >
            {milestone.emoji}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color: milestone.color, fontSize: 28, fontWeight: 900, marginBottom: 8 }}
          >
            {milestone.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 24 }}
          >
            {milestone.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: `${milestone.color}22`,
              border: `1px solid ${milestone.color}44`,
              borderRadius: 12,
              padding: '8px 16px',
              marginBottom: 20,
            }}
          >
            <p style={{ color: milestone.color, fontSize: 13, fontWeight: 700 }}>
              🔥 현재 {streak}연승 달성!
            </p>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{
              background: `linear-gradient(135deg, ${milestone.color}CC, ${milestone.color}88)`,
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '12px 32px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            계속 투자하기 💪
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
