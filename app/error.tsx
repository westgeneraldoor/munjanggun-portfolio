'use client';

import { useEffect } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/config/links';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 에러 로깅 (추후 Sentry 등 연동 가능)
        console.error('Application error:', error);
    }, [error]);

    return (
        <main className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 에러 아이콘 */}
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>

                {/* 메시지 */}
                <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                    문제가 발생했습니다
                </h1>
                <p className="text-neutral-500 mb-8 leading-relaxed">
                    일시적인 오류가 발생했습니다.<br />
                    잠시 후 다시 시도해 주세요.
                </p>

                {/* 에러 디테일 (개발 환경에서만) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-8 p-4 bg-neutral-100 rounded-xl text-left">
                        <p className="text-xs text-neutral-500 mb-1 font-mono">Error:</p>
                        <p className="text-sm text-red-600 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={reset} className="btn-primary">
                        <RefreshCw className="w-4 h-4" />
                        다시 시도
                    </button>
                    <a href="/" className="btn-secondary">
                        <Home className="w-4 h-4" />
                        홈으로 이동
                    </a>
                </div>

                {/* 푸터 */}
                <p className="mt-12 text-xs text-neutral-400">
                    {COMPANY_INFO.copyright}
                </p>
            </div>
        </main>
    );
}
