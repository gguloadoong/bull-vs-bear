import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const TABS = [
  { path: '/', label: '배틀', icon: '⚔️' },
  { path: '/feed', label: '피드', icon: '📊' },
  { path: '/my-record', label: '내 기록', icon: '👤' },
]

interface Props { children: React.ReactNode }

export default function TabLayout({ children }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>{children}</div>

      {/* Bottom tab bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'rgba(6,13,31,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {TABS.map(tab => {
          const isActive = tab.path === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '10px 0 12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: 2,
                    background: '#a8ff3e',
                    borderRadius: '0 0 2px 2px',
                  }}
                />
              )}
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: isActive ? '#a8ff3e' : 'rgba(255,255,255,0.4)',
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
