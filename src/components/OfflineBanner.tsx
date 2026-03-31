import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-yellow-400"
          style={{
            background: 'rgba(250, 204, 21, 0.12)',
            borderBottom: '1px solid rgba(250, 204, 21, 0.3)',
          }}
        >
          <span>📡</span>
          <span>오프라인 상태예요 — 저장된 데이터로 표시 중</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
