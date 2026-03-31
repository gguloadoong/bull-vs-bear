import { motion } from 'framer-motion'
import bearImg from '../assets/characters/bear.webp'

type Mood = 'idle' | 'arguing' | 'winning' | 'losing'
interface Props { mood: Mood; size?: number }

export default function BearCharacter({ mood, size = 160 }: Props) {
  const variants = {
    idle: {
      y: [0, -6, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    arguing: {
      y: [0, -10, 0, -7, 0],
      x: [3, -3, 3],
      rotate: [2, -2, 2],
      transition: { duration: 0.4, repeat: Infinity },
    },
    winning: {
      y: [0, -28, 0, -16, 0],
      rotate: [3, -3, 3],
      scale: [1, 1.06, 1],
      transition: { duration: 0.55, repeat: Infinity, ease: 'easeOut' },
    },
    losing: {
      y: [0, 4, 0],
      rotate: [1, -1, 1],
      scale: [1, 0.97, 1],
      transition: { duration: 4, repeat: Infinity },
    },
  }

  return (
    <motion.div
      style={{ width: size, display: 'inline-block' }}
      variants={variants}
      animate={mood}
      initial={mood}
    >
      <img
        src={bearImg}
        alt="bear character"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maskImage: 'radial-gradient(ellipse 68% 72% at 50% 56%, black 28%, rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.15) 65%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 68% 72% at 50% 56%, black 28%, rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.15) 65%, transparent 80%)',
          filter: 'drop-shadow(0 0 20px rgba(80,120,255,0.5))',
        }}
        draggable={false}
      />
    </motion.div>
  )
}
