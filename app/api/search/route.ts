import { NextRequest, NextResponse } from 'next/server';
import { searchApartments } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    try {
        const results = await searchApartments(query);
        return NextResponse.json({ results });
    } catch (error) {
        console.error('API search error:', error);
        return NextResponse.json({ results: [], error: 'Failed to search' }, { status: 500 });
    }
}
