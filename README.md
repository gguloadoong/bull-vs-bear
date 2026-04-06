# 🐂⚔️🐻 Bull vs Bear

**매일 30초, 황소 vs 곰 AI의 설전에 베팅하고 금융 감각을 키우는 가상 투자 게임**

> 앱인토스(토스 미니앱) 플랫폼용 WebView SPA — 실제 시장 데이터 기반 가상 배틀

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev/)

---

## 🎯 핵심 컨셉

| 요소 | 설명 |
|------|------|
| ⚔️ **배틀** | 코스피·나스닥·비트코인 등 종목별로 🐂 황소 AI vs 🐻 곰 AI가 설전 |
| 🗳️ **베팅** | 30분 슬롯마다 Bullish / Bearish 선택 |
| 👥 **커뮤니티** | 실시간 투표율 공개 — "나는 군중과 같나, 다른가?" |
| 🏆 **랭킹** | 예측 적중 횟수로 전체 유저 랭킹 |
| 📤 **공유** | 결과 카드 이미지로 바이럴 루프 형성 |

---

## 📸 스크린샷

| ⚔️ 배틀 | 📊 결과 | 🏆 랭킹 |
|---------|---------|---------|
| 🐂🐻 AI 실시간 토론 | 커뮤니티 투표율 + 결과 공개 | 내 랭킹 + 상위 랭커 |

---

## 🛠️ 기술 스택

| 레이어 | 기술 |
|--------|------|
| 🖥️ Frontend | Vite 6 + React 18 + TypeScript |
| 🎨 스타일 | Tailwind CSS + Framer Motion |
| ⚛️ 상태관리 | Jotai (atomic) |
| 🗄️ Backend | Supabase (PostgreSQL + Realtime) |
| 📤 공유카드 | html-to-image (pixelRatio 3) |
| 📱 플랫폼 | 앱인토스 (`@apps-in-toss/web-framework`) |

---

## 🧩 프로젝트 구조

```
src/
├── pages/
│   ├── OnboardingPage.tsx     # 🚀 첫 진입 + 면책 문구
│   ├── BattlePage.tsx         # ⚔️ 메인 배틀 (30분 슬롯)
│   ├── BattleResultPage.tsx   # 📊 결과 + 공유카드
│   ├── FeedPage.tsx           # 📈 실시간 시장 피드
│   ├── RankingPage.tsx        # 🏆 전체 랭킹
│   └── MyRecordPage.tsx       # 📋 내 전적
├── components/
│   ├── BattleArena.tsx        # 🐂🐻 황소·곰 AI 토론 UI
│   ├── BullCharacter.tsx      # 🐂 황소 캐릭터 (SVG)
│   ├── BearCharacter.tsx      # 🐻 곰 캐릭터 (SVG)
│   └── TabLayout.tsx          # 🗂️ 하단 탭 네비게이션
├── store/
│   ├── battleStore.ts         # ⚙️ 슬롯·투표·연승 상태
│   └── communityStore.ts      # 🌐 Supabase Realtime 투표 집계
└── data/
    └── mockBattles.ts         # 💬 종목별 토론 스크립트
```

---

## 🚀 시작하기

```bash
# 📦 의존성 설치
npm install

# 🔑 환경변수 설정
cp .env.example .env
# .env에 Supabase 키 입력

# 💻 개발 서버 (로컬)
npm run dev

# 📱 개발 서버 (실기기 접속)
npm run dev -- --host

# 🏗️ 빌드
npm run build

# 🧪 테스트
npm test
```

---

## 🔑 환경변수

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ Supabase 미설정 시에도 mock 데이터로 정상 동작합니다.

---

## 🗄️ Supabase 스키마

```sql
-- 🗳️ 커뮤니티 투표
CREATE TABLE slot_votes (
  id          bigserial PRIMARY KEY,
  slot_key    text NOT NULL,          -- "YYYY-MM-DD_HHMM"
  side        text NOT NULL,          -- 'bull' | 'bear'
  fingerprint text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- 📊 투표 집계 뷰
CREATE VIEW slot_stats AS
  SELECT slot_key,
         COUNT(*) FILTER (WHERE side = 'bull') AS bull_count,
         COUNT(*) FILTER (WHERE side = 'bear') AS bear_count,
         COUNT(*) AS total
  FROM slot_votes GROUP BY slot_key;

-- 🏆 유저 랭킹 뷰
CREATE VIEW user_rankings AS
  SELECT fingerprint,
         COUNT(*) AS total_votes,
         RANK() OVER (ORDER BY COUNT(*) DESC) AS rank
  FROM slot_votes GROUP BY fingerprint;
```

---

## ⏱️ 배틀 슬롯 시스템

- 하루를 **30분 단위 슬롯**으로 분할 (`YYYY-MM-DD_HHMM` 형식)
- 슬롯 시작 시 새 배틀 종목 배정 (날짜+시간 seed 기반 결정론적 선택)
- 🗳️ 투표 후 다음 슬롯에 결과 공개
- 🔥 연속 적중 시 연승 스트릭 표시

---

## 📱 앱인토스 제약사항

- WebView 기반 — 네이티브 기능 제한
- ⚠️ **투자 자문 금지** → "가상 게임"임을 온보딩·배틀화면에 명시
- 앱인토스 콘솔 계정 등록 후 `granite.config.ts`의 `appName` 교체 필요

---

## 📄 라이선스

MIT
