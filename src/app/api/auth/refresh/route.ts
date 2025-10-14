import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT() {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const refreshUrl = `${apiUrl}/api/auth/refresh`;
    
    // Get cookies from the request to pass along
    const cookieHeader = headers().get('cookie') || '';
    
    console.log(`Proxying refresh token request to ${refreshUrl}`);
    
    // Forward the request to the backend API with maxRedirects:0 to prevent redirects
    // Using PUT method to match backend endpoint
    const response = await axios.put(refreshUrl, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader, // Forward cookies for refresh token
        'Accept': 'application/json', // Ensure we only accept JSON responses
      },
      withCredentials: true,
      maxRedirects: 0, // Prevent any redirects that might cause HTML responses
      validateStatus: (status) => status < 400, // Only allow success status codes
    });
    
    // Create a response with the data from the backend
    const nextResponse = NextResponse.json(response.data);
    
    // Forward any cookies from the backend response
    if (response.headers['set-cookie']) {
      response.headers['set-cookie'].forEach(cookie => {
        // Parse and set each cookie
        const [cookieName, ...parts] = cookie.split('=');
        const cookieValue = parts.join('=').split(';')[0];
        nextResponse.cookies.set(cookieName, cookieValue, {
          httpOnly: cookie.includes('HttpOnly'),
          secure: cookie.includes('Secure'),
          sameSite: cookie.includes('SameSite=None') ? 'none' : 'lax',
          path: cookie.includes('Path=/') ? '/' : undefined,
        });
      });
    }
    
    return nextResponse;
  } catch (error: any) {
    console.error('Error refreshing token:', error.message);
    
    // Check if we got HTML instead of JSON (common redirect issue)
    if (error.response && typeof error.response.data === 'string' && 
        error.response.data.includes('<!doctype html>')) {
      console.error('Received HTML response instead of JSON - likely a redirect to login page');
      
      return NextResponse.json(
        { 
          message: 'Token refresh failed', 
          error: 'Authentication redirect detected. Please log in again.' 
        },
        { status: 401 }
      );
    }
    
    // Handle other types of errors
    if (error.response) {
      return NextResponse.json(
        { message: 'Token refresh failed', error: error.response.data },
        { status: error.response.status }
      );
    } else {
      return NextResponse.json(
        { message: 'Token refresh failed', error: error.message },
        { status: 500 }
      );
    }
  }
}

// Helper function to access headers in edge runtime
function headers() {
  // In Next.js App Router, we need to handle headers differently
  if (typeof Request !== 'undefined' && typeof Headers !== 'undefined') {
    try {
      // For App Router
      const { headers } = require('next/headers');
      return headers();
    } catch (e) {
      // Fallback
      return new Headers();
    }
  }
  return new Headers();
}