/**
 * Next.js Middleware
 * Handles authentication, logging, and request processing
 */

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protected routes that require authentication
const protectedRoutes = ['/member', '/api/member'];

// API routes that should be rate limited
const rateLimitedRoutes = ['/api/giving', '/api/contact', '/api/testimonies'];

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

function getRateLimitKey(request) {
  // Use IP address or user identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return ip;
}

function isRateLimited(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(key) || [];
  
  // Filter recent requests within the time window
  const recentRequests = userRequests.filter(
    (timestamp) => now - timestamp < windowMs
  );

  if (recentRequests.length >= limit) {
    return true;
  }

  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(key, recentRequests);

  // Cleanup old entries periodically
  if (Math.random() < 0.01) {
    cleanupRateLimitStore(now, windowMs);
  }

  return false;
}

function cleanupRateLimitStore(now, windowMs) {
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recent = timestamps.filter((t) => now - t < windowMs);
    if (recent.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recent);
    }
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Log request (in production, send to logging service)
  if (process.env.NODE_ENV === 'development') {
    console.log(`${request.method} ${pathname}`);
  }

  // Check authentication for protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirect to login for protected pages
      if (!pathname.startsWith('/api/')) {
        const url = new URL('/auth', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
      
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // Rate limiting for API routes
  const shouldRateLimit = rateLimitedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldRateLimit) {
    const key = getRateLimitKey(request);
    
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Add security headers (additional to next.config.mjs)
  const response = NextResponse.next();
  
  // CORS for API routes (adjust origins as needed)
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust in production
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
  }

  return response;
}

// Configure which routes use middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
