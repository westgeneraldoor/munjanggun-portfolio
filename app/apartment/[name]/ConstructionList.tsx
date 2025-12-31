'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon, ChevronLeft, ChevronRight, Eye, Images, Home, DoorOpen } from 'lucide-react';
import type { ConstructionWithDetails, FilterOptions, SortOption, ViewMode } from '@/lib/types';
import PhotoGalleryModal from '@/components/PhotoGalleryModal';
import ConstructionFilters from '@/components/ConstructionFilters';
import ConstructionDetailModal from '@/components/ConstructionDetailModal';
import { formatPrice, formatDongHosu, formatConstructionType, getConstructionCategory } from '@/lib/utils/format';
import { getRandomMessage } from '@/lib/config/links';

interface ConstructionListProps {
    constructions: ConstructionWithDetails[];
}

export default function ConstructionList({ constructions }: ConstructionListProps) {
    const [selectedConstruction, setSelectedConstruction] = useState<ConstructionWithDetails | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<ConstructionWithDetails | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<string, number>>({});

    const [filters, setFilters] = useState<FilterOptions>({
        시공구분: '전체',
        동: [],
        가격대: { 최소: 0, 최대: Infinity }
    });
    const [sortOption, setSortOption] = useState<SortOption>('동호수');
    const [viewMode, setViewMode] = useState<ViewMode>('gallery');

    // 모바일 환경(768px 미만)일 경우 기본 뷰를 리스트로 설정
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setViewMode('list');
        }
    }, []);

    const openGallery = (construction: ConstructionWithDetails) => {
        if (construction.photos.length > 0) {
            setSelectedConstruction(construction);
        }
    };

    const closeGallery = () => {
        setSelectedConstruction(null);
    };

    const handleDetailOpenGallery = () => {
        if (selectedDetail && selectedDetail.photos.length > 0) {
            setSelectedConstruction(selectedDetail);
        }
    };

    const nextPhoto = (constructionId: string, photoCount: number, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentPhotoIndex(prev => ({
            ...prev,
            [constructionId]: ((prev[constructionId] || 0) + 1) % photoCount
        }));
    };

    const prevPhoto = (constructionId: string, photoCount: number, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentPhotoIndex(prev => ({
            ...prev,
            [constructionId]: ((prev[constructionId] || 0) - 1 + photoCount) % photoCount
        }));
    };

    const 동목록 = useMemo(() => {
        return constructions
            .map(c => c.아파트동)
            .filter((d): d is string => !!d)
            .filter((d, i, arr) => arr.indexOf(d) === i)
            .sort((a, b) => parseInt(a) - parseInt(b));
    }, [constructions]);

    const filteredAndSorted = useMemo(() => {
        let result = [...constructions];

        result = result.filter(c => {
            if (filters.시공구분 !== '전체') {
                const category = getConstructionCategory(c.시공내역 || c.시공구분 || '');
                if (filters.시공구분 === '중문' && category !== '중문') return false;
                if (filters.시공구분 === '도어' && category !== '도어') return false;
            }

            if (filters.동.length > 0 && c.아파트동) {
                if (!filters.동.includes(c.아파트동)) return false;
            }

            if (c.총합계 && filters.가격대.최대 !== Infinity) {
                const price = parseInt(c.총합계.replace(/[^0-9]/g, ''));
                if (price < filters.가격대.최소 || price > filters.가격대.최대) return false;
            }

            return true;
        });

        result.sort((a, b) => {
            switch (sortOption) {
                case '동호수': {
                    const aDong = parseInt(a.아파트동 || '0');
                    const bDong = parseInt(b.아파트동 || '0');
                    if (aDong !== bDong) return aDong - bDong;
                    const aHo = parseInt(a.아파트호수 || '0');
                    const bHo = parseInt(b.아파트호수 || '0');
                    return aHo - bHo;
                }
                case '금액_낮은순': {
                    const aPrice = parseInt(a.총합계?.replace(/[^0-9]/g, '') || '0');
                    const bPrice = parseInt(b.총합계?.replace(/[^0-9]/g, '') || '0');
                    return aPrice - bPrice;
                }
                case '금액_높은순': {
                    const aPrice = parseInt(a.총합계?.replace(/[^0-9]/g, '') || '0');
                    const bPrice = parseInt(b.총합계?.replace(/[^0-9]/g, '') || '0');
                    return bPrice - aPrice;
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [constructions, filters, sortOption]);

    // 카테고리 뱃지 컴포넌트
    const CategoryBadge = ({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' }) => {
        const category = getConstructionCategory(type);
        const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

        if (category === '중문') {
            return (
                <span className={`inline-flex items-center gap-1 ${sizeClasses} bg-blue-500 text-white font-semibold rounded-md shadow-sm`}>
                    <Home className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                    중문
                </span>
            );
        } else if (category === '도어') {
            return (
                <span className={`inline-flex items-center gap-1 ${sizeClasses} bg-amber-500 text-white font-semibold rounded-md shadow-sm`}>
                    <DoorOpen className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                    도어
                </span>
            );
        }
        return null;
    };

    // 갤러리 뷰
    const GalleryView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((construction) => {
                const hasPhotos = construction.photos.length > 0;
                const photoIndex = currentPhotoIndex[construction.시공관리ID] || 0;
                const currentPhoto = hasPhotos ? construction.photos[photoIndex] : null;
                const hasMultiplePhotos = construction.photos.length > 1;
                const category = getConstructionCategory(construction.시공내역 || construction.시공구분 || '');

                return (
                    <div
                        key={construction.시공관리ID}
                        className="card overflow-hidden group hover:shadow-large transition-all duration-300"
                    >
                        {/* 이미지 영역 */}
                        <div
                            onClick={() => hasPhotos && openGallery(construction)}
                            className={`relative aspect-[4/3] bg-neutral-100 overflow-hidden
                                ${hasPhotos ? 'cursor-pointer' : ''}`}
                        >
                            {currentPhoto ? (
                                <>
                                    <Image
                                        src={currentPhoto.시공완료사진링크}
                                        alt={`${construction.아파트명} 시공 사진`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* 그라데이션 오버레이 */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {/* 데스크탑: 슬라이드 화살표 */}
                                    {hasMultiplePhotos && (
                                        <div className="hidden md:flex absolute inset-0 items-center justify-between px-3 
                                                        opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => prevPhoto(construction.시공관리ID, construction.photos.length, e)}
                                                className="w-9 h-9 bg-white/90 hover:bg-white text-neutral-900 
                                                           rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => nextPhoto(construction.시공관리ID, construction.photos.length, e)}
                                                className="w-9 h-9 bg-white/90 hover:bg-white text-neutral-900 
                                                           rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                                    <ImageIcon className="w-12 h-12 mb-2" />
                                    <span className="text-sm">사진 없음</span>
                                </div>
                            )}

                            {/* 사진 카운터 */}
                            {hasPhotos && (
                                <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white 
                                                     text-xs font-medium rounded-full">
                                        {photoIndex + 1}/{construction.photos.length}
                                    </span>
                                </div>
                            )}

                            {/* 카테고리 뱃지 */}
                            <div className="absolute top-3 left-3">
                                <CategoryBadge type={construction.시공내역 || construction.시공구분 || ''} />
                            </div>

                            {/* 하단 정보 오버레이 */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                {/* 시공 유형 (주 제목) */}
                                <h3 className="text-xl font-bold drop-shadow-lg">
                                    {formatConstructionType(construction.시공내역 || '')}
                                </h3>
                                {/* 동호수 + 가격 */}
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-white/90 drop-shadow-lg">
                                        {formatDongHosu(construction.아파트동 || '', construction.아파트호수 || '')}
                                    </p>
                                    {construction.총합계 && (
                                        <p className="text-lg font-bold drop-shadow-lg">
                                            {formatPrice(construction.총합계)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="p-3 flex gap-2 bg-white">
                            <button
                                onClick={() => setSelectedDetail(construction)}
                                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 
                                           text-neutral-700 text-sm font-semibold rounded-xl
                                           transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Eye className="w-4 h-4" />
                                자세히 보기
                            </button>
                            {hasPhotos && (
                                <button
                                    onClick={() => openGallery(construction)}
                                    className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 
                                               text-white text-sm font-semibold rounded-xl
                                               transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Images className="w-4 h-4" />
                                    사진 보기
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // 리스트 뷰 (완전히 새로운 디자인)
    const ListView = () => (
        <div className="space-y-3">
            {filteredAndSorted.map((construction) => {
                const hasPhotos = construction.photos.length > 0;
                const firstPhoto = hasPhotos ? construction.photos[0] : null;
                const category = getConstructionCategory(construction.시공내역 || construction.시공구분 || '');

                return (
                    <div
                        key={construction.시공관리ID}
                        className="bg-white rounded-2xl shadow-soft hover:shadow-medium 
                                   border border-neutral-100 overflow-hidden
                                   transition-all duration-200"
                    >
                        <div className="flex">
                            {/* 썸네일 (정사각형, 그라데이션 오버레이) */}
                            <div
                                onClick={() => hasPhotos && openGallery(construction)}
                                className={`relative w-28 sm:w-36 aspect-square flex-shrink-0
                                            ${hasPhotos ? 'cursor-pointer' : ''}`}
                            >
                                {firstPhoto ? (
                                    <>
                                        <Image
                                            src={firstPhoto.시공완료사진링크}
                                            alt={`${construction.아파트명} 시공 사진`}
                                            fill
                                            className="object-cover"
                                            sizes="150px"
                                        />
                                        {/* 사진 개수 뱃지 */}
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 
                                                        backdrop-blur-sm text-white text-xs font-medium rounded-md
                                                        flex items-center gap-1">
                                            <Images className="w-3 h-3" />
                                            {construction.photos.length}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-neutral-100 text-neutral-400">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            {/* 정보 영역 */}
                            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                                <div>
                                    {/* 카테고리 뱃지 */}
                                    <div className="mb-1">
                                        <CategoryBadge type={construction.시공내역 || construction.시공구분 || ''} size="sm" />
                                    </div>

                                    {/* 시공 유형 (주 제목) */}
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                        {formatConstructionType(construction.시공내역 || '')}
                                    </h3>

                                    {/* 동호수 + 가격 */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-neutral-500">
                                            {formatDongHosu(construction.아파트동 || '', construction.아파트호수 || '')}
                                        </p>
                                        {construction.총합계 && (
                                            <p className="text-sm sm:text-base font-bold text-brand-accent">
                                                {formatPrice(construction.총합계)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 버튼 */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => setSelectedDetail(construction)}
                                        className="flex-1 py-2 px-3 bg-neutral-100 hover:bg-neutral-200 
                                                   text-neutral-700 text-xs sm:text-sm font-semibold rounded-lg
                                                   transition-colors"
                                    >
                                        자세히
                                    </button>
                                    {hasPhotos && (
                                        <button
                                            onClick={() => openGallery(construction)}
                                            className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 
                                                       text-white text-xs sm:text-sm font-semibold rounded-lg
                                                       transition-colors"
                                        >
                                            사진
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            {/* 필터/정렬 바 */}
            <ConstructionFilters
                filterOptions={filters}
                sortOption={sortOption}
                viewMode={viewMode}
                동목록={동목록}
                onFilterChange={setFilters}
                onSortChange={setSortOption}
                onViewModeChange={setViewMode}
            />

            {/* 결과 개수 */}
            <div className="flex items-center justify-between mb-6 mt-6">
                <p className="text-sm text-neutral-600">
                    총 <span className="font-bold text-neutral-900">{filteredAndSorted.length}</span>건의 시공 사례
                </p>
            </div>

            {/* 결과 없음 */}
            {filteredAndSorted.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        조건에 맞는 시공 사례가 없습니다
                    </h3>
                    <p className="text-neutral-500 text-sm">
                        필터 조건을 변경해 보세요
                    </p>
                </div>
            ) : (
                <>
                    {viewMode === 'gallery' && <GalleryView />}
                    {viewMode === 'list' && <ListView />}
                </>
            )}

            {/* 사진 갤러리 모달 */}
            {selectedConstruction && (
                <PhotoGalleryModal
                    photos={selectedConstruction.photos}
                    isOpen={!!selectedConstruction}
                    onClose={closeGallery}
                />
            )}

            {/* 시공 상세 모달 */}
            {selectedDetail && (
                <ConstructionDetailModal
                    construction={selectedDetail}
                    onClose={() => setSelectedDetail(null)}
                    onOpenGallery={handleDetailOpenGallery}
                />
            )}
        </>
    );
}
