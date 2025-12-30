// 금액 포맷: "650000원" → "650,000원"
export function formatPrice(price: string | number): string {
    if (!price) return '0원';

    const numericPrice = typeof price === 'string'
        ? price.replace(/[^0-9]/g, '')
        : price.toString();

    return Number(numericPrice).toLocaleString('ko-KR') + '원';
}

// 동 포맷: "208" → "208동"
export function formatDong(dong: string): string {
    if (!dong) return '';
    return dong.endsWith('동') ? dong : `${dong}동`;
}

// 호수 포맷: "701" → "7호라인" (개인정보 보호)
export function formatHosu(hosu: string): string {
    if (!hosu) return '';

    // 호수의 첫 번째 숫자만 추출 (701 → 7)
    const line = hosu.charAt(0);
    return `${line}호라인`;
}

// 시공 유형 포맷 (수정됨: "도어짝도어" 같은 중복 제거)
export function formatConstructionType(type: string): string {
    if (!type) return '';

    // 원본 그대로 반환할 키워드들
    const directTypes = ['도어짝', '도어세트', '원슬라이딩', '3연동', '4연동', '2연동'];

    // 끝의 숫자 제거
    let formatted = type.replace(/\d+$/, '').trim();

    // "일반" 제거
    formatted = formatted.replace('일반', '').trim();

    // 슬래시로 구분된 경우 첫 번째 항목만 사용
    if (formatted.includes('/')) {
        formatted = formatted.split('/')[0].trim();
    }

    // 직접 반환할 타입 체크
    for (const directType of directTypes) {
        if (formatted.includes(directType)) {
            return formatted;
        }
    }

    return formatted;
}

// 시공 카테고리 판별 (중문 vs 도어)
export function getConstructionCategory(type: string): '중문' | '도어' | '기타' {
    if (!type) return '기타';

    const lowerType = type.toLowerCase();

    // 중문 키워드
    if (lowerType.includes('중문') ||
        lowerType.includes('슬라이딩') ||
        lowerType.includes('연동')) {
        return '중문';
    }

    // 도어 키워드
    if (lowerType.includes('도어') ||
        lowerType.includes('짝') ||
        lowerType.includes('세트')) {
        return '도어';
    }

    return '기타';
}

// 동호수 전체 포맷: "208동 7호라인"
export function formatDongHosu(dong: string, hosu: string): string {
    return `${formatDong(dong)} ${formatHosu(hosu)}`;
}
