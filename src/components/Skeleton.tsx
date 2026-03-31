interface SkeletonProps {
  className?: string
  lines?: number
  height?: string
}

export default function Skeleton({ className = '', lines = 1, height = 'h-4' }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={`rounded-lg bg-white/5 animate-pulse ${height} ${className}`}
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg bg-white/5 ${height} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 100%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.5s infinite ${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}
