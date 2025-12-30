'use client';

import { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';
import { EXTERNAL_LINKS, COMPANY_INFO } from '@/lib/config/links';

export default function FloatingContactButtons() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
            {/* 확장된 버튼들 */}
            <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>

                {/* 전화 상담 버튼 (모바일용) */}
                <a
                    href={EXTERNAL_LINKS.phoneLink}
                    className="group flex items-center gap-3"
                    style={{ animationDelay: '150ms' }}
                >
                    <span className="px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-lg 
                                     opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 
                                     transition-all shadow-medium whitespace-nowrap">
                        전화 상담
                    </span>
                    <div className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 
                                    flex items-center justify-center
                                    shadow-large hover:shadow-xl 
                                    transform hover:scale-110 transition-all duration-300">
                        <Phone className="w-6 h-6 text-white" />
                    </div>
                </a>

                {/* 카카오톡 버튼 */}
                <a
                    href={EXTERNAL_LINKS.kakaoTalk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                    style={{ animationDelay: '100ms' }}
                >
                    <span className="px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-lg 
                                     opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 
                                     transition-all shadow-medium whitespace-nowrap">
                        카카오톡
                    </span>
                    <div className="w-14 h-14 rounded-full bg-[#FEE500] hover:bg-[#FDD835] 
                                    flex items-center justify-center
                                    shadow-large hover:shadow-xl 
                                    transform hover:scale-110 transition-all duration-300">
                        <svg className="w-7 h-7 text-[#3C1E1E]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11c-1.715 1.393-3.75 2.459-5.5 2.684-.097.013-.195.02-.291.02a.86.86 0 0 1-.874-.874c0-.041.003-.082.01-.123.23-.97.945-2.224 1.742-3.533C3.012 15.695 1.5 13.131 1.5 11.185 1.5 6.665 6.201 3 12 3z" />
                        </svg>
                    </div>
                </a>

                {/* 네이버톡톡 버튼 */}
                <a
                    href={EXTERNAL_LINKS.naverTalkTalk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                    style={{ animationDelay: '50ms' }}
                >
                    <span className="px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-lg 
                                     opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 
                                     transition-all shadow-medium whitespace-nowrap">
                        네이버톡톡
                    </span>
                    <div className="w-14 h-14 rounded-full bg-[#03C75A] hover:bg-[#02B350] 
                                    flex items-center justify-center
                                    shadow-large hover:shadow-xl 
                                    transform hover:scale-110 transition-all duration-300">
                        {/* 네이버 공식 N 로고 */}
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                        </svg>
                    </div>
                </a>
            </div>

            {/* 메인 토글 버튼 */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-16 h-16 rounded-full 
                           flex items-center justify-center
                           shadow-xl hover:shadow-2xl 
                           transform hover:scale-105 transition-all duration-300
                           ${isExpanded
                        ? 'bg-neutral-900 hover:bg-neutral-800'
                        : 'bg-gradient-to-br from-brand-accent to-red-500 hover:from-red-500 hover:to-brand-accent'
                    }`}
                aria-label={isExpanded ? '닫기' : '상담 문의'}
            >
                {isExpanded ? (
                    <X className="w-7 h-7 text-white" />
                ) : (
                    <MessageCircle className="w-7 h-7 text-white" />
                )}
            </button>
        </div>
    );
}
