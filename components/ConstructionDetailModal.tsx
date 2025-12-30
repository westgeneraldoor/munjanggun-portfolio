'use client';

import { useState, useEffect } from 'react';
import { X, Images, Calendar, ExternalLink, Home, DoorOpen, Loader2, ChevronRight, Wrench, Receipt } from 'lucide-react';
import type { ConstructionWithDetails, 시공항목, 견적항목 } from '@/lib/types';
import { formatPrice, formatDongHosu, getConstructionCategory, formatConstructionType } from '@/lib/utils/format';
import { EXTERNAL_LINKS } from '@/lib/config/links';
import { getConstructionSpecs, getConstructionEstimateItems } from '@/lib/googleSheets';

interface ConstructionDetailModalProps {
    construction: ConstructionWithDetails;
    onClose: () => void;
    onOpenGallery: () => void;
}

export default function ConstructionDetailModal({
    construction,
    onClose,
    onOpenGallery
}: ConstructionDetailModalProps) {
    const hasPhotos = construction.photos.length > 0;
    const category = getConstructionCategory(construction.시공내역 || construction.시공구분 || '');

    const [specs, setSpecs] = useState<시공항목[]>([]);
    const [estimates, setEstimates] = useState<견적항목[]>([]);
    const [isLoadingSpecs, setIsLoadingSpecs] = useState(true);
    const [isLoadingEstimates, setIsLoadingEstimates] = useState(true);
    const [activeTab, setActiveTab] = useState<'specs' | 'estimates'>('specs');

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingSpecs(true);
            try {
                const specsData = await getConstructionSpecs(construction.시공관리ID);
                setSpecs(specsData);
            } catch (error) {
                console.error('Failed to load specs:', error);
            }
            setIsLoadingSpecs(false);

            setIsLoadingEstimates(true);
            try {
                const estimatesData = await getConstructionEstimateItems(construction.시공ID);
                setEstimates(estimatesData);
            } catch (error) {
                console.error('Failed to load estimates:', error);
            }
            setIsLoadingEstimates(false);
        };

        loadData();
    }, [construction.시공관리ID, construction.시공ID]);

    const handleOpenGallery = () => {
        onClose();
        setTimeout(() => onOpenGallery(), 150);
    };

    // 스펙 항목 렌더링 (개선된 디자인)
    const renderSpecItem = (item: 시공항목, index: number) => {
        const TypeIcon = item.타입 === '도어' ? DoorOpen : Home;
        const bgColor = item.타입 === '도어'
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
        const iconBg = item.타입 === '도어' ? 'bg-amber-500' : 'bg-blue-500';

        return (
            <div key={index} className={`rounded-2xl border ${bgColor} p-4 space-y-3`}>
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
                            <TypeIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-neutral-900">{item.타입}</span>
                            {item.등급 && (
                                <span className="ml-2 text-sm text-neutral-500">{item.등급}</span>
                            )}
                        </div>
                    </div>
                    {item.위치 && (
                        <span className="text-xs text-neutral-500 bg-white/80 px-2 py-1 rounded-full">
                            {item.위치}
                        </span>
                    )}
                </div>

                {/* 옵션 그리드 */}
                <div className="grid grid-cols-2 gap-2">
                    {item.옵션.색상 && (
                        <div className="bg-white/70 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">색상</p>
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.옵션.색상}</p>
                        </div>
                    )}
                    {item.옵션.유리 && (
                        <div className="bg-white/70 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">유리</p>
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.옵션.유리}</p>
                        </div>
                    )}
                    {item.옵션.디자인 && (
                        <div className="bg-white/70 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">디자인</p>
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.옵션.디자인}</p>
                        </div>
                    )}
                    {item.옵션.손잡이 && (
                        <div className="bg-white/70 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">손잡이</p>
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.옵션.손잡이}</p>
                        </div>
                    )}
                    {item.옵션.품목 && (
                        <div className="bg-white/70 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">품목</p>
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.옵션.품목}</p>
                        </div>
                    )}
                    {item.옵션.상세 && (
                        <div className="bg-white/70 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">상세</p>
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.옵션.상세}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 견적 항목 렌더링 (개선된 디자인)
    const renderEstimateItem = (item: 견적항목, index: number) => (
        <div key={index} className="flex items-start justify-between py-3 border-b border-neutral-100 last:border-0">
            <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-neutral-900 leading-snug">{item.품목}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-500">{formatPrice(item.단가)}</span>
                    <span className="text-neutral-300">×</span>
                    <span className="text-xs text-neutral-500">{item.수량}개</span>
                </div>
            </div>
            <p className="text-sm font-bold text-neutral-900 flex-shrink-0">
                {formatPrice(item.금액)}
            </p>
        </div>
    );

    const totalEstimate = estimates.reduce((sum, item) => sum + item.금액, 0);

    return (
        <div
            className="overlay animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden 
                           shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b border-neutral-100 
                                px-5 py-4 flex items-start justify-between z-10">
                    <div className="flex-1 min-w-0">
                        {/* 카테고리 뱃지 */}
                        <div className="mb-2">
                            {category === '중문' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg">
                                    <Home className="w-3 h-3" />
                                    중문
                                </span>
                            ) : category === '도어' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-lg">
                                    <DoorOpen className="w-3 h-3" />
                                    도어
                                </span>
                            ) : null}
                        </div>
                        {/* 시공 유형 (주 제목) */}
                        <h2 className="text-2xl font-bold text-neutral-900">
                            {formatConstructionType(construction.시공내역 || '')}
                        </h2>
                        {/* 동호수 + 아파트명 (부제목) */}
                        <p className="text-base text-neutral-600 mt-1">
                            {formatDongHosu(construction.아파트동 || '', construction.아파트호수 || '')}
                            <span className="text-neutral-400 ml-2">· {construction.아파트명}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-xl transition-colors flex-shrink-0 ml-2"
                        aria-label="닫기"
                    >
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                {/* 내용 */}
                <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin">
                    {/* 총 견적 카드 */}
                    {construction.총합계 && (
                        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 
                                        rounded-2xl p-5 text-white relative overflow-hidden">
                            {/* 데코레이션 */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                            <p className="text-sm text-neutral-400 mb-1">총 견적</p>
                            <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                                {formatPrice(construction.총합계)}
                            </p>
                        </div>
                    )}

                    {/* 탭 버튼 */}
                    <div className="flex bg-neutral-100 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all
                                flex items-center justify-center gap-2
                                ${activeTab === 'specs'
                                    ? 'bg-white text-neutral-900 shadow-soft'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            <Wrench className="w-4 h-4" />
                            시공 스펙
                        </button>
                        <button
                            onClick={() => setActiveTab('estimates')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all
                                flex items-center justify-center gap-2
                                ${activeTab === 'estimates'
                                    ? 'bg-white text-neutral-900 shadow-soft'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            <Receipt className="w-4 h-4" />
                            견적 상세
                        </button>
                    </div>

                    {/* 탭 내용 */}
                    {activeTab === 'specs' && (
                        <div className="space-y-3">
                            {isLoadingSpecs ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mb-3" />
                                    <span className="text-sm text-neutral-500">스펙 정보를 불러오는 중...</span>
                                </div>
                            ) : specs.length > 0 ? (
                                specs.map(renderSpecItem)
                            ) : (
                                <div className="text-center py-12 bg-neutral-50 rounded-2xl">
                                    <Wrench className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                                    <p className="text-neutral-500">상세 스펙 정보가 없습니다</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'estimates' && (
                        <div className="space-y-3">
                            {isLoadingEstimates ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mb-3" />
                                    <span className="text-sm text-neutral-500">견적 정보를 불러오는 중...</span>
                                </div>
                            ) : estimates.length > 0 ? (
                                <div className="bg-neutral-50 rounded-2xl p-4">
                                    {estimates.map(renderEstimateItem)}

                                    {/* 합계 */}
                                    <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-neutral-200">
                                        <span className="font-bold text-neutral-900">합계</span>
                                        <span className="text-xl font-bold text-brand-accent">
                                            {formatPrice(totalEstimate)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-neutral-50 rounded-2xl">
                                    <Receipt className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                                    <p className="text-neutral-500">상세 견적 정보가 없습니다</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 사진 보기 버튼 */}
                    {hasPhotos && (
                        <button
                            onClick={handleOpenGallery}
                            className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 
                                       text-neutral-900 font-semibold rounded-2xl
                                       transition-all flex items-center justify-center gap-2
                                       group"
                        >
                            <Images className="w-5 h-5" />
                            시공 사진 {construction.photos.length}장 보기
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    )}
                </div>

                {/* 푸터 CTA */}
                <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4">
                    <a
                        href={EXTERNAL_LINKS.naverBooking}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cta w-full"
                    >
                        <Calendar className="w-5 h-5" />
                        이 시공으로 무료 견적받기
                        <ExternalLink className="w-4 h-4 ml-1 opacity-60" />
                    </a>
                </div>
            </div>
        </div>
    );
}
