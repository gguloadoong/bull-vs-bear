import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: '#0A0E1A' }}
        >
          <p className="text-5xl mb-4">😅</p>
          <h1 className="text-white font-bold text-xl mb-2">앗, 오류가 났어요</h1>
          <p className="text-white/40 text-sm mb-8">
            예상치 못한 문제가 생겼어요. 새로고침하면 해결될 거예요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl font-bold text-sm"
            style={{ background: '#A8FF3E', color: '#0A0E1A' }}
          >
            새로고침
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
