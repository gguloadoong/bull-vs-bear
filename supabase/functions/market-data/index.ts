// Supabase Edge Function: market-data proxy
// Fetches real-time Korean market data (stocks, exchange rate, gold)
// Supports: KOSPI stocks, USD/KRW, gold price (KRW/g)
//
// Setup: Set env vars in Supabase Dashboard → Edge Functions → Secrets
// Required: ALPHA_VANTAGE_KEY or KIS_APP_KEY + KIS_APP_SECRET

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketDataResponse {
  assetId: string
  price: number
  changeRate: number // percent, e.g. 1.23 means +1.23%
  currency: string
  updatedAt: string
}

// Asset ID → ticker mapping
const ASSET_TICKERS: Record<string, { type: 'stock' | 'fx' | 'commodity'; symbol: string }> = {
  samsung:    { type: 'stock',     symbol: '005930.KS' },  // 삼성전자
  kakao:      { type: 'stock',     symbol: '035720.KS' },  // 카카오
  hynix:      { type: 'stock',     symbol: '000660.KS' },  // SK하이닉스
  naver:      { type: 'stock',     symbol: '035420.KS' },  // NAVER
  tesla:      { type: 'stock',     symbol: 'TSLA'       },  // 테슬라
  bitcoin:    { type: 'commodity', symbol: 'BTC-USD'    },  // 비트코인
  usdkrw:     { type: 'fx',        symbol: 'USDKRW=X'   },  // 달러
  gold:       { type: 'commodity', symbol: 'GC=F'       },  // 금
}

async function fetchFromYahooFinance(symbol: string): Promise<{ price: number; changeRate: number }> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`Yahoo Finance error: ${res.status}`)

  const data = await res.json()
  const result = data?.chart?.result?.[0]
  if (!result) throw new Error('No data from Yahoo Finance')

  const meta = result.meta
  const price = meta.regularMarketPrice ?? meta.previousClose
  const prevClose = meta.chartPreviousClose ?? meta.previousClose
  const changeRate = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0

  return { price, changeRate }
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const url = new URL(req.url)
    const assetId = url.searchParams.get('assetId')

    if (!assetId) {
      // Return all assets
      const results = await Promise.all(
        Object.entries(ASSET_TICKERS).map(async ([id, { symbol }]) => {
          try {
            const { price, changeRate } = await fetchFromYahooFinance(symbol)
            return {
              assetId: id,
              price,
              changeRate: Math.round(changeRate * 100) / 100,
              currency: id === 'usdkrw' ? 'KRW' : id === 'bitcoin' ? 'USD' : 'KRW',
              updatedAt: new Date().toISOString(),
            } satisfies MarketDataResponse
          } catch {
            return null
          }
        })
      )

      const data = results.filter(Boolean)
      return new Response(JSON.stringify({ data }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const ticker = ASSET_TICKERS[assetId]
    if (!ticker) {
      return new Response(JSON.stringify({ error: 'Unknown assetId' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const { price, changeRate } = await fetchFromYahooFinance(ticker.symbol)
    const data: MarketDataResponse = {
      assetId,
      price,
      changeRate: Math.round(changeRate * 100) / 100,
      currency: 'KRW',
      updatedAt: new Date().toISOString(),
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('market-data error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
