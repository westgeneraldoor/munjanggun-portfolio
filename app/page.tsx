'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, MapPin, Calendar, Building2, Info } from 'lucide-react';
import Link from 'next/link';
import type { Apartment } from '@/lib/types';
import { COMPANY_INFO, getRandomMessage } from '@/lib/config/links';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Apartment[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // 로딩 메시지 롤링
    const [loadingMessage, setLoadingMessage] = useState(getRandomMessage());

    useEffect(() => {
        if (isNavigating) {
            const interval = setInterval(() => {
                setLoadingMessage(getRandomMessage());
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isNavigating]);

    useEffect(() => {
        const searchApartments = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                setSearchResults(data.results || []);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchApartments, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    return (
        <main className="min-h-screen bg-gradient-subtle">
            {/* 히어로 섹션 */}
            <section className="relative overflow-hidden">
                {/* 배경 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-radial opacity-50" />

                {/* 장식 요소 */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

                <div className="relative section">
                    <div className="container-custom text-center">
                        {/* 브랜드 로고 */}
                        <div className="animate-fade-in-down">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <span className="badge-accent">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    도어/중문 전문
                                </span>
                            </div>

                            <h1 className="text-display-xl md:text-display-2xl font-bold text-neutral-900 mb-3 tracking-tight">
                                {COMPANY_INFO.name}
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-400 font-medium tracking-widest">
                                {COMPANY_INFO.nameEn}
                            </p>

                            {/* 세련된 메인 문구 */}
                            <div className="mt-8 max-w-xl mx-auto">
                                <p className="text-xl md:text-2xl text-neutral-700 font-medium leading-relaxed">
                                    우리 아파트 시공 사례,<br className="sm:hidden" />
                                    <span className="text-brand-accent font-bold">직접 확인</span>하고 결정하세요
                                </p>
                                <p className="text-neutral-500 mt-3 text-sm md:text-base">
                                    아파트명 또는 주소로 검색하면<br className="sm:hidden" />
                                    실제 시공 사진과 견적을 바로 확인할 수 있어요
                                </p>
                            </div>
                        </div>

                        {/* 검색 영역 */}
                        <div className="mt-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                            <div
                                className={`
                                    relative bg-white rounded-2xl
                                    transition-all duration-300
                                    ${isFocused
                                        ? 'shadow-xl ring-4 ring-neutral-900/5'
                                        : 'shadow-large hover:shadow-xl'
                                    }
                                `}
                            >
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className={`h-5 w-5 transition-colors ${isFocused ? 'text-neutral-900' : 'text-neutral-400'}`} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="아파트명 또는 지역으로 검색 (예: 판교, 래미안)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full pl-14 pr-6 py-5 text-lg bg-transparent
                                               placeholder:text-neutral-400 text-neutral-900
                                               focus:outline-none rounded-2xl"
                                />
                            </div>

                            {/* 검색 팁 */}
                            {!searchQuery && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400 animate-fade-in">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>띄어쓰기 없이 입력하면 더 정확해요! (예: 청도솔리움, 래미안)</span>
                                </div>
                            )}

                            {/* 검색 결과 */}
                            {searchQuery && (
                                <div className="mt-4 bg-white rounded-2xl shadow-xl border border-neutral-100 
                                               max-h-[60vh] overflow-y-auto scrollbar-thin animate-fade-in">
                                    {isSearching ? (
                                        <div className="p-8 text-center">
                                            <div className="spinner-md mx-auto mb-4" />
                                            <p className="text-neutral-600">검색 중...</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <ul className="divide-y divide-neutral-100">
                                            {searchResults.map((apartment, index) => (
                                                <li key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                    <Link
                                                        href={`/apartment/${encodeURIComponent(apartment.아파트명)}`}
                                                        onClick={() => setIsNavigating(true)}
                                                        className="block px-6 py-5 hover:bg-neutral-50 transition-colors group"
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="font-bold text-lg text-neutral-900 group-hover:text-brand-accent transition-colors">
                                                                        {apartment.아파트명}
                                                                    </h3>
                                                                    {apartment.constructionCount && apartment.constructionCount > 0 && (
                                                                        <span className="badge-dark">
                                                                            {apartment.constructionCount}건
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                                                                    {apartment.주소 && (
                                                                        <span className="flex items-center gap-1.5">
                                                                            <MapPin className="w-3.5 h-3.5" />
                                                                            {apartment.주소}
                                                                        </span>
                                                                    )}
                                                                    {apartment.준공년 && apartment.준공월 && (
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            {apartment.준공년}.{apartment.준공월} 준공
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="w-5 h-5 text-neutral-400 
                                                                                   group-hover:text-brand-accent 
                                                                                   group-hover:translate-x-1 
                                                                                   transition-all flex-shrink-0" />
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                            <p className="text-neutral-600 font-medium">검색 결과가 없습니다</p>
                                            <p className="text-sm text-neutral-400 mt-2">
                                                다른 검색어를 입력하거나<br />
                                                띄어쓰기 없이 검색해 보세요
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 서비스 지역 안내 */}
                        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-fade-in animation-delay-300">
                            {['서울', '경기', '인천', '대전', '세종', '충청'].map((region) => (
                                <span
                                    key={region}
                                    className="px-3 py-1.5 bg-white/80 text-neutral-600 text-sm font-medium rounded-full
                                               border border-neutral-200 shadow-soft"
                                >
                                    {region}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 특징 섹션 */}
            <section className="section bg-white py-16 md:py-20">
                <div className="container-custom">
                    <h2 className="text-center text-2xl md:text-3xl font-bold text-neutral-900 mb-12">
                        왜 <span className="text-brand-accent">문장군</span>인가요?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🏆',
                                title: '20년 경력의 전문성',
                                desc: '장인 정신으로 완성하는\n최고 품질의 시공'
                            },
                            {
                                icon: '💰',
                                title: '연 100만원 절약',
                                desc: '중문 하나로 냉난방비\n확실하게 절감'
                            },
                            {
                                icon: '🛡️',
                                title: '책임지는 AS',
                                desc: '시공 후에도\n끝까지 책임집니다'
                            }
                        ].map((item, i) => (
                            <div key={i} className="card p-8 text-center group hover:shadow-large transition-all">
                                <div className="text-5xl mb-5">{item.icon}</div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                                <p className="text-neutral-600 whitespace-pre-line leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 푸터 */}
            <footer className="section py-12 border-t border-neutral-200">
                <div className="container-custom text-center">
                    <p className="text-neutral-500 text-sm">{COMPANY_INFO.copyright}</p>
                </div>
            </footer>

            {/* 로딩 오버레이 (마케팅 메시지 롤링) */}
            {isNavigating && (
                <div className="overlay animate-fade-in">
                    <div className="text-center text-white max-w-md px-6">
                        <div className="spinner-lg border-white/30 border-t-white mx-auto mb-8" />

                        {/* 마케팅 메시지 롤링 */}
                        <div className="min-h-[80px] flex flex-col items-center justify-center animate-fade-in" key={loadingMessage.text}>
                            <span className="text-4xl mb-3">{loadingMessage.icon}</span>
                            <p className="text-lg font-medium leading-relaxed">
                                {loadingMessage.text}
                            </p>
                        </div>

                        <p className="text-white/50 text-sm mt-6">잠시만 기다려 주세요...</p>
                    </div>
                </div>
            )}
        </main>
    );
}
