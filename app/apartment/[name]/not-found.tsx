import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/config/links';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 아이콘 */}
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="text-4xl">🏠</span>
                </div>

                {/* 에러 코드 */}
                <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>

                {/* 메시지 */}
                <h2 className="text-xl font-semibold text-neutral-700 mb-3">
                    아파트를 찾을 수 없습니다
                </h2>
                <p className="text-neutral-500 mb-8 leading-relaxed">
                    요청하신 아파트의 시공 사례가 없거나<br />
                    잘못된 주소입니다.
                </p>

                {/* 액션 버튼 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="btn-primary">
                        <Home className="w-4 h-4" />
                        홈으로 돌아가기
                    </Link>
                    <Link href="/" className="btn-secondary">
                        <Search className="w-4 h-4" />
                        다른 아파트 검색
                    </Link>
                </div>

                {/* 푸터 */}
                <p className="mt-12 text-xs text-neutral-400">
                    {COMPANY_INFO.copyright}
                </p>
            </div>
        </main>
    );
}
