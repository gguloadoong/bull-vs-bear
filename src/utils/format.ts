export function formatKRW(amount: number): string {
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000)
    const remainder = amount % 10000
    if (remainder === 0) return `${man}만원`
    return `${man}만 ${remainder.toLocaleString()}원`
  }
  return `${amount.toLocaleString()}원`
}

export function formatRate(rate: number): string {
  const sign = rate >= 0 ? '+' : ''
  return `${sign}${rate.toFixed(2)}%`
}

export function formatRateClass(rate: number): string {
  return rate >= 0 ? 'text-lime-400' : 'text-red-400'
}
