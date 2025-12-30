import type { Metadata } from "next";
import "./globals.css";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import StickyHeader from "@/components/StickyHeader";
import { COMPANY_INFO } from "@/lib/config/links";

export const metadata: Metadata = {
    metadataBase: new URL('https://munjanggun-portfolio.vercel.app'),
    title: `THE FIRST & ONLY : 문장군`,
    description: "최초, 아파트 시공 데이터의 기준이 되다.",
    keywords: ["도어", "중문", "시공", "아파트", "인테리어", "문장군", "슬라이딩도어", "3연동중문"],
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        siteName: COMPANY_INFO.name,
        title: `THE FIRST & ONLY : 문장군`,
        description: '최초, 아파트 시공 데이터의 기준이 되다.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: `${COMPANY_INFO.name} 대표 이미지`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `THE FIRST & ONLY : 문장군`,
        description: '최초, 아파트 시공 데이터의 기준이 되다.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://cdn.jsdelivr.net" />
            </head>
            <body className="scrollbar-thin" suppressHydrationWarning>
                <StickyHeader />
                <div className="pt-16">
                    {children}
                </div>
                <FloatingContactButtons />
            </body>
        </html>
    );
}
