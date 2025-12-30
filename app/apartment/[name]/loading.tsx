'use client';

import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { getRandomMessage } from '@/lib/config/links';

export default function Loading() {
    const [message, setMessage] = useState(getRandomMessage());

    // 메시지 롤링
    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(getRandomMessage());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* 헤더 스켈레톤 */}
            <section className="bg-white border-b border-neutral-100">
                <div className="section py-10 md:py-14">
                    <div className="container-custom">
                        {/* 뒤로가기 스켈레톤 */}
                        <div className="skeleton h-5 w-32 mb-6" />

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="skeleton h-6 w-24 mb-3 rounded-full" />
                                <div className="skeleton h-12 w-64 md:w-80 mb-4" />
                                <div className="flex gap-4">
                                    <div className="skeleton h-4 w-40" />
                                    <div className="skeleton h-4 w-24" />
                                </div>
                            </div>

                            {/* 통계 카드 스켈레톤 */}
                            <div className="flex gap-3">
                                <div className="skeleton h-24 w-24 rounded-2xl" />
                                <div className="skeleton h-24 w-24 rounded-2xl" />
                                <div className="skeleton h-24 w-24 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 로딩 인디케이터 */}
            <section className="section py-16">
                <div className="container-custom">
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-large 
                                        flex items-center justify-center mx-auto mb-6 
                                        animate-pulse-soft">
                            <Building2 className="w-10 h-10 text-neutral-400" />
                        </div>

                        {/* 스피너 */}
                        <div className="spinner-lg mx-auto mb-6" />

                        {/* 마케팅 메시지 롤링 */}
                        <div className="min-h-[60px] flex flex-col items-center justify-center animate-fade-in" key={message.text}>
                            <span className="text-3xl mb-2">{message.icon}</span>
                            <p className="text-lg font-medium text-neutral-700">
                                {message.text}
                            </p>
                        </div>

                        <p className="text-sm text-neutral-400 mt-4">
                            시공 사례를 불러오고 있습니다...
                        </p>
                    </div>

                    {/* 카드 스켈레톤 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card overflow-hidden">
                                <div className="skeleton aspect-[4/3] rounded-none" />
                                <div className="p-4 flex gap-2">
                                    <div className="skeleton h-11 flex-1 rounded-xl" />
                                    <div className="skeleton h-11 flex-1 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
