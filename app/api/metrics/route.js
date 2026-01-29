/**
 * Metrics Collection API Endpoint
 * Receives and logs performance metrics
 */

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const metrics = await request.json();

    // Log metrics (in production, send to monitoring service)
    if (process.env.NODE_ENV === 'development') {
      console.log('Metrics received:', metrics);
    }

    // In production, send to analytics service
    // await sendToAnalytics(metrics);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing metrics:', error);
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}
