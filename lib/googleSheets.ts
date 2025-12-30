import type {
    Apartment, Estimate, Construction, Photo, ConstructionWithDetails,
    도어스펙, 연동중문스펙, 원슬라이딩스펙, 온라인견적, 일반견적,
    ConstructionDetail, 시공항목, 견적항목
} from './types';

// 환경 변수에서 Sheet ID 가져오기 (보안 강화)
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;

if (!SHEET_ID) {
    console.warn('⚠️ NEXT_PUBLIC_SHEET_ID 환경 변수가 설정되지 않았습니다.');
}

// 각 시트의 GID (Google Sheets의 각 시트마다 고유 ID)
const SHEET_GIDS = {
    아파트: '0',
    견적: '846013389',
    시공: '1741041588',
    시공완료사진: '978770300',
    도어스펙: '1539128685',
    연동중문스펙: '637712949',
    원슬라이딩스펙: '385193702',
    온라인견적: '2122872169',
    일반견적: '1511879141',
} as const;

// 캐시 저장소 (메모리 캐시)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분 캐시

/**
 * CSV를 파싱하는 유틸리티 함수
 */
function parseCSV<T>(csv: string): T[] {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);

    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {} as Record<string, string>;

        headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || '';
        });

        return obj as T;
    });
}

/**
 * CSV 한 줄 파싱 (따옴표 처리 포함)
 */
function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    return values;
}

/**
 * 캐시된 fetch 함수
 */
async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return cached.data as T;
    }

    const data = await fetcher();
    cache.set(key, { data, timestamp: now });
    return data;
}

/**
 * Google Sheets 데이터 fetch (공통 함수)
 */
async function fetchSheetData<T>(
    sheetName: keyof typeof SHEET_GIDS
): Promise<T[]> {
    if (!SHEET_ID) {
        console.error('Sheet ID가 설정되지 않았습니다.');
        return [];
    }

    const cacheKey = `sheet_${sheetName}`;

    return cachedFetch(cacheKey, async () => {
        try {
            const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GIDS[sheetName]}`;
            const response = await fetch(url, {
                next: { revalidate: 3600 }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${sheetName} data: ${response.status}`);
            }

            const csv = await response.text();
            return parseCSV<T>(csv);
        } catch (error) {
            console.error(`Error fetching ${sheetName}:`, error);
            return [];
        }
    });
}

// ============ 기본 데이터 함수들 ============

export async function getApartments(): Promise<Apartment[]> {
    const data = await fetchSheetData<Apartment>('아파트');
    return data.filter(apt => apt.아파트명);
}

export async function getEstimates(): Promise<Estimate[]> {
    const data = await fetchSheetData<Estimate>('견적');
    return data.filter(est => est.시공ID);
}

export async function getConstructions(): Promise<Construction[]> {
    const data = await fetchSheetData<Construction>('시공');
    return data.filter(con => con.시공관리ID);
}

export async function getPhotos(): Promise<Photo[]> {
    const data = await fetchSheetData<Photo>('시공완료사진');
    return data.filter(photo =>
        photo.시공완료사진링크 && photo.시공완료사진링크.startsWith('https://')
    );
}

// ============ 스펙 데이터 함수들 ============

export async function get도어스펙(): Promise<도어스펙[]> {
    const data = await fetchSheetData<도어스펙>('도어스펙');
    return data.filter(spec => spec.시공관리ID);
}

export async function get연동중문스펙(): Promise<연동중문스펙[]> {
    const data = await fetchSheetData<연동중문스펙>('연동중문스펙');
    return data.filter(spec => spec.시공관리ID);
}

export async function get원슬라이딩스펙(): Promise<원슬라이딩스펙[]> {
    const data = await fetchSheetData<원슬라이딩스펙>('원슬라이딩스펙');
    return data.filter(spec => spec.시공관리ID);
}

// ============ 견적 데이터 함수들 ============

export async function get온라인견적(): Promise<온라인견적[]> {
    const data = await fetchSheetData<온라인견적>('온라인견적');
    return data.filter(est => est.시공ID);
}

export async function get일반견적(): Promise<일반견적[]> {
    const data = await fetchSheetData<일반견적>('일반견적');
    return data.filter(est => est.시공ID);
}

// ============ 통합 데이터 함수들 ============

/**
 * 특정 시공의 상세 스펙 가져오기
 */
export async function getConstructionSpecs(시공관리ID: string): Promise<시공항목[]> {
    const [도어스펙들, 연동중문스펙들, 원슬라이딩스펙들] = await Promise.all([
        get도어스펙(),
        get연동중문스펙(),
        get원슬라이딩스펙()
    ]);

    const items: 시공항목[] = [];

    // 도어 스펙
    도어스펙들
        .filter(spec => spec.시공관리ID === 시공관리ID)
        .forEach(spec => {
            items.push({
                타입: '도어',
                위치: spec.시공위치 || '',
                옵션: {
                    품목: spec.품목,
                    상세: spec.상세,
                    유리: spec.유리,
                    색상: spec.색상
                }
            });
        });

    // 연동중문 스펙
    연동중문스펙들
        .filter(spec => spec.시공관리ID === 시공관리ID)
        .forEach(spec => {
            items.push({
                타입: '연동중문',
                위치: spec.중문시공위치 || '',
                등급: spec.등급,
                옵션: {
                    디자인: spec.디자인,
                    색상: spec.중문색상,
                    유리: spec.중문유리
                }
            });
        });

    // 원슬라이딩 스펙
    원슬라이딩스펙들
        .filter(spec => spec.시공관리ID === 시공관리ID)
        .forEach(spec => {
            items.push({
                타입: '원슬라이딩',
                위치: spec.중문시공위치 || '',
                등급: spec.등급,
                옵션: {
                    디자인: spec.디자인,
                    색상: spec.색상,
                    유리: spec.유리,
                    손잡이: spec.손잡이
                }
            });
        });

    return items;
}

/**
 * 특정 시공의 견적 내역 가져오기
 */
export async function getConstructionEstimateItems(시공ID: string): Promise<견적항목[]> {
    const [온라인견적들, 일반견적들] = await Promise.all([
        get온라인견적(),
        get일반견적()
    ]);

    const items: 견적항목[] = [];

    // 온라인 견적
    온라인견적들
        .filter(est => est.시공ID === 시공ID)
        .forEach(est => {
            const 단가 = typeof est.단가 === 'string' ? parseInt(est.단가.replace(/[^0-9]/g, '')) || 0 : est.단가;
            const 수량 = typeof est.수량 === 'string' ? parseInt(est.수량) || 1 : est.수량;
            items.push({
                출처: '온라인',
                품목: `${est.구분} - ${est.옵션품목}`,
                단가: 단가,
                수량: 수량,
                금액: 단가 * 수량
            });
        });

    // 일반 견적
    일반견적들
        .filter(est => est.시공ID === 시공ID)
        .forEach(est => {
            const 단가 = typeof est.단가 === 'string' ? parseInt(est.단가.replace(/[^0-9]/g, '')) || 0 : est.단가;
            const 수량 = typeof est.수량 === 'string' ? parseInt(est.수량) || 1 : est.수량;
            items.push({
                출처: '일반',
                품목: est.품목,
                단가: 단가,
                수량: 수량,
                금액: 단가 * 수량
            });
        });

    return items;
}

/**
 * 특정 아파트의 시공 내역 가져오기 (사진 포함)
 */
export async function getConstructionsByApartment(apartmentName: string): Promise<ConstructionWithDetails[]> {
    try {
        const [estimates, constructions, photos] = await Promise.all([
            getEstimates(),
            getConstructions(),
            getPhotos()
        ]);

        // 1. 해당 아파트명의 견적들 찾기
        const apartmentEstimates = estimates.filter(est => est.아파트명 === apartmentName);

        // 2. 견적의 시공ID들 추출
        const constructionIds = new Set(apartmentEstimates.map(est => est.시공ID));

        // 3. 해당 시공ID들의 시공 데이터 찾기
        const apartmentConstructions = constructions.filter(con => constructionIds.has(con.시공ID));

        // 4. 시공관리ID로 사진 맵 생성
        const photoMap = new Map<string, Photo[]>();
        photos.forEach(photo => {
            const existing = photoMap.get(photo.시공관리ID) || [];
            existing.push(photo);
            photoMap.set(photo.시공관리ID, existing);
        });

        // 5. 견적 맵 생성
        const estimateMap = new Map<string, Estimate>();
        apartmentEstimates.forEach(est => {
            estimateMap.set(est.시공ID, est);
        });

        // 6. 결과 조합
        return apartmentConstructions.map(con => {
            const estimate = estimateMap.get(con.시공ID);
            const constructionPhotos = photoMap.get(con.시공관리ID) || [];

            return {
                시공관리ID: con.시공관리ID,
                시공ID: con.시공ID,
                시공내역: con.시공내역,
                시공구분: con.시공구분,
                아파트명: apartmentName,
                아파트동: estimate?.아파트동,
                아파트호수: estimate?.아파트호수,
                총합계: estimate?.['총합계(온라인포함)'],
                photos: constructionPhotos
            };
        });
    } catch (error) {
        console.error('Error fetching constructions by apartment:', error);
        return [];
    }
}

/**
 * 아파트 검색
 */
export async function searchApartments(query: string): Promise<Apartment[]> {
    if (!query?.trim()) return [];

    const [apartments, estimates] = await Promise.all([
        getApartments(),
        getEstimates()
    ]);

    const lowerQuery = query.toLowerCase().trim();
    const { isAllowedRegion } = await import('./constants/regions');

    const estimateCountMap = new Map<string, number>();
    estimates.forEach(est => {
        const count = estimateCountMap.get(est.아파트명) || 0;
        estimateCountMap.set(est.아파트명, count + 1);
    });

    const results = apartments
        .filter(apt => {
            const matchesQuery =
                apt.아파트명.toLowerCase().includes(lowerQuery) ||
                apt.주소?.toLowerCase().includes(lowerQuery);

            if (!matchesQuery) return false;

            const isAllowed = isAllowedRegion(apt.주소) || isAllowedRegion(apt.아파트명);
            if (!isAllowed) return false;

            const count = estimateCountMap.get(apt.아파트명) || 0;
            return count > 0;
        })
        .map(apt => ({
            ...apt,
            constructionCount: estimateCountMap.get(apt.아파트명) || 0
        }));

    return results.sort((a, b) =>
        (b.constructionCount || 0) - (a.constructionCount || 0)
    );
}
