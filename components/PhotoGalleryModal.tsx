'use client';

import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import type { Photo } from '@/lib/types';

interface PhotoGalleryModalProps {
    photos: Photo[];
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

export default function PhotoGalleryModal({
    photos,
    isOpen,
    onClose,
    initialIndex = 0
}: PhotoGalleryModalProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: initialIndex, loop: true });
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
            setIsImageLoading(true);
        };

        emblaApi.on('select', onSelect);
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') scrollPrev();
            if (e.key === 'ArrowRight') scrollNext();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, scrollPrev, scrollNext]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in"
            onClick={onClose}
        >
            {/* 헤더 */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
                <div className="text-white/80 text-sm font-medium">
                    {selectedIndex + 1} / {photos.length}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-white/80 hover:text-white 
                               hover:bg-white/10 rounded-full transition-colors"
                    aria-label="닫기"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* 메인 캐러셀 영역 */}
            <div
                className="flex-1 relative flex items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 캐러셀 */}
                <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.시공완료사진ID}
                                className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center px-4"
                            >
                                {/* 로딩 표시 */}
                                {isImageLoading && index === selectedIndex && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="spinner-lg border-white/20 border-t-white" />
                                    </div>
                                )}

                                <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                                    <Image
                                        src={photo.시공완료사진링크}
                                        alt={`시공 사진 ${index + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority={index === initialIndex}
                                        onLoad={() => setIsImageLoading(false)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 네비게이션 버튼 */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2
                                       w-12 h-12 sm:w-14 sm:h-14 
                                       bg-white/10 hover:bg-white/20 backdrop-blur-sm
                                       text-white rounded-full
                                       flex items-center justify-center
                                       transition-all hover:scale-105"
                            aria-label="이전 사진"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2
                                       w-12 h-12 sm:w-14 sm:h-14 
                                       bg-white/10 hover:bg-white/20 backdrop-blur-sm
                                       text-white rounded-full
                                       flex items-center justify-center
                                       transition-all hover:scale-105"
                            aria-label="다음 사진"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* 하단 썸네일 */}
            {photos.length > 1 && (
                <div className="flex-shrink-0 py-4 px-4 sm:px-6">
                    <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide py-1">
                        {photos.map((photo, index) => (
                            <button
                                key={photo.시공완료사진ID}
                                onClick={() => scrollTo(index)}
                                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden 
                                           flex-shrink-0 transition-all
                                           ${index === selectedIndex
                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black opacity-100'
                                        : 'opacity-50 hover:opacity-75'
                                    }`}
                                aria-label={`${index + 1}번 사진으로 이동`}
                            >
                                <Image
                                    src={photo.시공완료사진링크}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
