'use client';

import Link from 'next/link';
import { Calendar, Phone } from 'lucide-react';
import { EXTERNAL_LINKS, COMPANY_INFO } from '@/lib/config/links';

export default function StickyHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    {/* 로고/브랜드 */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <span className="text-xl font-bold text-neutral-900 group-hover:text-brand-accent transition-colors">
                            {COMPANY_INFO.name}
                        </span>
                        <span className="hidden sm:block text-xs text-neutral-400 font-medium tracking-wide">
                            {COMPANY_INFO.nameEn}
                        </span>
                    </Link>

                    {/* 오른쪽 액션 */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* 전화 상담 버튼 (모바일 + 데스크탑 모두 표시) */}
                        <a
                            href={EXTERNAL_LINKS.phoneLink}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 
                                       text-sm font-medium text-neutral-600 
                                       hover:text-neutral-900 hover:bg-neutral-100
                                       rounded-lg transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">{COMPANY_INFO.phone}</span>
                        </a>

                        {/* 메인 CTA */}
                        <a
                            href={EXTERNAL_LINKS.naverBooking}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary !py-2.5 !px-4 sm:!px-5"
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">무료 방문 견적</span>
                            <span className="sm:hidden">견적</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
