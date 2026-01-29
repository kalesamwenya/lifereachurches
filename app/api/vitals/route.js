/**
 * Web Vitals API Endpoint
 * Collects Core Web Vitals for performance monitoring
 */

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const vitals = await request.json();

    // Log vitals (in production, send to analytics)
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', vitals);
    }

    // In production, send to monitoring service
    // await sendToMonitoring(vitals);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing vitals:', error);
    return NextResponse.json(
      { error: 'Failed to process vitals' },
      { status: 500 }
    );
  }
}
