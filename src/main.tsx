import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import BattlePage from './pages/BattlePage.tsx'
import BattleResultPage from './pages/BattleResultPage.tsx'
import OnboardingPage from './pages/OnboardingPage.tsx'
import './index.css'

function RootRedirect() {
  const done = localStorage.getItem('bvb_onboarding_done')
  return done ? <BattlePage /> : <Navigate to="/onboarding" replace />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/result" element={<BattleResultPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
