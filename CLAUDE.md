# 돈키우기 (GrowMoney)

## Overview
- **Service**: 돈키우기 (GrowMoney)
- **Type**: Gamification + Simulation Mini-App (토스 앱인토스)
- **Mission**: 매일 30초 가상 투자로 금융 감각을 키우는 토스 미니앱
- **Problem**: 투자에 관심은 있지만 시작이 어렵고, 금융 공부는 지루하다
- **Target**: 토스 앱 사용 2030대 직장인/학생
- **Differentiator**: 실제 시장 데이터 기반 가상 투자 + 수익률 공유 카드로 바이럴 루프 형성
- **Model**: sonnet (default) / opus (architecture, RCA, deep analysis)

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (게임 애니메이션)
- **State**: Jotai (atomic state)
- **Backend**: Supabase (PostgreSQL + Realtime + Edge Functions)
- **Deploy**: Vercel (frontend) + Supabase (backend)
- **Share Card**: html-to-image (결과 카드 이미지 생성)
- **Design**: 딥네이비/다크 그라데이션 + 라임그린 + 골드 + 글래스모피즘

## Team
| Role | Agent | Model |
|------|-------|-------|
| PM | pm | claude-sonnet-4-6 |
| Developer | developer | claude-sonnet-4-6 |
| Designer | designer | claude-sonnet-4-6 |

## Quality Gates
1. Build passes (`npm run build` or equivalent)
2. No lint errors
3. All existing tests pass
4. New features have tests
5. Bug fixes have reproduction test

## Rules
- Finish one thing 100% before starting the next
- Questions to CEO: plain language, multiple choice only
- Fix problems immediately. Report only what you can't fix.
- Mock data first (Phase 1). Real APIs later (Phase 2).
- Every feature must serve `.project/essence.md`
- Same approach fails twice → root cause analysis
- Reuse > library > build from scratch

## 토스 앱인토스 제약
- WebView 기반 (네이티브 기능 제한)
- 투자 자문 금지 → "가상 게임"임을 명시
- `toss_user_id` 게임 데이터 연결 용도로만 사용
- AdMob Bedrock SDK 표준 방식만 허용 (Phase 2)
- 앱인토스 심사 통과 필수
