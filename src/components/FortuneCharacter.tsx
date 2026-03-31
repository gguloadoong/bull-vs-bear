import { motion } from 'framer-motion'

type Mood = 'idle' | 'correct' | 'wrong' | 'revealing'

interface Props {
  mood: Mood
  size?: number
}

export default function FortuneCharacter({ mood, size = 150 }: Props) {
  const isIdle = mood === 'idle'
  const isCorrect = mood === 'correct'
  const isWrong = mood === 'wrong'
  const isRevealing = mood === 'revealing'

  const bodyVariants = {
    idle: {
      y: [0, -2, 0],
      scaleY: [1, 1.01, 1],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    },
    revealing: {
      y: [0, -5, 0, -3, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    correct: {
      y: [0, -16, 0, -10, 0],
      rotate: [-1, 1, -1],
      transition: { duration: 0.65, repeat: Infinity, ease: 'easeOut' },
    },
    wrong: {
      y: [0, 2, 0],
      x: [-1, 1, -1],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  }

  // Crystal ball glow intensity by mood
  const orbGlow = isRevealing ? 0.9 : isCorrect ? 0.7 : isWrong ? 0.15 : 0.45
  const orbColor = isWrong ? '#6B21A8' : isCorrect ? '#FFD700' : '#C084FC'

  // LED eye color
  const eyeColor = isWrong ? '#EF4444' : isCorrect ? '#22C55E' : '#A855F7'
  const eyeGlow = isWrong ? '#7F1D1D' : isCorrect ? '#14532D' : '#581C87'

  return (
    <motion.div
      style={{ width: size, height: size * 1.2, display: 'inline-block' }}
      variants={bodyVariants}
      animate={mood}
      initial={mood}
    >
      <svg
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Background mystic aura */}
          <radialGradient id="fortune-glow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#A855F7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
          {/* Robot body gradient */}
          <linearGradient id="fortune-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4D4D8" />
            <stop offset="50%" stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#71717A" />
          </linearGradient>
          {/* Body highlight */}
          <radialGradient id="fortune-body-highlight" cx="40%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#F4F4F5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A1A1AA" stopOpacity="0" />
          </radialGradient>
          {/* Cape gradient */}
          <linearGradient id="fortune-cape" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          {/* Cape inner lining */}
          <linearGradient id="fortune-cape-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#581C87" />
            <stop offset="100%" stopColor="#3B0764" />
          </linearGradient>
          {/* Crystal ball gradient */}
          <radialGradient id="fortune-orb" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#C084FC" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.8" />
          </radialGradient>
          {/* Orb inner glow */}
          <radialGradient id="fortune-orb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={orbColor} stopOpacity={orbGlow} />
            <stop offset="100%" stopColor={orbColor} stopOpacity="0" />
          </radialGradient>
          {/* Gold metallic */}
          <linearGradient id="fortune-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          {/* Antenna gradient */}
          <linearGradient id="fortune-antenna" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4D4D8" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>
          {/* LED glow filter */}
          <filter id="led-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Orb glow filter */}
          <filter id="orb-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Star sparkle filter */}
          <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== LAYER 0: Background Mystic Aura ===== */}
        <ellipse cx="100" cy="120" rx="90" ry="100" fill="url(#fortune-glow)" />
        {/* Outer ring particles - floating mystic dots */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 120px' }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const cx = 100 + Math.cos(rad) * 85
            const cy = 120 + Math.sin(rad) * 95
            return (
              <motion.circle
                key={`aura-${i}`}
                cx={cx}
                cy={cy}
                r="1.5"
                fill="#C084FC"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            )
          })}
        </motion.g>

        {/* ===== LAYER 1: Shadow ===== */}
        <motion.ellipse
          cx="100"
          cy="232"
          rx="44"
          ry="7"
          fill="rgba(76,29,149,0.3)"
          animate={isRevealing ? { rx: [44, 50, 44], opacity: [0.3, 0.5, 0.3] } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* ===== LAYER 2: Wheels (robot feet) ===== */}
        {/* Left wheel */}
        <ellipse cx="80" cy="224" rx="14" ry="8" fill="#52525B" />
        <ellipse cx="80" cy="224" rx="14" ry="8" fill="none" stroke="#3F3F46" strokeWidth="1.5" />
        {/* Wheel hub */}
        <circle cx="80" cy="224" r="4" fill="#71717A" />
        <circle cx="80" cy="224" r="2" fill="#A1A1AA" />
        {/* Wheel spokes */}
        <line x1="74" y1="224" x2="86" y2="224" stroke="#52525B" strokeWidth="0.8" />
        <line x1="80" y1="218" x2="80" y2="230" stroke="#52525B" strokeWidth="0.8" />
        {/* Axle left */}
        <rect x="76" y="212" width="8" height="14" rx="3" fill="#71717A" />

        {/* Right wheel */}
        <ellipse cx="120" cy="224" rx="14" ry="8" fill="#52525B" />
        <ellipse cx="120" cy="224" rx="14" ry="8" fill="none" stroke="#3F3F46" strokeWidth="1.5" />
        <circle cx="120" cy="224" r="4" fill="#71717A" />
        <circle cx="120" cy="224" r="2" fill="#A1A1AA" />
        <line x1="114" y1="224" x2="126" y2="224" stroke="#52525B" strokeWidth="0.8" />
        <line x1="120" y1="218" x2="120" y2="230" stroke="#52525B" strokeWidth="0.8" />
        {/* Axle right */}
        <rect x="116" y="212" width="8" height="14" rx="3" fill="#71717A" />

        {/* ===== LAYER 3: Robot Body (round torso) ===== */}
        {/* Main body - rounded rectangle */}
        <rect x="62" y="120" width="76" height="85" rx="28" fill="url(#fortune-body)" />
        {/* Body highlight */}
        <rect x="62" y="120" width="76" height="85" rx="28" fill="url(#fortune-body-highlight)" />
        {/* Chest plate detail */}
        <rect x="78" y="130" width="44" height="35" rx="12" fill="none" stroke="#E4E4E7" strokeWidth="0.8" opacity="0.5" />
        {/* Chest indicator light */}
        <motion.circle
          cx="100"
          cy="140"
          r="3"
          fill={isRevealing ? '#A855F7' : isCorrect ? '#22C55E' : isWrong ? '#EF4444' : '#7C3AED'}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: isRevealing ? 0.5 : 1.5, repeat: Infinity }}
          filter="url(#led-glow)"
        />
        {/* Belly panel - screen showing data */}
        <rect x="82" y="150" width="36" height="24" rx="4" fill="#1E1B4B" stroke="#4C1D95" strokeWidth="1" />
        {/* Screen data lines */}
        <motion.g
          animate={isRevealing ? { opacity: [0.3, 1, 0.3] } : { opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: isRevealing ? 0.4 : 2, repeat: Infinity }}
        >
          <rect x="86" y="154" width="18" height="2" rx="1" fill="#A855F7" opacity="0.7" />
          <rect x="86" y="159" width="12" height="2" rx="1" fill="#C084FC" opacity="0.5" />
          <rect x="86" y="164" width="22" height="2" rx="1" fill="#7C3AED" opacity="0.6" />
          <rect x="86" y="169" width="8" height="2" rx="1" fill="#C084FC" opacity="0.4" />
          {/* Mini chart on screen */}
          <path d="M106 168 L110 162 L113 165 L116 155" stroke="#A855F7" strokeWidth="1" fill="none" />
        </motion.g>

        {/* Body seam lines */}
        <path d="M72 155 Q74 165 72 175" stroke="#9CA3AF" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M128 155 Q126 165 128 175" stroke="#9CA3AF" strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* Rivets */}
        <circle cx="72" cy="138" r="2" fill="#A1A1AA" stroke="#71717A" strokeWidth="0.5" />
        <circle cx="128" cy="138" r="2" fill="#A1A1AA" stroke="#71717A" strokeWidth="0.5" />
        <circle cx="72" cy="190" r="2" fill="#A1A1AA" stroke="#71717A" strokeWidth="0.5" />
        <circle cx="128" cy="190" r="2" fill="#A1A1AA" stroke="#71717A" strokeWidth="0.5" />

        {/* ===== LAYER 4: Cape (star-patterned, purple) ===== */}
        {/* Cape - draped over shoulders, flowing down */}
        <motion.g
          animate={
            isRevealing
              ? { rotate: [-1, 1, -1] }
              : isCorrect
                ? { rotate: [-3, 3, -3] }
                : { rotate: [-0.5, 0.5, -0.5] }
          }
          transition={{
            duration: isRevealing ? 1 : isCorrect ? 0.5 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '100px 105px' }}
        >
          {/* Cape back (visible behind body) */}
          <path d="M55 108 Q48 150 42 210 Q70 215 100 212 Q130 215 158 210 Q152 150 145 108 Z" fill="url(#fortune-cape)" />
          {/* Cape inner lining visible at edges */}
          <path d="M55 108 Q50 140 44 200 L52 200 Q56 140 58 112 Z" fill="url(#fortune-cape-inner)" />
          <path d="M145 108 Q150 140 156 200 L148 200 Q144 140 142 112 Z" fill="url(#fortune-cape-inner)" />
          {/* Cape fold lines */}
          <path d="M60 130 Q65 160 58 200" stroke="#5B21B6" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M140 130 Q135 160 142 200" stroke="#5B21B6" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M80 120 Q78 160 75 210" stroke="#5B21B6" strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M120 120 Q122 160 125 210" stroke="#5B21B6" strokeWidth="0.5" fill="none" opacity="0.3" />

          {/* Star patterns on cape */}
          {[
            { x: 52, y: 150, s: 4 },
            { x: 60, y: 180, s: 3 },
            { x: 48, y: 195, s: 3.5 },
            { x: 148, y: 150, s: 4 },
            { x: 140, y: 180, s: 3 },
            { x: 152, y: 195, s: 3.5 },
            { x: 70, y: 200, s: 2.5 },
            { x: 130, y: 200, s: 2.5 },
          ].map((star, i) => (
            <motion.path
              key={`cape-star-${i}`}
              d={`M${star.x} ${star.y - star.s}
                  L${star.x + star.s * 0.3} ${star.y - star.s * 0.3}
                  L${star.x + star.s} ${star.y}
                  L${star.x + star.s * 0.3} ${star.y + star.s * 0.3}
                  L${star.x} ${star.y + star.s}
                  L${star.x - star.s * 0.3} ${star.y + star.s * 0.3}
                  L${star.x - star.s} ${star.y}
                  L${star.x - star.s * 0.3} ${star.y - star.s * 0.3} Z`}
              fill="#FFD700"
              opacity="0.6"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.35 }}
            />
          ))}

          {/* Cape clasp (gold brooch at neck) */}
          <circle cx="100" cy="112" r="6" fill="url(#fortune-gold)" />
          <circle cx="100" cy="112" r="3.5" fill="#B8860B" />
          {/* Gem in clasp */}
          <circle cx="100" cy="112" r="2" fill="#7C3AED" />
          <circle cx="99" cy="111" r="0.8" fill="#C084FC" opacity="0.8" />
        </motion.g>

        {/* ===== LAYER 5: Neck joint ===== */}
        <rect x="90" y="104" width="20" height="14" rx="6" fill="#A1A1AA" />
        {/* Neck ring detail */}
        <rect x="88" y="108" width="24" height="4" rx="2" fill="#D4D4D8" />
        <line x1="92" y1="108" x2="92" y2="112" stroke="#9CA3AF" strokeWidth="0.5" />
        <line x1="100" y1="108" x2="100" y2="112" stroke="#9CA3AF" strokeWidth="0.5" />
        <line x1="108" y1="108" x2="108" y2="112" stroke="#9CA3AF" strokeWidth="0.5" />

        {/* ===== LAYER 6: Head (round robot head) ===== */}
        <ellipse cx="100" cy="78" rx="38" ry="34" fill="url(#fortune-body)" />
        <ellipse cx="100" cy="78" rx="38" ry="34" fill="url(#fortune-body-highlight)" />
        {/* Head panel lines */}
        <path d="M70 65 Q100 58 130 65" stroke="#D4D4D8" strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* Forehead gem */}
        <path d="M100 56 L104 62 L100 68 L96 62 Z" fill="#7C3AED" stroke="#5B21B6" strokeWidth="0.5" />
        <path d="M100 58 L102 62 L100 66 L98 62 Z" fill="#A855F7" opacity="0.6" />
        <motion.path
          d="M100 59 L101 62 L100 65 L99 62 Z"
          fill="#E9D5FF"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* ===== LAYER 7: Antenna with crystal ball ===== */}
        <motion.g
          animate={
            isRevealing
              ? { rotate: [0, 15, -15, 10, -10, 0] }
              : isCorrect
                ? { rotate: [0, 8, -8, 0] }
                : { rotate: [0, 2, -2, 0] }
          }
          transition={{
            duration: isRevealing ? 0.8 : isCorrect ? 0.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '100px 48px' }}
        >
          {/* Antenna rod */}
          <rect x="97" y="30" width="6" height="18" rx="3" fill="url(#fortune-antenna)" />
          {/* Antenna joint rings */}
          <rect x="96" y="36" width="8" height="3" rx="1.5" fill="#D4D4D8" />
          {/* Crystal ball on top */}
          <circle cx="100" cy="24" r="10" fill="url(#fortune-orb)" />
          <circle cx="100" cy="24" r="10" fill="url(#fortune-orb-glow)" filter="url(#orb-glow-filter)" />
          {/* Orb highlight */}
          <ellipse cx="96" cy="20" rx="4" ry="3" fill="white" opacity="0.3" />
          {/* Orb base mount */}
          <ellipse cx="100" cy="33" rx="5" ry="2.5" fill="url(#fortune-gold)" />
        </motion.g>

        {/* ===== LAYER 8: Ear panels (side sensors) ===== */}
        {/* Left ear panel */}
        <rect x="58" y="68" width="10" height="20" rx="4" fill="#A1A1AA" stroke="#71717A" strokeWidth="0.5" />
        <rect x="60" y="72" width="6" height="4" rx="1" fill="#7C3AED" opacity="0.5" />
        <rect x="60" y="80" width="6" height="4" rx="1" fill="#7C3AED" opacity="0.3" />
        {/* Right ear panel */}
        <rect x="132" y="68" width="10" height="20" rx="4" fill="#A1A1AA" stroke="#71717A" strokeWidth="0.5" />
        <rect x="134" y="72" width="6" height="4" rx="1" fill="#7C3AED" opacity="0.5" />
        <rect x="134" y="80" width="6" height="4" rx="1" fill="#7C3AED" opacity="0.3" />

        {/* ===== LAYER 9: LED Eyes ===== */}
        {/* Eye sockets */}
        <ellipse cx="84" cy="78" rx="12" ry="11" fill="#27272A" />
        <ellipse cx="116" cy="78" rx="12" ry="11" fill="#27272A" />

        {/* LED pupils */}
        <motion.ellipse
          cx="84"
          cy="78"
          rx={isWrong ? 6 : 9}
          ry={isWrong ? 6 : 9}
          fill={eyeColor}
          filter="url(#led-glow)"
          animate={
            isWrong
              ? { opacity: [0.4, 0.8, 0.4], rx: [6, 4, 6] }
              : isRevealing
                ? { opacity: [0.6, 1, 0.6] }
                : { opacity: [0.7, 1, 0.7] }
          }
          transition={{
            duration: isWrong ? 0.5 : isRevealing ? 0.6 : 2,
            repeat: Infinity,
          }}
        />
        <motion.ellipse
          cx="116"
          cy="78"
          rx={isWrong ? 6 : 9}
          ry={isWrong ? 6 : 9}
          fill={eyeColor}
          filter="url(#led-glow)"
          animate={
            isWrong
              ? { opacity: [0.4, 0.8, 0.4], rx: [6, 4, 6] }
              : isRevealing
                ? { opacity: [0.6, 1, 0.6] }
                : { opacity: [0.7, 1, 0.7] }
          }
          transition={{
            duration: isWrong ? 0.5 : isRevealing ? 0.6 : 2,
            repeat: Infinity,
          }}
        />

        {/* Inner eye glow ring */}
        <ellipse cx="84" cy="78" rx="9" ry="9" fill="none" stroke={eyeGlow} strokeWidth="1" opacity="0.4" />
        <ellipse cx="116" cy="78" rx="9" ry="9" fill="none" stroke={eyeGlow} strokeWidth="1" opacity="0.4" />

        {/* Eye highlights */}
        <circle cx="80" cy="75" r="2.5" fill="white" opacity="0.5" />
        <circle cx="112" cy="75" r="2.5" fill="white" opacity="0.5" />
        <circle cx="87" cy="82" r="1.5" fill="white" opacity="0.3" />
        <circle cx="119" cy="82" r="1.5" fill="white" opacity="0.3" />

        {/* Wrong mood: X eyes */}
        {isWrong && (
          <motion.g
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <path d="M79 73 L89 83 M89 73 L79 83" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
            <path d="M111 73 L121 83 M121 73 L111 83" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}

        {/* ===== LAYER 10: Mouth area ===== */}
        {/* Mouth plate */}
        <rect x="88" y="90" width="24" height="10" rx="5" fill="#52525B" />

        {/* Mouth expressions */}
        {isIdle && (
          <motion.path
            d="M92 95 Q100 99 108 95"
            stroke="#A855F7"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {isRevealing && (
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <ellipse cx="100" cy="95" rx="6" ry="4" fill="#7C3AED" />
            <ellipse cx="100" cy="95" rx="4" ry="2.5" fill="#A855F7" opacity="0.5" />
          </motion.g>
        )}
        {isCorrect && (
          <path d="M90 93 Q100 102 110 93" stroke="#22C55E" strokeWidth="2" fill="#14532D" strokeLinecap="round" />
        )}
        {isWrong && (
          <motion.g
            animate={{ scaleX: [1, 0.8, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ transformOrigin: '100px 96px' }}
          >
            <path d="M92 98 Q100 92 108 98" stroke="#EF4444" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.g>
        )}

        {/* ===== LAYER 11: Cheek indicators ===== */}
        {/* Small LED indicators on cheeks */}
        <motion.circle
          cx="72" cy="85" r="2"
          fill={isCorrect ? '#22C55E' : isWrong ? '#EF4444' : '#C084FC'}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        />
        <motion.circle
          cx="128" cy="85" r="2"
          fill={isCorrect ? '#22C55E' : isWrong ? '#EF4444' : '#C084FC'}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
        />

        {/* ===== LAYER 12: Arms (robot arms) ===== */}
        {/* Left arm - holds crystal ball */}
        <motion.g
          animate={
            isRevealing
              ? { rotate: [0, -5, 5, -3, 0] }
              : isCorrect
                ? { rotate: [0, -20, 0] }
                : isWrong
                  ? { rotate: [0, 3, 0] }
                  : { rotate: [0, -2, 0] }
          }
          transition={{
            duration: isRevealing ? 1 : isCorrect ? 0.6 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '62px 130px' }}
        >
          {/* Upper arm segment */}
          <rect x="42" y="126" width="22" height="12" rx="6" fill="#A1A1AA" />
          {/* Joint */}
          <circle cx="44" cy="140" r="6" fill="#D4D4D8" stroke="#A1A1AA" strokeWidth="1" />
          {/* Forearm */}
          <rect x="36" y="140" width="16" height="28" rx="6" fill="#A1A1AA" />
          {/* Wrist joint */}
          <circle cx="44" cy="170" r="4" fill="#D4D4D8" />
          {/* Hand (claw gripper) */}
          <path d="M36 170 Q32 178 38 184" stroke="#A1A1AA" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M52 170 Q56 178 50 184" stroke="#A1A1AA" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Finger tips */}
          <circle cx="38" cy="184" r="2.5" fill="#D4D4D8" />
          <circle cx="50" cy="184" r="2.5" fill="#D4D4D8" />
        </motion.g>

        {/* Right arm */}
        <motion.g
          animate={
            isRevealing
              ? { rotate: [0, 5, -5, 3, 0] }
              : isCorrect
                ? { rotate: [0, 20, 0] }
                : isWrong
                  ? { rotate: [0, -3, 0] }
                  : { rotate: [0, 2, 0] }
          }
          transition={{
            duration: isRevealing ? 1 : isCorrect ? 0.6 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '138px 130px' }}
        >
          {/* Upper arm segment */}
          <rect x="136" y="126" width="22" height="12" rx="6" fill="#A1A1AA" />
          {/* Joint */}
          <circle cx="156" cy="140" r="6" fill="#D4D4D8" stroke="#A1A1AA" strokeWidth="1" />
          {/* Forearm */}
          <rect x="148" y="140" width="16" height="28" rx="6" fill="#A1A1AA" />
          {/* Wrist joint */}
          <circle cx="156" cy="170" r="4" fill="#D4D4D8" />
          {/* Hand */}
          <path d="M148 170 Q144 178 150 184" stroke="#A1A1AA" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M164 170 Q168 178 162 184" stroke="#A1A1AA" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="150" cy="184" r="2.5" fill="#D4D4D8" />
          <circle cx="162" cy="184" r="2.5" fill="#D4D4D8" />
        </motion.g>

        {/* ===== LAYER 13: Held Crystal Ball (between hands) ===== */}
        <motion.g
          animate={
            isRevealing
              ? { scale: [1, 1.15, 1], y: [0, -3, 0] }
              : isCorrect
                ? { scale: [1, 1.1, 1] }
                : isWrong
                  ? { scale: [1, 0.95, 1], opacity: [1, 0.6, 1] }
                  : { y: [0, -1, 0] }
          }
          transition={{
            duration: isRevealing ? 0.8 : isCorrect ? 0.5 : isWrong ? 2 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '100px 190px' }}
        >
          {/* Orb pedestal */}
          <ellipse cx="100" cy="200" rx="12" ry="4" fill="url(#fortune-gold)" />
          <rect x="94" y="196" width="12" height="5" rx="2" fill="url(#fortune-gold)" />

          {/* Main crystal ball */}
          <circle cx="100" cy="186" r="16" fill="url(#fortune-orb)" />
          <circle cx="100" cy="186" r="16" fill="url(#fortune-orb-glow)" filter="url(#orb-glow-filter)" />

          {/* Orb surface details */}
          <ellipse cx="94" cy="180" rx="6" ry="4" fill="white" opacity="0.2" />
          <circle cx="92" cy="178" r="2" fill="white" opacity="0.35" />

          {/* Inner orb sparkles */}
          <motion.g
            animate={
              isRevealing
                ? { opacity: [0, 1, 0], rotate: [0, 90, 180] }
                : { opacity: [0.2, 0.6, 0.2] }
            }
            transition={{ duration: isRevealing ? 0.6 : 3, repeat: Infinity }}
            style={{ transformOrigin: '100px 186px' }}
          >
            <circle cx="96" cy="183" r="1" fill="white" opacity="0.8" />
            <circle cx="104" cy="189" r="0.8" fill="#FFD700" opacity="0.7" />
            <circle cx="100" cy="182" r="0.6" fill="#E9D5FF" opacity="0.9" />
            <circle cx="103" cy="185" r="1.2" fill="#FFD700" opacity="0.6" />
          </motion.g>

          {/* Orb ring */}
          <circle cx="100" cy="186" r="16" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.4" />
        </motion.g>

        {/* ===== LAYER 14: Cape shoulder drape (over body, over arms at shoulder) ===== */}
        {/* Left shoulder drape */}
        <path d="M62 115 Q55 112 50 118 Q48 125 55 128 L65 124 Z" fill="url(#fortune-cape)" />
        <path d="M52 120 Q50 124 54 127" stroke="#5B21B6" strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* Right shoulder drape */}
        <path d="M138 115 Q145 112 150 118 Q152 125 145 128 L135 124 Z" fill="url(#fortune-cape)" />
        <path d="M148 120 Q150 124 146 127" stroke="#5B21B6" strokeWidth="0.6" fill="none" opacity="0.4" />

        {/* ===== LAYER 15: Revealing mode - energy rings ===== */}
        {isRevealing && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`ring-${i}`}
                cx="100"
                cy="186"
                r="20"
                fill="none"
                stroke="#C084FC"
                strokeWidth="1"
                animate={{
                  r: [20, 40 + i * 10],
                  opacity: [0.6, 0],
                  strokeWidth: [1.5, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
            {/* Data stream particles rising from orb */}
            {[
              { x: 94, delay: 0 },
              { x: 100, delay: 0.3 },
              { x: 106, delay: 0.6 },
            ].map((p, i) => (
              <motion.rect
                key={`data-${i}`}
                x={p.x}
                y="175"
                width="2"
                height="4"
                rx="1"
                fill="#A855F7"
                animate={{ y: [175, 155], opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: p.delay }}
              />
            ))}
          </>
        )}

        {/* ===== LAYER 16: Correct mode - golden star particles ===== */}
        {isCorrect && (
          <>
            {[
              { cx: 160, cy: 48, size: 10, delay: 0 },
              { cx: 148, cy: 32, size: 8, delay: 0.15 },
              { cx: 170, cy: 70, size: 7, delay: 0.3 },
              { cx: 36, cy: 46, size: 9, delay: 0.1 },
              { cx: 48, cy: 68, size: 6, delay: 0.25 },
              { cx: 28, cy: 56, size: 7, delay: 0.4 },
              { cx: 100, cy: 10, size: 11, delay: 0.05 },
              { cx: 78, cy: 28, size: 6, delay: 0.35 },
            ].map((star, i) => (
              <motion.g
                key={`star-${i}`}
                animate={{
                  scale: [0.5, 1.3, 0.5],
                  opacity: [0.4, 1, 0.4],
                  rotate: [0, 36, 0],
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: star.delay }}
                style={{ transformOrigin: `${star.cx}px ${star.cy}px` }}
                filter="url(#star-glow)"
              >
                <path
                  d={`M${star.cx} ${star.cy - star.size / 2}
                      L${star.cx + star.size / 6} ${star.cy - star.size / 6}
                      L${star.cx + star.size / 2} ${star.cy}
                      L${star.cx + star.size / 6} ${star.cy + star.size / 6}
                      L${star.cx} ${star.cy + star.size / 2}
                      L${star.cx - star.size / 6} ${star.cy + star.size / 6}
                      L${star.cx - star.size / 2} ${star.cy}
                      L${star.cx - star.size / 6} ${star.cy - star.size / 6} Z`}
                  fill="#FFD700"
                />
              </motion.g>
            ))}
            {/* Floating symbols */}
            {[
              { x: 38, y: 38, text: '\u2728', delay: 0.2 },
              { x: 162, y: 28, text: '\u2B50', delay: 0.5 },
            ].map((h, i) => (
              <motion.text
                key={`sym-${i}`}
                x={h.x}
                y={h.y}
                fontSize="14"
                textAnchor="middle"
                animate={{ y: [h.y, h.y - 15], opacity: [1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: h.delay }}
              >
                {h.text}
              </motion.text>
            ))}
          </>
        )}

        {/* ===== LAYER 17: Wrong mode - glitch & error effects ===== */}
        {isWrong && (
          <>
            {/* Static/glitch lines */}
            <motion.g
              animate={{ opacity: [0, 0.6, 0, 0.3, 0] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <rect x="66" y="72" width="68" height="1.5" fill="#EF4444" opacity="0.4" />
              <rect x="66" y="82" width="68" height="1" fill="#EF4444" opacity="0.3" />
              <rect x="70" y="150" width="60" height="1" fill="#EF4444" opacity="0.2" />
            </motion.g>
            {/* Smoke puffs from head */}
            <motion.g
              animate={{ y: [0, -12], opacity: [0.5, 0], x: [0, -5] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <circle cx="75" cy="52" r="4" fill="#A1A1AA" opacity="0.3" />
              <circle cx="68" cy="46" r="3" fill="#A1A1AA" opacity="0.2" />
            </motion.g>
            <motion.g
              animate={{ y: [0, -10], opacity: [0.4, 0], x: [0, 5] }}
              transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.8 }}
            >
              <circle cx="125" cy="52" r="3.5" fill="#A1A1AA" opacity="0.3" />
              <circle cx="132" cy="48" r="2.5" fill="#A1A1AA" opacity="0.2" />
            </motion.g>
            {/* Warning triangle */}
            <motion.g
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <path d="M155 60 L162 72 L148 72 Z" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
              <text x="155" y="70" fontSize="8" fill="#FBBF24" textAnchor="middle" fontWeight="bold">{'!'}</text>
            </motion.g>
          </>
        )}

        {/* ===== LAYER 18: Idle - floating mystic symbols ===== */}
        {isIdle && (
          <motion.g
            animate={{ opacity: [0, 0.7, 0.7, 0], y: [0, -4, -6, -10] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {/* Mystic symbols floating */}
            <text x="155" y="52" fontSize="12" fill="#C084FC" opacity="0.7" fontFamily="serif">{'~'}</text>
            <text x="165" y="42" fontSize="10" fill="#A855F7" opacity="0.5" fontFamily="serif">{'\u2727'}</text>
            <text x="172" y="55" fontSize="8" fill="#C084FC" opacity="0.4" fontFamily="serif">{'\u2726'}</text>
          </motion.g>
        )}

        {/* ===== LAYER 19: Speech bubbles ===== */}
        {isIdle && (
          <motion.g
            animate={{ opacity: [0, 1, 1, 0], y: [0, -3, -5, -8] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
          >
            <rect x="132" y="42" width="60" height="26" rx="12" fill="#7C3AED" />
            <polygon points="140,68 147,68 142,76" fill="#7C3AED" />
            <text x="162" y="59" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">
              {'운세 분석중'}
            </text>
          </motion.g>
        )}
        {isRevealing && (
          <motion.g
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ transformOrigin: '162px 55px' }}
          >
            <rect x="132" y="42" width="62" height="26" rx="12" fill="#7C3AED" />
            <polygon points="140,68 147,68 142,76" fill="#7C3AED" />
            <text x="163" y="59" fontSize="8.5" fill="white" textAnchor="middle" fontWeight="bold">
              {'계산 중...'}
            </text>
          </motion.g>
        )}
        {isCorrect && (
          <motion.g
            animate={{ scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ transformOrigin: '162px 55px' }}
          >
            <rect x="132" y="42" width="62" height="26" rx="12" fill="#FFD700" />
            <polygon points="140,68 147,68 142,76" fill="#FFD700" />
            <text x="163" y="59" fontSize="9" fill="#1E1B4B" textAnchor="middle" fontWeight="bold">
              {'적중!'}
            </text>
          </motion.g>
        )}
        {isWrong && (
          <motion.g
            animate={{ opacity: [0.5, 0.8, 0.5], x: [-1, 1, -1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <rect x="132" y="42" width="58" height="26" rx="12" fill="#52525B" />
            <polygon points="140,68 147,68 142,76" fill="#52525B" />
            <text x="161" y="59" fontSize="8.5" fill="#A1A1AA" textAnchor="middle" fontWeight="bold">
              {'오작동...'}
            </text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  )
}
