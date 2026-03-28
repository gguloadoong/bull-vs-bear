import { forwardRef } from 'react'
import { formatKRW, formatRate } from '../utils/format'

interface Props {
  assetName: string
  resultRate: number
  virtualAsset: number
  startAsset: number
  streak: number
  topPercent: number
}

const ShareCard = forwardRef<HTMLDivElement, Props>(
  ({ assetName, resultRate, virtualAsset, startAsset, streak, topPercent }, ref) => {
    const totalRate = ((virtualAsset - startAsset) / startAsset) * 100
    const isProfit = resultRate >= 0

    return (
      <div
        ref={ref}
        style={{
          width: '375px',
          height: '500px',
          background: 'linear-gradient(135deg, #0A0E1A 0%, #111B35 50%, #0D1426 100%)',
          padding: '32px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '24px',
          border: '1px solid rgba(168, 255, 62, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 글로우 */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(168, 255, 62, 0.05)',
          filter: 'blur(60px)',
        }} />

        {/* 상단: 앱 이름 */}
        <div>
          <p style={{ color: '#A8FF3E', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', margin: 0 }}>
            돈키우기
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '4px 0 0 0' }}>
            가상 투자 시뮬레이터
          </p>
        </div>

        {/* 중앙: 결과 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 8px 0' }}>
            {assetName} 투자 결과
          </p>
          <p style={{
            fontSize: '56px',
            fontWeight: 900,
            color: isProfit ? '#A8FF3E' : '#F87171',
            margin: '0',
            lineHeight: 1,
          }}>
            {formatRate(resultRate)}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '12px 0 0 0' }}>
            누적 수익률 <span style={{ color: totalRate >= 0 ? '#A8FF3E' : '#F87171', fontWeight: 700 }}>
              {formatRate(totalRate)}
            </span>
          </p>
        </div>

        {/* 하단: 자산 + 순위 */}
        <div>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 4px 0' }}>내 가상 자산</p>
              <p style={{ color: 'white', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                {formatKRW(virtualAsset)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 4px 0' }}>상위</p>
              <p style={{ color: '#FFD166', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                {topPercent}%
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>
              🔥 {streak}일 연속 투자
            </p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', margin: 0 }}>
              grow-money.vercel.app
            </p>
          </div>
        </div>
      </div>
    )
  }
)

ShareCard.displayName = 'ShareCard'
export default ShareCard
