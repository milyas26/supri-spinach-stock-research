import { NextRequest, NextResponse } from 'next/server';
import { searchDocuments } from '@/lib/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = searchDocuments(q);
  return NextResponse.json({ results });
}
