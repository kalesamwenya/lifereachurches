import { NextResponse } from 'next/server';

export async function GET() {
  const RSS_URL = 'https://anchor.fm/s/128a41cc/podcast/rss';
  try {
    const res = await fetch(RSS_URL);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch RSS feed' }, { status: 500 });
    }
    const xml = await res.text();
    return NextResponse.json({ success: true, xml });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
