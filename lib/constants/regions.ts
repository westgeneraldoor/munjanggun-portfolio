// 시공 서비스 제공 지역
export const ALLOWED_REGIONS = [
    '서울',
    '경기',
    '인천',
    '대전',
    '세종',
    '충북', '충남',
    '충청'
] as const;

// 허용된 도시 키워드 (중복 제거 및 정리)
export const ALLOWED_CITIES = [
    // 서울
    '서울', '강남', '강북', '강서', '강동', '마포', '용산', '성북', '동대문', '서대문',
    '영등포', '송파', '관악', '구로', '금천', '노원', '도봉', '양천', '은평', '종로', '중구',

    // 경기도
    '경기', '수원', '성남', '고양', '용인', '부천', '안산', '안양', '남양주', '화성',
    '평택', '의정부', '시흥', '파주', '김포', '광명', '광주', '군포', '하남', '오산',
    '양주', '이천', '구리', '안성', '포천', '의왕', '양평', '여주', '동두천', '과천',
    '가평', '연천', '분당', '일산', '판교', '동탄',

    // 인천
    '인천', '부평', '남동', '연수', '미추홀', '계양', '인천서구', '인천중구', '인천동구',
    '강화', '옹진', '검단', '송도',

    // 대전
    '대전', '유성', '대전서구', '대전중구', '대전동구', '대덕',

    // 세종
    '세종',

    // 충청북도
    '청주', '충북', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양',

    // 충청남도
    '천안', '아산', '충남', '공주', '보령', '서산', '논산', '계룡', '당진', '금산',
    '부여', '서천', '청양', '홍성', '예산', '태안'
] as const;

/**
 * 주소에서 허용 지역인지 확인
 */
export function isAllowedRegion(address: string | undefined): boolean {
    if (!address) return false;

    const normalizedAddress = address.toLowerCase();
    return ALLOWED_CITIES.some(city => normalizedAddress.includes(city.toLowerCase()));
}

/**
 * 아파트명에서 지역 확인 (일부 아파트는 이름에 지역이 포함)
 */
export function isAllowedApartmentName(name: string | undefined): boolean {
    if (!name) return false;

    const normalizedName = name.toLowerCase();
    return ALLOWED_CITIES.some(city => normalizedName.includes(city.toLowerCase()));
}
