import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // Google Drive 이미지
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '/**',
            },
            // Google 사용자 콘텐츠 (Drive에서 리다이렉트됨)
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
            // Google Docs 뷰어
            {
                protocol: 'https',
                hostname: 'docs.google.com',
                pathname: '/**',
            },
        ],
        // 이미지 최적화 설정
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 3600, // 1시간 캐시
    },
    // 성능 최적화
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
};

export default nextConfig;
