import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import TabLayout from './components/TabLayout.tsx'
import OfflineBanner from './components/OfflineBanner.tsx'
import BattlePage from './pages/BattlePage.tsx'
import './index.css'

const BattleResultPage = lazy(() => import('./pages/BattleResultPage.tsx'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage.tsx'))
const FeedPage = lazy(() => import('./pages/FeedPage.tsx'))
const MyRecordPage = lazy(() => import('./pages/MyRecordPage.tsx'))

function RootRedirect() {
  const done = localStorage.getItem('bvb_onboarding_done')
  return done ? <BattlePage /> : <Navigate to="/onboarding" replace />
}

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(168,255,62,0.2)',
        borderTopColor: '#a8ff3e',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <OfflineBanner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<TabLayout><RootRedirect /></TabLayout>} />
            <Route path="/feed" element={<TabLayout><FeedPage /></TabLayout>} />
            <Route path="/my-record" element={<TabLayout><MyRecordPage /></TabLayout>} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/result" element={<BattleResultPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
