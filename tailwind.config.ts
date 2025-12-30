import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // 브랜드 컬러 시스템
                brand: {
                    primary: '#1a1a1a',      // 블랙 기반 프라이머리
                    secondary: '#2d2d2d',    // 다크 그레이
                    accent: '#ff4d4d',       // 생동감 있는 레드 (기존 moonjang-red 대체)
                    gold: '#d4a574',         // 프리미엄 골드
                    cream: '#f5f0e8',        // 따뜻한 크림
                },
                // 뉴트럴 팔레트
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                // 레거시 호환
                'moonjang-red': '#ff4d4d',
                'moonjang-gray': '#f5f5f5',
            },
            fontFamily: {
                sans: [
                    'Pretendard Variable',
                    'Pretendard',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'system-ui',
                    'Roboto',
                    'sans-serif'
                ],
                display: [
                    'Pretendard Variable',
                    'Pretendard',
                    'sans-serif'
                ],
            },
            fontSize: {
                'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
                'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'display-sm': ['1.875rem', { lineHeight: '1.3' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
                'medium': '0 4px 16px -4px rgba(0, 0, 0, 0.12)',
                'large': '0 8px 32px -8px rgba(0, 0, 0, 0.16)',
                'xl': '0 16px 48px -12px rgba(0, 0, 0, 0.2)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                'glow': '0 0 40px -10px rgba(255, 77, 77, 0.3)',
                'glow-gold': '0 0 40px -10px rgba(212, 165, 116, 0.4)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.5s ease-out',
                'slide-in-left': 'slideInLeft 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite linear',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
        },
    },
    plugins: [],
} satisfies Config;
