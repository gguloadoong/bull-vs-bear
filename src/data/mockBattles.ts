// 날짜 seed 기반 LCG 난수 (기존 패턴 재사용)
function lcg(seed: number): number {
  return ((seed * 1664525 + 1013904223) >>> 0) / 0xffffffff
}

function dateToSeed(date: string): number {
  return date.split('-').reduce((acc, part) => acc * 100 + parseInt(part), 0)
}

export interface BattleTopic {
  id: string
  title: string        // "코스피 오늘 오를까?"
  subtitle: string     // "코스피 지수 전망"
  emoji: string
  bullWinReason: string
  bearWinReason: string
  bullLoserExcuse: string[]
  bearLoserExcuse: string[]
}

export interface DebateRound {
  side: 'bull' | 'bear'
  text: string
}

export interface MockBattle {
  topic: BattleTopic
  rounds: DebateRound[]  // 5라운드 (bull/bear 번갈아)
  result: 'bull' | 'bear'           // 오늘 승자
  communityBullPercent: number      // 45~75
}

const TOPICS: BattleTopic[] = [
  {
    id: 'kospi',
    title: '코스피 오늘 반등할까?',
    subtitle: '코스피 지수',
    emoji: '📈',
    bullWinReason: '코스피 +1.8% 상승 마감 → 황소 완승 ㄷㄷ 곰은 집에 가',
    bearWinReason: '코스피 -1.2% 하락 → 곰의 예언 적중 ㄹㅇ인정',
    bullLoserExcuse: [
      '내가 틀린 게 아니라 시장이 이상한 거야 ㅋ',
      '잠깐 조정인 거라고 ㄹㅇ 내일 봐',
      '외국인들이 장난치는 거 다 알아 솔직히',
    ],
    bearLoserExcuse: [
      '이건 데드캣 바운스야 ㄷㄷ 두고봐',
      '일시적 반등 맞아 ㄹㅇ 내 분석이 맞아',
      '곧 떨어짐 그냥 기다려 솔직히',
    ],
  },
  {
    id: 'bitcoin',
    title: '비트코인 다음 목적지는?',
    subtitle: 'BTC/KRW',
    emoji: '₿',
    bullWinReason: 'BTC +8.3% 급등 → 황소 예언 적중 ㄷㄷ 코인판 지배자',
    bearWinReason: 'BTC -6.1% 폭락 → 곰 판정승 ㄹㅇ 역시 내가 맞았어',
    bullLoserExcuse: [
      '고래들이 일부러 흔든 거야 ㄹㅇ 음모론 아님',
      '이번엔 진짜 아니었는데 다음 반감기 봐 솔직히',
      '김치 프리미엄 때문임 내 잘못 아님 ㅋ',
    ],
    bearLoserExcuse: [
      '기관 펌핑이잖아 진짜 투자자 아님 ㄷㄷ',
      '이거 조작장인 거 다 알잖아 ㄹㅇ',
      '곧 규제 나온다 그때 봐 솔직히 기다려',
    ],
  },
  {
    id: 'samsung',
    title: '삼성전자 살 타이밍?',
    subtitle: '005930',
    emoji: '📱',
    bullWinReason: '삼성전자 +3.2% 상승 → 황소 판정승 ㄷㄷ PBR 바닥론 승리',
    bearWinReason: '삼성전자 -2.4% 하락 → 곰 완승 ㄹㅇ 저PBR 함정 증명',
    bullLoserExcuse: [
      'HBM 인증 시간이 걸리는 거야 ㄹㅇ 곧 됨',
      '외인 매도가 오늘만 많았던 거 솔직히',
      '삼성이 망해? 대한민국이 망하기 전까지 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '실적 좋아도 밸류에이션이 문제야 ㄹㅇ',
      '지금 오른 건 숏커버링임 ㄷㄷ 진짜 아님',
      '다음 분기 실망스러울 거야 솔직히 기다려',
    ],
  },
  {
    id: 'dollar',
    title: '달러 더 오를까?',
    subtitle: 'USD/KRW',
    emoji: '💵',
    bullWinReason: '달러 1,420원 돌파 → 황소 완승 ㄷㄷ 강달러 시대 개막',
    bearWinReason: '원달러 1,350원 하락 → 곰 승리 ㄹㅇ 달러 거품 꺼짐',
    bullLoserExcuse: [
      '환시 개입이야 정부가 막은 거라고 ㅋ',
      '일시적 약세임 ㄹㅇ 미국 경제 아직 강해',
      '다음주 FOMC 보고 말해 솔직히 아직 몰라',
    ],
    bearLoserExcuse: [
      '경상수지 흑자인데 왜 오름 ㅋㅋ 말이 안 됨',
      '이건 투기 세력 농간이야 ㄷㄷ 진짜임',
      '1,400 넘으면 외환위기 오는데 정부가 놔둘 리 없어 솔직히',
    ],
  },
  {
    id: 'gold',
    title: '금값 계속 치솟나?',
    subtitle: '금 현물',
    emoji: '🥇',
    bullWinReason: '금 온스당 신고가 경신 → 황소 완승 ㄷㄷ 안전자산의 왕',
    bearWinReason: '금값 조정 -2.1% → 곰 판정승 ㄹㅇ 과매수 신호 적중',
    bullLoserExcuse: [
      '달러 강세 때 잠깐 조정인 거야 ㄹㅇ',
      '중앙은행은 여전히 사고 있음 솔직히 ㄷㄷ',
      '인플레이션 재가속되면 봐 그때가 진짜',
    ],
    bearLoserExcuse: [
      '지정학 리스크 이슈 터지면 바로 오름 ㄷㄷ',
      '중국이 금 숨겨놓고 사는 거야 통계 믿지 마 ㄹㅇ',
      '3,000불 오면 뭐라고 할 거야 솔직히',
    ],
  },
  {
    id: 'hynix',
    title: 'SK하이닉스 AI 수혜 끝?',
    subtitle: '000660',
    emoji: '💾',
    bullWinReason: 'SK하이닉스 +4.7% 급등 → 황소 대승 ㄷㄷ HBM 독주 체제',
    bearWinReason: 'SK하이닉스 -3.5% 하락 → 곰 승리 ㄹㅇ 고점 논란 현실화',
    bullLoserExcuse: [
      '삼성이 HBM 퀄 통과했다는 루머 때문임 ㄹㅇ',
      '잠깐 차익실현이야 ㄷㄷ 다음주 반등 봐',
      '엔비디아 실적 발표 전에 사야 함 솔직히',
    ],
    bearLoserExcuse: [
      'AI 거품 꺼지면 같이 꺼짐 ㄷㄷ 두고봐',
      'PER 15배라고? 삼성 퀄 맞추면 끝남 ㄹㅇ',
      '지금 오른 건 외인 단기 베팅이야 솔직히',
    ],
  },
  {
    id: 'nasdaq',
    title: '나스닥 고점 논란',
    subtitle: 'NASDAQ',
    emoji: '🇺🇸',
    bullWinReason: '나스닥 +2.9% 상승 → 황소 완승 ㄷㄷ AI 강세장 지속 확인',
    bearWinReason: '나스닥 -3.1% 급락 → 곰 예언 적중 ㄹㅇ M7 버블 경고음',
    bullLoserExcuse: [
      'FOMC 발표 앞두고 관망인 거야 ㄹㅇ',
      '매그니피센트7 실적 나오면 다시 올라 ㄷㄷ',
      '조정 후 더 강하게 가는 거 솔직히 역사가 증명함',
    ],
    bearLoserExcuse: [
      '소비자 신용 연체율 봤어? 언제든 터짐 ㄷㄷ',
      '이건 FOMO 랠리야 ㄹㅇ 실체 없어',
      'VIX 보면 알아 공포 지수 너무 낮아 솔직히 위험함',
    ],
  },
  {
    id: 'oil',
    title: '국제유가 방향은?',
    subtitle: 'WTI 원유',
    emoji: '🛢️',
    bullWinReason: 'WTI +5.2% 급등 → 황소 대승 ㄷㄷ OPEC 감산 위력 증명',
    bearWinReason: 'WTI -4.3% 하락 → 곰 완승 ㄹㅇ 공급과잉 현실화',
    bullLoserExcuse: [
      '미국 셰일이 갑자기 증산한 거야 ㄹㅇ 내 잘못 아님',
      '중동 평화 분위기 일시적임 ㄷㄷ 곧 다시 긴장함',
      '드라이빙 시즌 가면 봐 솔직히 수요 폭발함',
    ],
    bearLoserExcuse: [
      'OPEC이 깜짝 감산 발표한 거야 ㄹㅇ 반칙임',
      '전기차 보급 속도 맞는데 단기 변수가 ㄷㄷ',
      '지정학 프리미엄 걷히면 다시 하락 솔직히 두고봐',
    ],
  },
  {
    id: 'kakao',
    title: '카카오 주가 바닥 찍었나?',
    subtitle: '035720',
    emoji: '🟡',
    bullWinReason: '카카오 +4.1% 반등 → 황소 판정승 ㄷㄷ 플랫폼 부활 시그널',
    bearWinReason: '카카오 -2.8% 하락 → 곰 완승 ㄹㅇ 규제 리스크 현실화',
    bullLoserExcuse: [
      '규제 이슈가 예상보다 길어지는 중 다음 분기 실적 보고 판단',
      '카카오 없는 한국 생활이 가능함? 결국 반등함',
      '지금은 바닥 다지기 구간임 ㄷㄷ 진짜 반등은 다음',
    ],
    bearLoserExcuse: [
      '플랫폼 광고 회복 속도가 생각보다 빨랐음',
      '바닥에서 매수한 개인들 힘이 컸음 다음엔 진짜 숏',
      '카카오페이 흑자 전환 소식이 호재로 작용한 거 일시적',
    ],
  },
  {
    id: 'lgenergy',
    title: 'LG에너지솔루션 2차전지 반등?',
    subtitle: '373220',
    emoji: '🔋',
    bullWinReason: 'LG엔솔 +6.3% 급등 → 황소 대승 ㄷㄷ IRA 수혜 본격화',
    bearWinReason: 'LG엔솔 -4.2% 하락 → 곰 승리 ㄹㅇ 캐즘 직격탄',
    bullLoserExcuse: [
      '전기차 캐즘이 예상보다 길다 2026년 본격 회복 기다림',
      'IRA 보조금 효과는 내년부터 본격화됨',
      'CATL 가격 경쟁이 일시적임 ㄷㄷ 기술력으로 이김',
    ],
    bearLoserExcuse: [
      '완성차 업체들 전기차 투자 재개 소식이 컸음',
      '정책 수혜가 이렇게 빨리 반영될 줄 몰랐음',
      'ESS 수주 급증이 생각보다 강한 호재였음',
    ],
  },
  {
    id: 'hyundai',
    title: '현대차 고배당 매력 있나?',
    subtitle: '005380',
    emoji: '🚗',
    bullWinReason: '현대차 +3.7% 상승 → 황소 판정승 ㄷㄷ 배당+성장 콤보',
    bearWinReason: '현대차 -2.1% 하락 → 곰 승리 ㄹㅇ 관세 리스크 직격',
    bullLoserExcuse: [
      '환율 역풍이 예상보다 컸음 환율 안정되면 재진입',
      '현대차 펀더멘탈은 여전히 탄탄함 기다림',
      '미국 관세 협상 결과 나오면 다시 올라 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '배당 매력이 외국인 수급을 이렇게 끌어들일 줄 몰랐음',
      '미국 공장 효과가 생각보다 빨리 반영됐음',
      'EPS 3만5천원이 글로벌 완성차 대비 저평가 부각됐음',
    ],
  },
  {
    id: 'posco',
    title: 'POSCO홀딩스 리튬 기대감 과열?',
    subtitle: '005490',
    emoji: '⚙️',
    bullWinReason: 'POSCO +5.1% 급등 → 황소 대승 ㄷㄷ 리튬 가격 반등 수혜',
    bearWinReason: 'POSCO -3.4% 하락 → 곰 완승 ㄹㅇ 리튬 기대감 과열 해소',
    bullLoserExcuse: [
      '리튬 가격 회복이 예상보다 느림 장기 보유 전략 유지',
      '리튬 생산 가이던스가 너무 보수적으로 나왔음',
      '철강 가격 반등까지 기다리면 진짜 간다 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '철강 가격 반등 속도가 생각보다 빨랐음',
      '리튬 사업 기대감이 주가에 이렇게 빨리 반영될 줄은',
      'PBR 0.4배 저평가 인식이 이렇게 강하게 작용할 줄 몰랐음',
    ],
  },
  {
    id: 'naver',
    title: '네이버 AI 전쟁에서 살아남나?',
    subtitle: '035420',
    emoji: '🟢',
    bullWinReason: '네이버 +4.8% 상승 → 황소 판정승 ㄷㄷ 하이퍼클로바 수주 호재',
    bearWinReason: '네이버 -3.1% 하락 → 곰 승리 ㄹㅇ 검색 트래픽 잠식 현실화',
    bullLoserExcuse: [
      '한국어 특화 AI는 네이버가 독보적 글로벌 빅테크 못 따라옴',
      '검색 트래픽 감소가 과장된 거임 실제 데이터 보면 멀쩡함',
      '커머스 GMV 성장이 광고 매출 감소 상쇄함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '하이퍼클로바 기업 수주가 생각보다 잘 됐음',
      '한국 로컬 플랫폼 파워를 과소평가했음',
      '쇼핑 GMV 40조가 이렇게 강한 모멘텀일 줄은',
    ],
  },
  {
    id: 'celltrion',
    title: '셀트리온 바이오시밀러 모멘텀?',
    subtitle: '068270',
    emoji: '💊',
    bullWinReason: '셀트리온 +7.2% 급등 → 황소 대승 ㄷㄷ 미국 점유율 확대 확인',
    bearWinReason: '셀트리온 -4.5% 하락 → 곰 승리 ㄹㅇ 가격 경쟁 심화 우려',
    bullLoserExcuse: [
      '미국 판매망 구축이 예상보다 오래 걸리는 중 내년부터 본격화',
      '바이오는 장기 보유 기본임 단기 등락에 흔들리지 않음',
      '12개 파이프라인 중 하나씩 허가 나오면 올라 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '미국 시장 점유율 상승 속도가 생각보다 빨랐음',
      '짐펜트라 처방률이 이렇게 빨리 올라올 줄 몰랐음',
      'FDA 신속 승인 환경이 이렇게 좋을 줄 몰랐음',
    ],
  },
  {
    id: 'kakaobank',
    title: '카카오뱅크 핀테크 밸류 적정?',
    subtitle: '323410',
    emoji: '🏦',
    bullWinReason: '카카오뱅크 +5.3% 상승 → 황소 판정승 ㄷㄷ 성장성 재평가',
    bearWinReason: '카카오뱅크 -3.7% 하락 → 곰 완승 ㄹㅇ 고평가 해소 지속',
    bullLoserExcuse: [
      '연체율 상승이 예상보다 빠름 금리 인하 기다림',
      '카카오 플랫폼 시너지는 장기 자산임',
      '26세 이하 고객 기반이 10년 후 모기지 고객 됨 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '대출 성장세가 생각보다 강했음 카카오 플랫폼 파워 인정',
      'PER 매력이 이렇게 빨리 반영될 줄은',
      '인터넷은행 규제 완화가 생각보다 빨리 됐음',
    ],
  },
  {
    id: 'krafton',
    title: '크래프톤 인도 게임 성장 진짜?',
    subtitle: '259960',
    emoji: '🎮',
    bullWinReason: '크래프톤 +8.1% 급등 → 황소 대승 ㄷㄷ 인도 MAU 신기록',
    bearWinReason: '크래프톤 -4.9% 하락 → 곰 승리 ㄹㅇ 인도 규제 리스크 재부상',
    bullLoserExcuse: [
      '인도 규제 리스크가 다시 불거짐 해소되면 재진입',
      '신작 출시가 지연됐지만 출시 후 모멘텀 기대',
      '인도 ARPU 개선은 시간이 걸림 장기 우상향 유효 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '인도 MAU 성장세가 이렇게 가파를 줄 몰랐음',
      '게임 IP 파워를 과소평가했음 다음엔 인정',
      '배그 IP 10억 다운로드 기반이 이렇게 강할 줄은',
    ],
  },
  {
    id: 'us_rate',
    title: '미국 금리 올해 내릴 수 있나?',
    subtitle: 'Fed Funds Rate',
    emoji: '🏛️',
    bullWinReason: '연준 인하 시그널 확인 → 황소 완승 ㄷㄷ 채권·주식 동반 랠리',
    bearWinReason: '연준 동결 장기화 확인 → 곰 판정승 ㄹㅇ 고금리 지속 현실화',
    bullLoserExcuse: [
      '인플레가 예상보다 끈적함 내년 상반기 인하 기대로 포지션 유지',
      'PCE가 목표치 근접하면 진짜 인하함 기다리는 중',
      '고용 둔화 신호 나오면 연준 바로 피벗함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '고용 데이터가 갑자기 꺾였음 인하 속도가 예상보다 빠를 수도',
      'CPI 둔화 속도가 생각보다 빨랐음',
      '파월이 비둘기파 발언을 이렇게 빨리 할 줄 몰랐음',
    ],
  },
  {
    id: 'kr_realestate',
    title: '한국 부동산 다시 오를까?',
    subtitle: '서울 아파트 지수',
    emoji: '🏠',
    bullWinReason: '서울 아파트 거래량 급증 → 황소 완승 ㄷㄷ 공급 부족 재확인',
    bearWinReason: '가계부채 규제 강화 → 곰 판정승 ㄹㅇ 대출 규제 현실화',
    bullLoserExcuse: [
      '규제가 생각보다 강하게 나왔음 규제 완화 기다림',
      '서울 핵심지는 진짜 떨어질 수 없음 장기 우상향',
      '금리 인하 사이클 오면 대기수요 폭발함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '공급 부족 문제가 단기에 해결이 안 됨 인정',
      '서울 수요가 이렇게 탄탄할 줄은 몰랐음',
      '전세가율 상승이 매매가 지지하는 게 생각보다 강했음',
    ],
  },
  {
    id: 'usdkrw',
    title: '원달러 1400원 돌파할까?',
    subtitle: 'USD/KRW',
    emoji: '💱',
    bullWinReason: '원달러 1400원 돌파 → 황소 완승 ㄷㄷ 강달러 기조 확인',
    bearWinReason: '원달러 1350원대 하락 → 곰 판정승 ㄹㅇ 원화 강세 전환',
    bullLoserExcuse: [
      '외인 수급이 예상보다 좋았음 하지만 달러 강세 기조는 유효',
      '일시적 원화 강세고 구조적으로 1400 위가 맞음',
      '경상수지 개선이 예상보다 빠름 다음 달 재진입 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '미국 지표가 연속으로 서프라이즈 달러 강세 막기 어려웠음',
      '지정학 프리미엄이 이렇게 클 줄 몰랐음',
      '한은 금리 인하 기조가 원화 약세 부추겼음',
    ],
  },
  {
    id: 'inflation',
    title: '인플레이션 다시 재가속하나?',
    subtitle: 'CPI YoY',
    emoji: '🔥',
    bullWinReason: 'CPI 반등 확인 → 황소 완승 ㄷㄷ 인플레 재가속 현실화',
    bearWinReason: 'CPI 둔화 지속 → 곰 판정승 ㄹㅇ 디스인플레이션 확인',
    bullLoserExcuse: [
      '에너지 가격 하락이 CPI 끌어내렸음 서비스 인플레는 여전히 높음',
      'CPI 착시임 근원 인플레 끈적한 거 봐야 함',
      '주거비 OER 시차 효과로 다음 달에 반영됨 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '임금 협상 결과가 예상보다 높게 나왔음',
      '원자재 가격 반등 속도가 생각보다 빨랐음',
      'OPEC 감산이 에너지 가격을 이렇게 밀어올릴 줄 몰랐음',
    ],
  },
  {
    id: 'recession',
    title: '경기침체 진짜 오나?',
    subtitle: 'GDP 성장률',
    emoji: '📉',
    bullWinReason: '소프트랜딩 확인 → 황소 완승 ㄷㄷ 침체 없는 성장 현실화',
    bearWinReason: '경기 둔화 신호 강화 → 곰 판정승 ㄹㅇ 침체 우려 현실화',
    bullLoserExcuse: [
      '경기 선행 지표가 예상보다 빠르게 꺾임 연착륙 기대 수정 중',
      '아직 기술적 침체 아님 2분기 연속 역성장 봐야 진짜',
      '고용만 버텨주면 침체 없음 ㄷㄷ 아직 괜찮아',
    ],
    bearLoserExcuse: [
      '소비자가 이렇게 버틸 줄 몰랐음 초과저축 효과 과소평가',
      '고용 탄탄함이 생각보다 오래감 다음 분기 데이터 봐야',
      'GDP 2.8% 성장이 이렇게 강하게 나올 줄 몰랐음',
    ],
  },
  {
    id: 'ai_chip',
    title: 'AI 반도체 테마 아직 유효?',
    subtitle: 'AI 반도체 지수',
    emoji: '🤖',
    bullWinReason: '엔비디아 실적 서프라이즈 → 황소 대승 ㄷㄷ AI 수요 끝없음 확인',
    bearWinReason: '빅테크 CAPEX 우려 → 곰 판정승 ㄹㅇ AI 버블 경고음',
    bullLoserExcuse: [
      'AI ROI 입증이 예상보다 오래 걸리는 중 장기 테마는 유효',
      '단기 차익실현이고 B100 본격 공급 시작되면 재진입',
      'TSMC 수주 잔고 보면 AI 수요 꺾인 거 아님 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '클라우드 업체들 CAPEX 가이던스가 또 올라갔음',
      'AI 수요가 진짜 무한대급임 공급이 못 따라가는 상황',
      '엔비디아 EPS 서프라이즈 규모가 이렇게 클 줄 몰랐음',
    ],
  },
  {
    id: 'battery',
    title: '2차전지 캐즘 언제 끝나?',
    subtitle: '2차전지 ETF',
    emoji: '⚡',
    bullWinReason: '전기차 수요 회복 시그널 → 황소 완승 ㄷㄷ 캐즘 탈출 가시화',
    bearWinReason: '전기차 판매 부진 지속 → 곰 판정승 ㄹㅇ 캐즘 장기화 확인',
    bullLoserExcuse: [
      '전기차 캐즘이 예상보다 길어짐 보조금 확대 정책 기다리는 중',
      'CATL이 가격 경쟁 너무 심하게 함 정책 지원 없이는 힘듦',
      '전고체 배터리 상용화되면 판도 뒤집힘 기다림 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '보조금 정책 효과가 생각보다 빠르게 나타났음',
      '배터리 원가 하락이 수요를 이렇게 자극할 줄 몰랐음',
      'ESS 시장이 전기차 부진을 이렇게 상쇄할 줄 몰랐음',
    ],
  },
  {
    id: 'bio',
    title: '바이오 섹터 하반기 기대?',
    subtitle: '바이오 지수',
    emoji: '🧬',
    bullWinReason: 'FDA 승인 호재 + 금리 인하 기대 → 황소 완승 ㄷㄷ 바이오 랠리',
    bearWinReason: '임상 실패 + 고금리 지속 → 곰 판정승 ㄹㅇ 바이오 약세 지속',
    bullLoserExcuse: [
      '임상 3상 실패가 또 나왔음 하지만 파이프라인 풍부한 종목은 홀드',
      '금리 인하 확정되면 바이오 가장 수혜 섹터임 기다림',
      'GLP-1 시장 성장이 섹터 전체를 끌어올림 ㄷㄷ',
    ],
    bearLoserExcuse: [
      'FDA 신속 승인이 예상보다 많이 나왔음',
      '금리 인하 기대감이 바이오에 이렇게 빨리 반영될 줄은',
      'AI 신약 개발 모멘텀이 이렇게 강하게 작용할 줄 몰랐음',
    ],
  },
  {
    id: 'defense',
    title: '방산주 지정학 수혜 지속?',
    subtitle: '방산 ETF',
    emoji: '🛡️',
    bullWinReason: '나토 방위비 증액 + 수출 계약 → 황소 대승 ㄷㄷ 방산 신고가',
    bearWinReason: '휴전 협상 진전 → 곰 판정승 ㄹㅇ 지정학 프리미엄 축소',
    bullLoserExcuse: [
      '휴전 협상이 예상보다 빠르게 진전됨 하지만 국방비 증가 트렌드는 10년 이상 유효',
      '일시적 지정학 안정이고 근본적 긴장은 해소 안 됨',
      'K2 전차 추가 수주 기다리면 됨 ㄷㄷ 수출 파이프라인 탄탄',
    ],
    bearLoserExcuse: [
      '협상이 또 결렬됐음 지정학 리스크 과소평가했음',
      '나토 방위비 목표치 상향이 이렇게 빠를 줄 몰랐음',
      'K9 자주포 추가 계약 규모가 이렇게 클 줄은 몰랐음',
    ],
  },
  {
    id: 'reits',
    title: '리츠 금리 인하 수혜 받나?',
    subtitle: '리츠 ETF',
    emoji: '🏢',
    bullWinReason: '금리 인하 기대 강화 → 황소 완승 ㄷㄷ 리츠 배당 매력 부각',
    bearWinReason: '고금리 장기화 재확인 → 곰 판정승 ㄹㅇ 이자비용 부담 지속',
    bullLoserExcuse: [
      '금리 인하가 예상보다 늦어지고 있음 인하 확정 후 재진입 예정',
      '오피스 공실률 개선이 예상보다 느림 물류/데이터센터 리츠 주목',
      '데이터센터 리츠 AI 수요만으로도 충분함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '금리 인하 기대감이 리츠에 이렇게 선반영될 줄 몰랐음',
      '데이터센터 리츠 수요가 생각보다 강했음',
      '임대료 인상 폭이 이자비용 증가를 상쇄할 줄은 몰랐음',
    ],
  },
  {
    id: 'yen',
    title: '엔화 강세 반전 오나?',
    subtitle: 'JPY/KRW',
    emoji: '🇯🇵',
    bullWinReason: 'BOJ 금리 인상 단행 → 황소 완승 ㄷㄷ 엔캐리 청산 급등',
    bearWinReason: 'BOJ 동결 지속 → 곰 판정승 ㄹㅇ 엔화 약세 지속',
    bullLoserExcuse: [
      'BOJ가 또 쉬어감 금리 인상 속도가 너무 느림 기다리는 중',
      '엔캐리 포지션 규모가 예상보다 많이 청산됐음 다음 기회 노림',
      '일본 임금 상승 데이터 나오면 진짜 인상함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      'BOJ 금리 인상 깜짝 발표가 나왔음 이건 예측 불가였음',
      '엔캐리 청산 속도가 생각보다 빠를 줄 몰랐음',
      '일본 인플레 데이터가 이렇게 강하게 나올 줄은',
    ],
  },
  {
    id: 'china',
    title: '중국 증시 바닥 탈출 가능?',
    subtitle: '상해종합지수',
    emoji: '🇨🇳',
    bullWinReason: '중국 부양책 발표 → 황소 완승 ㄷㄷ 상해 지수 급반등',
    bearWinReason: '부동산 위기 지속 → 곰 판정승 ㄹㅇ 구조적 약세 재확인',
    bullLoserExcuse: [
      '부양책 규모가 예상보다 작았음 진짜 큰 부양책 나오면 재진입',
      '부동산 디레버리징이 생각보다 오래감 장기 포지션으로 접근',
      '중국 내수 소비 회복 데이터 나오면 반등함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '부양책 규모가 시장 예상을 훨씬 초과했음',
      '외국인 자금 유입이 이렇게 빠를 줄 몰랐음',
      'A주 PER 10배 저평가 인식이 이렇게 강하게 작용할 줄은',
    ],
  },
  {
    id: 'apple',
    title: '애플 AI 아이폰 슈퍼사이클?',
    subtitle: 'AAPL',
    emoji: '🍎',
    bullWinReason: '아이폰 교체 수요 폭발 → 황소 대승 ㄷㄷ Apple Intelligence 효과',
    bearWinReason: '중국 점유율 하락 → 곰 판정승 ㄹㅇ 슈퍼사이클 기대 실망',
    bullLoserExcuse: [
      '중국 화웨이 경쟁이 예상보다 치열함 하지만 프리미엄 시장은 애플 독점',
      'AI 기능 완성도가 출시 초기라 아직 덜 알려짐 내년 본격화',
      '서비스 매출 연 1000억불이 하드웨어 부진 상쇄함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      'Apple Intelligence 완성도가 생각보다 높았음',
      '충성 고객 교체 사이클이 이렇게 빠를 줄 몰랐음',
      'PER 28배 저평가 인식이 이렇게 강하게 부각될 줄은',
    ],
  },
  {
    id: 'tesla',
    title: '테슬라 머스크 리스크 해소?',
    subtitle: 'TSLA',
    emoji: '⚡🚗',
    bullWinReason: '로보택시 출시 + FSD 성장 → 황소 대승 ㄷㄷ 소프트웨어 전환 확인',
    bearWinReason: '브랜드 리스크 지속 → 곰 판정승 ㄹㅇ 유럽 판매 부진 현실화',
    bullLoserExcuse: [
      '로보택시 출시가 또 지연됐음 하지만 FSD 기술력은 독보적임',
      '머스크 리스크가 생각보다 오래감 정치적 이슈 해소 기다림',
      'Megapack 에너지 사업이 전기차 부진 상쇄함 ㄷㄷ',
    ],
    bearLoserExcuse: [
      '로보택시 발표가 시장 기대를 초과했음 실제 서비스 보고 재판단',
      'FSD 구독자 증가 속도가 이렇게 빠를 줄 몰랐음',
      '옵티머스 로봇 양산 소식이 이렇게 강한 호재일 줄은',
    ],
  },
]

const DEBATE_SCRIPTS: Record<string, DebateRound[]> = {
  kospi: [
    { side: 'bull', text: 'ㄹㅇ 외국인 순매수 3일 연속임 ㄷㄷ 이거 완전 상승 시그널 아님??' },
    { side: 'bear', text: '야 미국 금리 아직 안 내렸잖아 원달러 1380원인데 외인이 진짜 살 것 같냐ㅋㅋ' },
    { side: 'bull', text: '삼성전자 PBR 0.9배면 역사적 저점이라고 기관도 다 아는 사실임 지금 안 사면 후회함' },
    { side: 'bear', text: '저PBR이 진짜 바닥이면 왜 작년에도 그랬을 때 더 떨어졌냐고ㅠ 바닥 아래 지하가 있음' },
    { side: 'bull', text: '반도체 업사이클 + 외인 복귀 콤보 ㄷㄷ 이번엔 다름 2600 갑니다~~' },
  ],
  bitcoin: [
    { side: 'bull', text: '비트 ETF 자금 유입 주간 2조 ㄷㄷ 기관들 지금 줍줍 중임 개인이 팔 때 기관이 사는 거 역사가 증명함' },
    { side: 'bear', text: '반감기 이미 프라이싱 다 됐음 호재가 호재가 아닌 상황 지금 들어가면 봉잡는 거' },
    { side: 'bull', text: 'MicroStrategy 또 매수했다는 거 알지? 이 아저씨 틀린 적 없음 ㄹㅇ로' },
    { side: 'bear', text: '그 아저씨 레버리지 얼마인지 알고 있냐ㅋㅋ 청산당하는 날 같이 폭락함 조심해' },
    { side: 'bull', text: '디지털 금이라는 내러티브 한번 잡히면 못 꺾임 목표가 10만불 간다 🚀' },
  ],
  samsung: [
    { side: 'bull', text: 'HBM3E 퀄컴 인증 완료 소식 ㄷㄷ 엔비디아 납품 가시화되면 목표가 10만원임' },
    { side: 'bear', text: 'HBM은 SK하이닉스 독주 중인데 삼성이 따라잡는다는 거 언제 적 얘기냐ㅋ 매 분기 가이던스 하향' },
    { side: 'bull', text: 'PBR 0.9배 역사적 바닥 + 자사주 매입 발표 ㄹㅇ 이거 못 사면 투자 접어야 함' },
    { side: 'bear', text: '스마트폰 시장 포화 + 파운드리 점유율 하락 + 중국 제재 리스크 3콤보ㅠ 싸다고 다 사냐' },
    { side: 'bull', text: '삼성 망하면 코스피 망하는 거임 이건 그냥 한국 대장주 픽하는 거 ㄷㄷ' },
  ],
  dollar: [
    { side: 'bull', text: '미국 빅테크 실적 서프라이즈 + 연준 매파 스탠스 유지 → 달러 인덱스 105 향함 ㄷㄷ' },
    { side: 'bear', text: '원화 저평가 PPA 기준 30% 이상임 언젠가는 리밸런싱 옴 달러 지금 비쌈 ㄹㅇ로' },
    { side: 'bull', text: '안전자산 수요 + 일본 엔화 약세 콤보로 달러 강세 모멘텀 당분간 못 꺾음' },
    { side: 'bear', text: '한국 경상수지 흑자 기조 유지 중 달러 공급 계속 늘어나는데 1400 가는 건 과열임' },
    { side: 'bull', text: '지정학 리스크 + 미국 예외주의 계속되는 한 달러는 강하다 1400 돌파 고고씽~' },
  ],
  gold: [
    { side: 'bull', text: '중앙은행들 금 매입 역대급 ㄷㄷ 중국/러시아 달러 헤지로 금 쓸어담는 중 공급 한정임' },
    { side: 'bear', text: '금리 안 내리면 기회비용 너무 큼 채권 이자 5% 받는 게 낫지 금이 왜 필요함ㅋ' },
    { side: 'bull', text: '인플레이션 재가속 우려 + 지정학 프리미엄 겹치면 온스당 3000불도 가능 ㄹㅇ' },
    { side: 'bear', text: '3000불 이미 왔다 갔음 ㅋㅋ 기술적 과매수 신호 나오는 중 고점에 물리는 거 아님?' },
    { side: 'bull', text: '달러 패권 흔들리는 세상에서 금은 진짜 돈임 2025년 최고 자산 등극 확실' },
  ],
  hynix: [
    { side: 'bull', text: 'HBM3E 엔비디아 독점 공급 ㄷㄷ AI 인프라 투자 안 줄어드는 한 하이닉스 실적 보장됨' },
    { side: 'bear', text: '이미 주가에 다 반영됐잖아 PER 15배면 반도체 치고 비쌈 지금은 쉬어가는 타이밍' },
    { side: 'bull', text: 'AI 데이터센터 HBM 수요 2026년까지 CAGR 80% ㄹㅇ 이 숫자가 말해줌' },
    { side: 'bear', text: '삼성도 HBM 퀄 맞추면 독점 깨짐 공급 늘면 가격 하락 사이클 반도체는 사이클이 있다고' },
    { side: 'bull', text: 'AI 반도체 대장주 하이닉스 20만원 가는 거 시간 문제임 지금 못 사면 땅 치고 후회함 ㄷㄷ' },
  ],
  nasdaq: [
    { side: 'bull', text: '빅테크 EPS 성장률 15%+ 유지 중 금리 내려오면 멀티플 확장 나스닥 2만5천 간다 ㄷㄷ' },
    { side: 'bear', text: 'M7 쏠림 심각함 상위 7개 종목이 지수의 30% 이건 버블 징조임 조정 언제 와도 이상 안 함' },
    { side: 'bull', text: 'AI 인프라 투자 사이클 이제 시작임 엔비디아 TSMC 수요 꺾이려면 몇 년은 더 걸림' },
    { side: 'bear', text: '미국 소비자 신용카드 연체율 역대급인데 실물경제 꺾이면 주식도 못 버팀 ㅠ' },
    { side: 'bull', text: '소프트랜딩 성공 + AI 생산성 혁명 = 강세장 지속 나스닥 팔면 평생 후회함 ㄹㅇ' },
  ],
  oil: [
    { side: 'bull', text: 'OPEC+ 감산 연장 + 중국 경기 회복 기대감 ㄷㄷ 여름 드라이빙 시즌 수요까지 겹치면 80불 간다' },
    { side: 'bear', text: '미국 셰일 증산 속도 보면 OPEC 감산 효과 다 상쇄됨 공급 과잉 구조적 문제 있음' },
    { side: 'bull', text: '지정학 프리미엄 중동 리스크 계속 살아있음 호르무즈 뭔 일 나면 100불 순식간임' },
    { side: 'bear', text: '전기차 보급 속도 생각해봐 10년 내 피크오일 수요 온다 장기 하향 추세는 못 꺾음' },
    { side: 'bull', text: '단기 수급 타이트 + 지정학 프리미엄 유가 강세 베팅 이번 분기는 황소가 맞음 ㄹㅇ' },
  ],
  kakao: [
    { side: 'bull', text: '카카오 PER 20배 이하로 내려왔음 ㄷㄷ 플랫폼 독점력 대비 완전 저평가 아님?' },
    { side: 'bear', text: '공정위 규제 + 문어발 확장 제동 걸린 거 알지? 성장 스토리 끝났음 ㄹㅇ로 매출증가율 -12%' },
    { side: 'bull', text: '카카오페이 월간 사용자 2400만 ㄷㄷ 핀테크 수익화 본격화되면 목표가 10만원 간다' },
    { side: 'bear', text: '카카오뱅크·카카오페이 다 따로 상장해서 지주사 할인 심각함 ㅠ NAV 대비 40% 할인 말이 됨?' },
    { side: 'bull', text: '카카오톡 MAU 4800만 이 플랫폼이 망하는 건 한국이 망하는 거임 지금이 저점 ㄷㄷ' },
  ],
  lgenergy: [
    { side: 'bull', text: 'IRA 보조금으로 미국 공장 EBITDA 마진 12% 달성 ㄷㄷ 경쟁사 대비 원가 우위 확실' },
    { side: 'bear', text: '전기차 판매 성장률 전년비 -8% ㄹㅇ 캐즘 예상보다 깊고 길다 배터리 재고 쌓이는 중' },
    { side: 'bull', text: '에너지저장장치(ESS) 수주 급증 ㄷㄷ 전기차 외 매출 다변화 성공하면 밸류에이션 재평가' },
    { side: 'bear', text: 'CATL 리튬인산철 배터리 가격 40% 더 쌈 LG엔솔이 삼원계로 원가 싸움 가능함? 솔직히 힘듦' },
    { side: 'bull', text: '2026년 전기차 보급률 20% 넘으면 캐즘 끝 그때 LG엔솔 들고 있는 사람이 웃음 ㄹㅇ' },
  ],
  hyundai: [
    { side: 'bull', text: '현대차 EPS 3만5천원 ㄷㄷ PER 5배면 글로벌 완성차 최저 수준 이건 진짜 저평가' },
    { side: 'bear', text: '원달러 1350원 되면 수출 수익성 직격탄임 환율 민감도 높은 종목인데 달러 약세 오면 어떡함' },
    { side: 'bull', text: '미국 조지아 공장 본격 가동 ㄷㄷ 관세 리스크 헤지 + 현지화로 경쟁력 오히려 강화됨' },
    { side: 'bear', text: '전기차 전환 투자비용 연 10조 ㄹㅇ 이 돈 다 써야 하는데 배당 지속 가능함? 의심스러움' },
    { side: 'bull', text: '배당수익률 4%+ 자사주 매입까지 주주환원 강화 외국인 입장에서 이게 안 매력적이면 뭐가 매력적임' },
  ],
  posco: [
    { side: 'bull', text: '아르헨티나 리튬 광산 생산량 연 10만톤 ㄷㄷ 리튬 가격 반등하면 POSCO 실적 완전 레버리지' },
    { side: 'bear', text: '리튬 가격 톤당 1만3천불 수준인데 5만불 시절 대비 한참 멀었음 ㄹㅇ 수익화 언제 됨?' },
    { side: 'bull', text: '철강 PBR 0.4배 ㄷㄷ 전세계 철강 대장주 중 최저 밸류 + 리튬 옵션가치 완전 무료로 얹어줌' },
    { side: 'bear', text: '중국 보조금 철강 덤핑 → 글로벌 철강 가격 하방 압력 ㅠ 리튬도 중국이 공급 장악하면 끝' },
    { side: 'bull', text: '2차전지 소재 + 철강 + 리튬 삼각 포트폴리오 ㄷㄷ 이런 밸류에 이 자산이 있는 게 말이 됨?' },
  ],
  naver: [
    { side: 'bull', text: '하이퍼클로바X 기업 B2B 계약 전년비 300% 증가 ㄷㄷ AI 수익화 본격화 시그널 왔음' },
    { side: 'bear', text: '구글 AI 오버뷰 한국어 서비스 시작 ㄹㅇ 검색 트래픽 15% 잠식 광고 매출 직격탄 불가피' },
    { side: 'bull', text: '네이버 쇼핑 GMV 40조 ㄷㄷ 커머스 생태계는 구글이 뺏어갈 수 없음 검색보다 커머스가 본체' },
    { side: 'bear', text: '웹툰 북미 MAU 성장 둔화 + 라인 지분 축소 ㄹㅇ 해외 성장 스토리 흔들리는 중 ㅠ' },
    { side: 'bull', text: '한국어 AI + 커머스 + 금융 생태계 구글이 3년 안에 따라올 수 있음? 네이버 독보적 ㄹㅇ' },
  ],
  celltrion: [
    { side: 'bull', text: '유플라이마 미국 시장점유율 18% 돌파 ㄷㄷ 휴미라 바이오시밀러 1위 굳히기 완전 가시화' },
    { side: 'bear', text: '짐펜트라 처방 데이터 기대 이하 ㄹㅇ 신약 출시 비용만 쓰고 매출 부진하면 EPS 하향 불가피' },
    { side: 'bull', text: '2025년 바이오시밀러 파이프라인 12개 ㄷㄷ 하나씩 허가 나올 때마다 밸류업 가능 기대됨' },
    { side: 'bear', text: '오리지널 제약사들 특허 방어 소송 + 가격 인하 맞불 ㅠ 바이오시밀러 마진율 점점 낮아지는 중' },
    { side: 'bull', text: '글로벌 바이오시밀러 시장 2028년 100조 ㄷㄷ 셀트리온 이 시장 1등 먹으면 주가 지금의 3배' },
  ],
  kakaobank: [
    { side: 'bull', text: '카카오뱅크 대출 성장률 전년비 22% ㄷㄷ 인터넷은행 중 압도적 1위 성장세 유지' },
    { side: 'bear', text: '가계부채 규제 강화로 대출 성장 제한 불가피 PBR 2.5배면 은행주 중 최고 고평가 ㄹㅇ' },
    { side: 'bull', text: '26세 이하 고객 비중 40% ㄷㄷ 이 세대가 자산 형성하면 10년간 모기지 고객으로 전환됨' },
    { side: 'bear', text: '연체율 1.2% → 1.8% 빠르게 상승 중 고금리 장기화로 중저신용자 리스크 본격화될 듯' },
    { side: 'bull', text: '카카오 플랫폼 4800만 MAU 기반 금융 슈퍼앱 전환 ㄷㄷ 이 해자는 토스도 못 뚫음 ㄹㅇ' },
  ],
  krafton: [
    { side: 'bull', text: '인도 배그 모바일 MAU 8700만 ㄷㄷ 인구 14억 시장에서 이미 국민 게임 됐음 성장 여전히 초기' },
    { side: 'bear', text: '인도 정부 규제 리스크 실존함 ㄹㅇ 2022년 반년 서비스 중단 기억 못 함? 언제든 재발 가능' },
    { side: 'bull', text: '신작 다크앤다커 모바일 + 인조이 출시 ㄷㄷ 배그 의존도 낮추는 포트폴리오 다변화 진행 중' },
    { side: 'bear', text: '인도 ARPU 월 200원 수준 ㄹㅇ MAU 많아봐야 매출로 안 이어지면 의미 없음 수익화가 관건' },
    { side: 'bull', text: '배그 IP 글로벌 누적 다운로드 10억 ㄷㄷ 이런 IP 가진 게임사 PER 15배면 솔직히 저평가 맞음' },
  ],
  us_rate: [
    { side: 'bull', text: 'PCE 2.3%로 목표치 근접 ㄷㄷ 연준이 인하 안 할 이유가 없어짐 연내 2회 인하 가능' },
    { side: 'bear', text: '서비스 CPI 3.8% 아직 높음 ㄹㅇ 임금 상승률 4%+ 유지 중인데 인플레 잡혔다고 볼 수 없음' },
    { side: 'bull', text: '실업률 4.3%로 상승 시작 ㄷㄷ 고용 둔화 + 인플레 하락 콤보 연준이 선제 인하할 근거 충분' },
    { side: 'bear', text: '파월이 "데이터 의존적" 이 말 반복하는 동안 절대 인하 없음 ㄹㅇ 시장이 인하 기대 선반영 과도함' },
    { side: 'bull', text: '금리 선물 시장 연내 2.5회 인하 반영 중 ㄷㄷ 스마트머니가 이미 베팅함 역행하면 손해 봄' },
  ],
  kr_realestate: [
    { side: 'bull', text: '서울 아파트 입주 물량 2025년 3만→2026년 1.5만 ㄷㄷ 공급 반토막인데 가격이 안 오르면 이상한 거' },
    { side: 'bear', text: '가계부채 GDP 대비 100% 돌파 ㄹㅇ 금융당국 DSR 규제 강화 필연적 대출 못 받으면 집 못 삼' },
    { side: 'bull', text: '강남 3구 학군지 수요는 금리와 무관함 ㄷㄷ 교육 프리미엄 없어지지 않는 한 핵심지 가격 못 꺾음' },
    { side: 'bear', text: '인구 감소 출생률 0.7명 ㄹㅇ 20년 후 지방 집값 어떻게 될지 뻔함 인구 구조적 하락이 답임' },
    { side: 'bull', text: '금리 인하 사이클 시작되면 대기 수요 폭발 ㄷㄷ 지금 관망하는 사람들 들어오면 한방에 올라감' },
  ],
  usdkrw: [
    { side: 'bull', text: '연준 고금리 유지 + 한은 금리 인하 기조 금리 차이 벌어지면 원화 약세 심화 ㄷㄷ 1400 돌파' },
    { side: 'bear', text: '반도체 수출 회복으로 무역수지 흑자 전환 ㄹㅇ 달러 공급 늘면 원달러 1300 중반 복귀 가능' },
    { side: 'bull', text: '외국인 주식 순매도 + 경상수지 계절적 적자 ㄷㄷ 수급 측면에서 원화 약세 압력 단기 강함' },
    { side: 'bear', text: '원화 PPA 대비 30% 저평가 ㄹㅇ 이 괴리 언젠가 메워짐 달러 지금 사면 고점 물릴 수 있음' },
    { side: 'bull', text: '지정학 리스크 + 강달러 + 계절성 3콤보 ㄷㄷ 단기 1420 가는 거 충분히 가능한 그림임' },
  ],
  inflation: [
    { side: 'bull', text: 'WTI 유가 반등 + 농산물 가격 급등 ㄷㄷ 에너지·식품 제외해도 근원 CPI 3%대 고착화 중' },
    { side: 'bear', text: '임금 상승률 둔화 시작 ㄹㅇ 소비자 지출 줄면서 서비스 가격 상방 압력 완화 디스인플레 방향' },
    { side: 'bull', text: '집세(OER) 비중 CPI의 36% ㄷㄷ 주거비 하락 시차가 6개월인데 지금 데이터가 아직 고점 반영 중' },
    { side: 'bear', text: '중국 디플레 수출 효과 ㄹㅇ 중국 공장 과잉 생산이 글로벌 소비재 가격 낮추는 중 이 힘 강함' },
    { side: 'bull', text: '임금-물가 스파이럴 한번 시작되면 못 꺾음 ㄷㄷ 1970년대 반복 가능성 연준도 두려워하는 시나리오' },
  ],
  recession: [
    { side: 'bull', text: '비농업 고용 월 20만명+ 유지 ㄷㄷ 이 고용 수치로 침체 논하는 건 너무 앞서나감 소프트랜딩 간다' },
    { side: 'bear', text: '수익률 곡선 역전 18개월째 ㄹㅇ 역사적으로 이게 지속되면 100% 침체 왔음 이번만 다를 것 같냐' },
    { side: 'bull', text: '초과저축 여전히 5000억불 남아있음 ㄷㄷ 소비자가 이 돈 쓰는 동안 침체 없음 2025년은 안전' },
    { side: 'bear', text: '소비자 신용카드 연체율 10년 만에 최고 ㄹㅇ 초과저축 바닥 나면 소비 급락 올 수 있음 조심해야' },
    { side: 'bull', text: 'GDP 성장률 2.8% ㄷㄷ 이 성장률 나오는 경제가 침체? 선행 지표 과도하게 해석하는 거임 ㄹㅇ' },
  ],
  ai_chip: [
    { side: 'bull', text: '엔비디아 H100 대기 수요 12개월치 ㄷㄷ 공급이 수요 못 따라가는 시장에서 가격 하락 없음' },
    { side: 'bear', text: 'AI 투자 대비 ROI 입증된 기업 몇 개임? ㄹㅇ 빅테크 CAPEX 연 2000억불인데 수익화 언제 됨?' },
    { side: 'bull', text: 'TSMC CoWoS 패키징 생산 능력 2배 확장 ㄷㄷ 공급망 풀리면 엔비디아 매출 또 서프라이즈 나옴' },
    { side: 'bear', text: '커스텀 AI칩 구글 TPU + AWS Trainium ㄹㅇ 엔비디아 독점 깨지는 건 시간 문제 마진 압박 온다' },
    { side: 'bull', text: 'AI 반도체 TAM 2030년 1000조 ㄷㄷ 지금 시장 100조도 안 됨 성장 여정 이제 10% 온 것' },
  ],
  battery: [
    { side: 'bull', text: '전기차 배터리 팩 가격 kWh당 100불 하향 돌파 ㄷㄷ 이 가격이면 내연기관차와 TCO 동등해짐 수요 폭발' },
    { side: 'bear', text: '유럽 전기차 판매 전년비 -15% ㄹㅇ 보조금 없으면 안 팔린다는 게 증명됨 캐즘 구조적 문제임' },
    { side: 'bull', text: '전고체 배터리 2027년 상용화 로드맵 ㄷㄷ 선점하는 업체가 다음 10년 먹음 지금이 투자 적기' },
    { side: 'bear', text: 'BYD 리튬인산철 배터리 kWh당 50불 ㄹㅇ 한국 배터리 업체 원가 경쟁력으로 이기는 게 가능함?' },
    { side: 'bull', text: 'ESS 시장 2030년 200조 ㄷㄷ 전기차 둔화해도 에너지저장 수요가 다 받아줌 배터리 업황 바닥 찍음' },
  ],
  bio: [
    { side: 'bull', text: 'FDA 신약 승인 건수 전년비 30% 증가 ㄷㄷ 규제 환경 우호적 바뀌면 바이오 섹터 전체 멀티플 확장' },
    { side: 'bear', text: '임상 3상 성공률 15% ㄹㅇ 85%가 실패하는 게임인데 개인이 종목 픽하는 건 도박임 ETF도 위험해' },
    { side: 'bull', text: 'GLP-1 비만 치료제 시장 2030년 150조 ㄷㄷ 일라이릴리·노보노디스크 실적 봐 바이오 황금기 맞음' },
    { side: 'bear', text: '금리 5% 환경에서 수익 없는 바이오 할인율 치명적 ㄹㅇ 금리 안 내리면 소형 바이오 자금 조달 불가' },
    { side: 'bull', text: 'AI 신약 개발 임상 기간 50% 단축 ㄷㄷ 성공률 높아지면 바이오 밸류에이션 리레이팅 온다 ㄹㅇ' },
  ],
  defense: [
    { side: 'bull', text: '나토 방위비 GDP 3% 목표 공식화 ㄷㄷ 이게 10년간 지속되면 방산 수주 사상 최대 사이클 시작' },
    { side: 'bear', text: '우크라이나 휴전 협상 진전되면 방산주 수혜 끝 ㄹㅇ 지정학 이슈가 주가에 선반영 과도하게 됐음' },
    { side: 'bull', text: '한국 K2 전차 + K9 자주포 폴란드 수출 계약 20조 ㄷㄷ 이건 다음 10년 먹거리 계약 완료된 거임' },
    { side: 'bear', text: '방산 마진율 8% ㄹㅇ PER 30배 받는 게 말이 됨? 수주 있어도 이익률 낮으면 밸류 정당화 어려움' },
    { side: 'bull', text: '중동 + 동유럽 + 인태 지역 동시 긴장 ㄷㄷ 지정학 다극화 시대에 방산 수요는 구조적으로 증가함' },
  ],
  reits: [
    { side: 'bull', text: '금리 인하 25bp마다 리츠 배당 매력 10% 상승 ㄷㄷ 인하 사이클 시작되면 리츠 최대 수혜 섹터' },
    { side: 'bear', text: '오피스 공실률 18% 역대급 ㄹㅇ 재택근무 정착된 세상에서 오피스 리츠 회복은 10년 걸림' },
    { side: 'bull', text: '데이터센터 리츠 AI 수요 폭발 ㄷㄷ 에퀴닉스·디지털리얼티 임대료 전년비 15% 인상 가능' },
    { side: 'bear', text: '리츠 레버리지 평균 40% ㄹㅇ 고금리 환경에서 이자 비용 급증 → 배당 축소 → 주가 하락 악순환' },
    { side: 'bull', text: '물류센터 리츠 e커머스 침투율 상승과 함께 임대 수요 증가 ㄷㄷ 오피스 제외하면 리츠 나쁘지 않음' },
  ],
  yen: [
    { side: 'bull', text: 'BOJ 금리 0.25% → 0.5% 인상 ㄷㄷ 일본 국채 금리 상승하면 엔캐리 트레이드 청산 강제됨' },
    { side: 'bear', text: '일본 수출 기업들 엔화 강세 원하지 않음 ㄹㅇ 도요타·소니 다 반대 로비 BOJ 독립성 한계 있음' },
    { side: 'bull', text: '엔캐리 잔고 추정 500조엔 ㄷㄷ 이게 청산되면 엔화 급등 + 글로벌 위험자산 동시 급락 올 수 있음' },
    { side: 'bear', text: '일본 임금 상승률 3%+ 유지 필요한데 소비 둔화 중 ㄹㅇ BOJ가 공격적 인상 못 하는 구조적 이유 있음' },
    { side: 'bull', text: '달러엔 155→140 가면 원달러도 연동해서 하락 ㄷㄷ 엔화 강세 오면 신흥국 통화 전반 강세 전환' },
  ],
  china: [
    { side: 'bull', text: '중국 정부 부양 패키지 10조 위안 ㄷㄷ 이 규모면 부동산 디레버리징 속도 조절 가능 증시 반등 나옴' },
    { side: 'bear', text: '헝다·비구이위안 사태 아직 진행 중 ㄹㅇ 부동산 PF 부실 전체 GDP 대비 30% 이게 단기에 해소됨?' },
    { side: 'bull', text: 'A주 PER 10배 미만 ㄷㄷ 선진국 20배 대비 역대급 저평가 여기서 더 빠지면 중국 경제 붕괴 가정해야 함' },
    { side: 'bear', text: '미중 관세 60% + 기술 디커플링 ㄹㅇ 외국인 FDI 급감 구조적으로 중국 성장 잠재력 훼손된 상태' },
    { side: 'bull', text: '중국 소비 내수 회복 + AI 산업 육성 정책 ㄷㄷ 화웨이 AI칩 자립화되면 중국 테크 리레이팅 가능' },
  ],
  apple: [
    { side: 'bull', text: 'Apple Intelligence 탑재 아이폰16 교체 수요 8억대 추정 ㄷㄷ 슈퍼사이클 오면 EPS 10% 상향 예상' },
    { side: 'bear', text: '중국 화웨이 메이트 시리즈 반격 ㄹㅇ 애플 중국 시장점유율 17% → 12%로 하락 중 이 시장 못 지키면' },
    { side: 'bull', text: '앱스토어 + 애플뮤직 + iCloud 서비스 매출 연 1000억불 ㄷㄷ 하드웨어 없어도 먹고 사는 회사 됐음' },
    { side: 'bear', text: 'AI 기능이 삼성·구글 대비 6개월 후발주자 ㄹㅇ 충성도 높지만 기술 격차 없어지면 교체 유인 줄어듦' },
    { side: 'bull', text: 'PER 28배 빅테크 최저 수준 + 자사주 매입 연 800억불 ㄷㄷ 이 밸류에서 팔 이유가 없음 ㄹㅇ로' },
  ],
  tesla: [
    { side: 'bull', text: '로보택시 오스틴 출시 + FSD 구독자 200만명 ㄷㄷ 하드웨어 회사 → 소프트웨어 회사 전환 완성' },
    { side: 'bear', text: '머스크 DOGE 활동 브랜드 이미지 훼손 ㄹㅇ 유럽 판매량 -45% YoY 이게 일시적이라고 볼 수 있음?' },
    { side: 'bull', text: '에너지 저장 사업 Megapack 매출 전년비 67% ㄷㄷ 전기차 부진해도 에너지 사업이 실적 받쳐줌' },
    { side: 'bear', text: 'FSD 완전 자율주행 약속 10년째 ㄹㅇ 로보택시 또 지연되면 PER 80배 정당화 불가 과대평가 확실' },
    { side: 'bull', text: '옵티머스 로봇 양산 시작 ㄷㄷ 로봇 시장 2030년 1000조 테슬라 이 시장까지 먹으면 지금 가격 싼 거' },
  ],
}

const RESULT_REACTIONS: Record<'bull' | 'bear', { win: string; lose: string }> = {
  bull: {
    win: 'ㄹㅇ 내가 뭐랬어!! 황소가 항상 옳다고!! 곰아 다음에 봐라 🐂💪',
    lose: '...일시적 조정임 ㄹㅇ로 내 분석은 맞음 시장이 틀린 거야 (억울) 다음엔 꼭 이김',
  },
  bear: {
    win: 'Zzz... 그러니까 내가 맞다고 했잖아 황소들 이제 인정해라 하락장 전문가 🐻📉',
    lose: '아니 이게 왜 오름?? ㅋㅋ 분명히 하락해야 맞는데... 다음 배틀에서 설욕한다',
  },
}

export function getTodayBattle(date: string): MockBattle {
  const seed = dateToSeed(date)
  const topicIdx = Math.abs(Math.floor(lcg(seed) * TOPICS.length)) % TOPICS.length
  const topic = TOPICS[topicIdx]
  const rounds = DEBATE_SCRIPTS[topic.id] ?? DEBATE_SCRIPTS['kospi']

  const resultSeed = lcg(seed + 1)
  const result: 'bull' | 'bear' = resultSeed > 0.5 ? 'bull' : 'bear'

  const communitySeed = lcg(seed + 2)
  const communityBullPercent = Math.round(45 + communitySeed * 30) // 45~75

  return { topic, rounds, result, communityBullPercent }
}

export function getBattleResult(date: string): 'bull' | 'bear' {
  return getTodayBattle(date).result
}

export function getResultReaction(side: 'bull' | 'bear', won: boolean): string {
  return RESULT_REACTIONS[side][won ? 'win' : 'lose']
}

export function getWinReason(date: string): string {
  const battle = getTodayBattle(date)
  return battle.result === 'bull'
    ? battle.topic.bullWinReason
    : battle.topic.bearWinReason
}

export function getLoserExcuse(date: string, losingSide: 'bull' | 'bear'): string {
  const battle = getTodayBattle(date)
  const excuses = losingSide === 'bull'
    ? battle.topic.bullLoserExcuse
    : battle.topic.bearLoserExcuse
  const seed = dateToSeed(date)
  const idx = Math.abs(Math.floor(lcg(seed + 3) * excuses.length)) % excuses.length
  return excuses[idx]
}
