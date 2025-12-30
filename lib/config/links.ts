// 외부 링크 URL 중앙 관리
export const EXTERNAL_LINKS = {
    // 네이버 예약 - 무료 방문 실측 견적
    naverBooking: 'https://booking.naver.com/booking/5/bizes/654913/items/6032347',

    // 카카오톡 채널 상담
    kakaoTalk: 'http://pf.kakao.com/_EXUHT/chat',

    // 네이버 톡톡 상담
    naverTalkTalk: 'https://talk.naver.com/ct/wccb8p',

    // 대표번호
    phoneNumber: '1599-6065',
    phoneLink: 'tel:1599-6065',
} as const;

// 회사 정보
export const COMPANY_INFO = {
    name: '문장군',
    nameEn: 'MUNJANGGUN',
    description: '도어/중문 전문 시공 기업',
    copyright: '© 2024 문장군 MUNJANGGUN. All rights reserved.',
    phone: '1599-6065',
} as const;

// 마케팅/로딩 메시지 (위트있고 실용적인 문구들)
export const MARKETING_MESSAGES = [
    // 중문 효과
    { icon: '💰', text: '중문으로 연간 냉난방비 100만원 절약!', category: '절약' },
    { icon: '❄️', text: '겨울철 결로 현상? 중문이면 걱정 끝!', category: '효과' },
    { icon: '🔥', text: '여름엔 시원하게, 겨울엔 따뜻하게!', category: '효과' },
    { icon: '🏠', text: '현관 냉기 차단의 비밀, 바로 중문입니다', category: '효과' },
    { icon: '📉', text: '난방비 폭탄 걱정? 중문 하나로 해결!', category: '절약' },

    // 문장군 장점
    { icon: '🏆', text: '20년 경력 장인의 손끝에서 탄생하는 품질', category: '장점' },
    { icon: '⭐', text: '시공 후 만족도 98%! 문장군을 선택한 이유', category: '장점' },
    { icon: '🛡️', text: 'AS 걱정 NO! 책임지는 문장군 사후관리', category: '장점' },
    { icon: '✨', text: '디자인도 성능도, 문장군은 포기하지 않습니다', category: '장점' },
    { icon: '📐', text: 'mm 단위까지 정밀한 맞춤 시공', category: '장점' },

    // 도어 관련
    { icon: '🚪', text: '방문 하나 바꿨을 뿐인데 집이 달라졌어요', category: '도어' },
    { icon: '🎨', text: '우리 집 분위기를 바꾸는 가장 쉬운 방법, 도어!', category: '도어' },
    { icon: '🔇', text: '층간 소음 걱정? 방음 도어로 해결!', category: '도어' },

    // 재미있는 문구
    { icon: '☕', text: '커피 한 잔 값으로 하루 난방비 아끼는 법', category: '재미' },
    { icon: '🎁', text: '올해 우리 집 최고의 선물, 중문 시공!', category: '재미' },
    { icon: '💡', text: '알뜰한 주부들의 선택, 문장군 중문', category: '재미' },
    { icon: '🌡️', text: '체감온도 3도 UP! 중문의 마법', category: '효과' },
] as const;

// 랜덤 마케팅 메시지 가져오기
export function getRandomMessage() {
    const idx = Math.floor(Math.random() * MARKETING_MESSAGES.length);
    return MARKETING_MESSAGES[idx];
}

// 카테고리별 메시지 가져오기
export function getMessagesByCategory(category: string) {
    return MARKETING_MESSAGES.filter(m => m.category === category);
}
