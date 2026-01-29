# API Configuration Guide for Vercel Deployment

## Issue
API calls to `https://content.lifereachchurch.org` work locally but fail on Vercel.

## Solutions Implemented

### 1. Simplified API Configuration
**File: `lib/api-config.js`**
- Removed circular dependency with `env.js`
- Direct environment variable access
- Fallback to production URL if env vars not set
- Better logging in development

### 2. Improved API Client
**File: `lib/api-client.js`**
- Added proper headers (`Accept: application/json`)
- Disabled credentials for CORS compatibility
- Better error logging with URL details
- Enhanced status validation

### 3. Native Fetch Wrapper
**File: `lib/api-fetch.js`**
- Alternative to axios for better Vercel compatibility
- Built-in retry logic with exponential backoff
- Timeout handling with AbortController
- Simpler, more reliable for serverless

### 4. Updated Components
**File: `components/GiveModal.jsx`**
- Replaced axios with native fetch API
- Better error handling and logging
- Proper JSON parsing with error catch

## Environment Variables for Vercel

Set these in your Vercel project settings:

```bash
NEXT_PUBLIC_API_URL=https://content.lifereachchurch.org
NEXT_PUBLIC_SOCKET_URL=wss://your-socket-server.com
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-here
```

## Testing the Fix

### Local Testing
```bash
# Set environment variables
$env:NEXT_PUBLIC_API_URL='https://content.lifereachchurch.org'
$env:NEXT_PUBLIC_SOCKET_URL='http://localhost:4000'

# Build and test
npm run build
npm start
```

### Vercel Testing
1. Push changes to GitHub
2. Vercel auto-deploys
3. Check build logs for API configuration
4. Test API endpoints in browser console

## Troubleshooting

### If API calls still fail:

1. **Check CORS on Backend**
   - Backend must allow requests from Vercel domain
   - Add proper CORS headers:
   ```php
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   ```

2. **Verify Environment Variables**
   ```bash
   # In Vercel dashboard
   Settings → Environment Variables
   # Ensure NEXT_PUBLIC_API_URL is set
   ```

3. **Check Network Tab**
   - Open browser DevTools
   - Go to Network tab
   - Look for failed requests
   - Check request headers and response

4. **Enable Debug Logging**
   ```javascript
   // Temporarily add to components
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
   console.log('Making request to:', fullUrl);
   ```

5. **Test API Endpoint Directly**
   ```bash
   # Test from command line
   curl -X GET https://content.lifereachchurch.org/giving/verify.php?transaction_id=test
   ```

## Backend Requirements

Your PHP backend at `content.lifereachchurch.org` must:

1. **Return JSON with proper Content-Type**
   ```php
   header('Content-Type: application/json');
   echo json_encode($response);
   ```

2. **Handle OPTIONS requests (CORS preflight)**
   ```php
   if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
       http_response_code(200);
       exit();
   }
   ```

3. **Accept JSON POST data**
   ```php
   $json = file_get_contents('php://input');
   $data = json_decode($json, true);
   ```

4. **Return consistent error format**
   ```php
   if ($error) {
       http_response_code(400);
       echo json_encode(['error' => 'Error message', 'status' => 'error']);
       exit();
   }
   ```

## Migration Guide

### To use the new fetch-based API:

**Option 1: Use apiFetch (recommended for new code)**
```javascript
import apiFetch from '@/lib/api-fetch';

// GET request
const data = await apiFetch.get('/giving/verify.php?transaction_id=123');

// POST request
const result = await apiFetch.post('/giving/initialize.php', {
  amount: 100,
  category: 'tithe'
});
```

**Option 2: Use native fetch (for simple calls)**
```javascript
import { API_URL } from '@/lib/api-config';

const response = await fetch(`${API_URL}/endpoint`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(data),
});

const result = await response.json();
```

**Option 3: Keep using axios (but improved)**
```javascript
import api from '@/lib/api-client';

// Uses the improved axios client
const data = await api.get('/endpoint');
```

## Monitoring

### Check API Health
Visit: `https://your-domain.vercel.app/api/health`

### Enable Analytics
Set environment variable:
```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Error Tracking
Errors are automatically logged to `/api/errors` endpoint.

## Next Steps

1. ✅ Push changes to GitHub
2. ✅ Verify Vercel deployment succeeds
3. ✅ Test giving flow on production
4. ✅ Monitor for errors in Vercel logs
5. ⏳ Configure backend CORS if needed
6. ⏳ Set up proper error monitoring (Sentry)

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
