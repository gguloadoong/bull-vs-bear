import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import BattlePage from './pages/BattlePage.tsx'
import './index.css'

const BattleResultPage = lazy(() => import('./pages/BattleResultPage.tsx'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage.tsx'))

function RootRedirect() {
  const done = localStorage.getItem('bvb_onboarding_done')
  return done ? <BattlePage /> : <Navigate to="/onboarding" replace />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/result" element={<BattleResultPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
