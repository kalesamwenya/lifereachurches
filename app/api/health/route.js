/**
 * Health Check API Endpoint
 * Returns system status and version information
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    services: {
      api: 'operational',
      database: 'operational', // Add actual DB check if applicable
      cache: 'operational',
    },
  };

  return NextResponse.json(healthCheck, { status: 200 });
}
