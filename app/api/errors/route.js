/**
 * Error Logging API Endpoint
 * Receives and logs client-side errors
 */

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const errorData = await request.json();

    // Log error (in production, send to error tracking service)
    console.error('Client error logged:', {
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context,
      timestamp: errorData.timestamp,
      url: errorData.url,
    });

    // In production, send to Sentry or similar
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(new Error(errorData.message), {
    //     extra: errorData,
    //   });
    // }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing error log:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}
