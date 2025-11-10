import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  // Get the refresh token from cookies
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  if (!refreshToken) {
    return NextResponse.json(
      { message: 'No refresh token found' },
      { status: 401 }
    );
  }

  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    // Make a direct request to the backend refresh endpoint using PUT method as per backend
    const response = await axios.put(
      `${apiUrl}/api/auth/refresh`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refreshToken=${refreshToken}`, // Pass the refresh token via Cookie header
        },
        validateStatus: status => status < 500, // Allow non-server error responses
        maxRedirects: 0, // Don't follow redirects
      }
    );
    
    // Check if the response is HTML instead of JSON (redirect)
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('Received HTML response - refresh token likely expired');
      return NextResponse.json({ message: 'Session expired', valid: false }, { status: 401 });
    }
    
    // Check if we have a valid response
    if (response.status === 200 && response.data?.result?.accessToken) {
      const { accessToken, expiresIn } = response.data.result;
      
      // Create the response
      const nextResponse = NextResponse.json({
        result: {
          accessToken,
          expiresIn,
          authenticated: true,
          tokenType: 'Bearer'
        },
        success: true
      });
      
      // Forward refresh token cookie if it was updated
      if (response.headers['set-cookie']) {
        const cookies = response.headers['set-cookie'];
        for (const cookie of cookies) {
          if (cookie.startsWith('refreshToken=')) {
            const cookieParts = cookie.split(';');
            const cookieValue = cookieParts[0].split('=')[1];
            nextResponse.cookies.set('refreshToken', cookieValue, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              path: '/'
            });
            break;
          }
        }
      }
      
      return nextResponse;
    } else {
      // Invalid response or error from backend
      return NextResponse.json(
        { message: 'Failed to refresh token', valid: false },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error('Error refreshing token:', error.message);
    
    return NextResponse.json(
      { message: 'Token refresh failed', error: error.message },
      { status: 500 }
    );
  }
}