// Google Sheets 데이터 타입 정의
export interface Apartment {
    아파트명: string;
    주소: string;
    준공년: string;
    준공월: string;
    면적: string;
    constructionCount?: number; // 시공 내역 개수 (검색 결과용)
}

export interface Estimate {
    시공ID: string;
    "총합계(온라인포함)": string;
    정산완료여부: string;
    아파트여부: string;
    아파트명: string;
    아파트주소: string;
    아파트동: string;
    아파트호수: string;
}

export interface Construction {
    시공관리ID: string;
    시공ID: string;
    시공구분: string;
    도어시공내역: string;
    중문시공내역: string;
    시공완료여부: string;
    시공내역: string;
}

export interface Photo {
    시공완료사진ID: string;
    시공관리ID: string;
    시공완료사진: string;
    시공완료사진링크: string;
}

// === 신규 시트 타입 (고객 노출용) ===

// 연동중문 스펙
export interface 연동중문스펙 {
    중문규격ID: string;
    시공관리ID: string;
    중문시공위치: string;
    중문타입: string; // 3연동일반, 3연동ㄱ자
    등급: string;
    다대: string;
    디자인: string;
    속대색상: string;
    중문색상: string;
    중문유리: string;
    고시유리?: string;
    파티션색상?: string;
    파티션유리?: string;
    파티션속대색상?: string;
}

// 원슬라이딩 스펙
export interface 원슬라이딩스펙 {
    원슬라이딩ID: string;
    시공관리ID: string;
    중문시공위치: string;
    등급: string;
    디자인: string;
    유리: string;
    손잡이: string;
    색상: string;
}

// 도어 스펙
export interface 도어스펙 {
    도어규격ID: string;
    시공관리ID: string;
    품목: string;
    상세: string;
    유리?: string;
    색상: string;
    시공위치: string;
}

// 일반견적
export interface 일반견적 {
    견적서ID: string;
    시공ID: string;
    작성일자: string;
    품목: string;
    단가: number | string;
    수량: number | string;
}

// 온라인견적
export interface 온라인견적 {
    온라인견적서ID: string;
    시공ID: string;
    구분: string;
    옵션품목: string;
    단가: number | string;
    수량: number | string;
}

// === 통합 타입 (UI 표시용) ===

// 시공 항목 (중문 또는 도어)
export interface 시공항목 {
    타입: '연동중문' | '원슬라이딩' | '도어';
    위치: string;
    등급?: string;
    옵션: {
        색상?: string;
        유리?: string;
        디자인?: string;
        손잡이?: string;
        품목?: string;
        상세?: string;
    };
    금액?: number;
}

// 견적 항목
export interface 견적항목 {
    출처: '일반' | '온라인';
    품목: string;
    단가: number;
    수량: number;
    금액: number;
}

// 시공 상세 (모든 정보 통합)
export interface ConstructionDetail {
    시공관리ID: string;
    시공ID: string;
    아파트명: string;
    아파트동?: string;
    아파트호수?: string;
    총합계: number;
    시공구분: string; // 중문, 도어

    // 시공 항목들
    시공항목들: 시공항목[];

    // 견적 항목들
    견적내역: 견적항목[];

    // 사진
    photos: Photo[];
}

// 통합 데이터 타입 (기존 - 카드 표시용)
export interface ConstructionWithDetails {
    시공관리ID: string;
    시공ID: string;
    시공내역: string;
    시공구분?: string; // 필터용
    아파트명: string;
    아파트동?: string;
    아파트호수?: string;
    총합계?: string; // 견적 시트의 총합계 금액
    photos: Photo[];
    // 상세 정보 (옵션)
    detail?: ConstructionDetail;
}

// 필터 타입
export interface FilterOptions {
    시공구분: '전체' | '중문' | '도어';
    동: string[]; // 선택된 동 목록
    가격대: {
        최소: number;
        최대: number;
    };
}

// 정렬 타입
export type SortOption = '동호수' | '금액_낮은순' | '금액_높은순' | '최신순';

// 뷰 모드 타입 (compact 제거)
export type ViewMode = 'gallery' | 'list';
