import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, Home, DoorOpen, Building2, Sparkles } from 'lucide-react';
import { getConstructionsByApartment, getApartments } from '@/lib/googleSheets';
import ConstructionList from './ConstructionList';
import type { Metadata } from 'next';
import { COMPANY_INFO } from '@/lib/config/links';
import { getConstructionCategory } from '@/lib/utils/format';

interface ApartmentPageProps {
    params: Promise<{
        name: string;
    }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ApartmentPageProps): Promise<Metadata> {
    const { name } = await params;
    const apartmentName = decodeURIComponent(name);

    return {
        title: `${apartmentName} 시공 사례 | ${COMPANY_INFO.name}`,
        description: `${apartmentName} 아파트의 도어/중문 시공 사례를 확인하세요. 문장군의 전문 시공으로 완성된 프리미엄 시공 결과물입니다.`,
        openGraph: {
            title: `${apartmentName} 시공 사례 | ${COMPANY_INFO.name}`,
            description: `${apartmentName} 아파트의 도어/중문 시공 사례`,
            type: 'website',
        },
    };
}

export default async function ApartmentPage({ params }: ApartmentPageProps) {
    const { name } = await params;
    const apartmentName = decodeURIComponent(name);

    // 아파트 정보와 시공 내역 동시 조회
    const [constructions, apartments] = await Promise.all([
        getConstructionsByApartment(apartmentName),
        getApartments()
    ]);

    if (constructions.length === 0) {
        notFound();
    }

    // 아파트 상세 정보 찾기
    const apartmentInfo = apartments.find(apt => apt.아파트명 === apartmentName);

    // 시공 유형별 개수 계산 (개선된 함수 사용)
    const 중문Count = constructions.filter(c =>
        getConstructionCategory(c.시공내역 || c.시공구분 || '') === '중문'
    ).length;
    const 도어Count = constructions.filter(c =>
        getConstructionCategory(c.시공내역 || c.시공구분 || '') === '도어'
    ).length;

    return (
        <main className="min-h-screen bg-gradient-subtle">
            {/* 헤더 영역 - 개선된 디자인 */}
            <section className="bg-white border-b border-neutral-100 relative overflow-hidden">
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial opacity-30" />

                <div className="section py-10 md:py-14 relative">
                    <div className="container-custom">
                        {/* 뒤로가기 */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 
                                       transition-colors mb-6 group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">검색으로 돌아가기</span>
                        </Link>

                        {/* 아파트 정보 */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                {/* 뱃지 */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="badge-accent">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        시공 완료
                                    </span>
                                </div>

                                {/* 아파트명 */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight mb-4">
                                    {apartmentName}
                                </h1>

                                {/* 메타 정보 */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                                    {apartmentInfo?.주소 && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-brand-accent" />
                                            {apartmentInfo.주소}
                                        </span>
                                    )}
                                    {apartmentInfo?.준공년 && apartmentInfo?.준공월 && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {apartmentInfo.준공년}년 {apartmentInfo.준공월}월 준공
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 시공 통계 카드 - 개선된 디자인 */}
                            <div className="flex gap-3">
                                {/* 전체 시공 */}
                                <div className="bg-neutral-900 text-white rounded-2xl p-4 text-center min-w-[90px] shadow-large">
                                    <p className="text-3xl font-bold mb-1">
                                        {constructions.length}
                                    </p>
                                    <p className="text-xs text-neutral-400">전체 시공</p>
                                </div>

                                {/* 중문 */}
                                {중문Count > 0 && (
                                    <div className="bg-blue-500 text-white rounded-2xl p-4 text-center min-w-[90px] shadow-large">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Home className="w-5 h-5" />
                                            <p className="text-3xl font-bold">{중문Count}</p>
                                        </div>
                                        <p className="text-xs text-blue-200">중문</p>
                                    </div>
                                )}

                                {/* 도어 */}
                                {도어Count > 0 && (
                                    <div className="bg-amber-500 text-white rounded-2xl p-4 text-center min-w-[90px] shadow-large">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <DoorOpen className="w-5 h-5" />
                                            <p className="text-3xl font-bold">{도어Count}</p>
                                        </div>
                                        <p className="text-xs text-amber-200">도어</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 시공 목록 */}
            <section className="section py-6 md:py-10">
                <div className="container-custom">
                    <ConstructionList constructions={constructions} />
                </div>
            </section>

            {/* 푸터 */}
            <footer className="section py-10 border-t border-neutral-200 bg-white">
                <div className="container-custom text-center">
                    <p className="text-neutral-500 text-sm">{COMPANY_INFO.copyright}</p>
                </div>
            </footer>
        </main>
    );
}
