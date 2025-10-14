import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    // Make a direct request to the backend login endpoint
    const response = await axios.post(
      `${apiUrl}/api/auth/token`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: status => status < 500, // Allow non-server error responses
        maxRedirects: 0, // Don't follow redirects
      }
    );
    
    // Check if response is valid
    if (response.status === 200 && response.data?.result?.accessToken) {
      const result = response.data.result;
      
      // Create the response
      const nextResponse = NextResponse.json({
        result,
        success: true
      }, {
        status: 200
      });
      
      // Forward any refresh token cookie
      console.log('🔍 [LOGIN] Response headers set-cookie:', response.headers['set-cookie']);
      
      if (response.headers['set-cookie']) {
        const cookies = response.headers['set-cookie'];
        for (const cookie of cookies) {
          console.log('🔍 [LOGIN] Processing cookie:', cookie.substring(0, 100));
          
          if (cookie.startsWith('refreshToken=')) {
            const cookieParts = cookie.split(';');
            const cookieValue = cookieParts[0].split('=')[1];
            console.log('🔍 [LOGIN] Setting refreshToken cookie:', cookieValue.substring(0, 20) + '...');
            
            // Set cookie with proper settings
            nextResponse.cookies.set({
              name: 'refreshToken',
              value: cookieValue,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7 // 7 days
            });
            
            console.log('🔍 [LOGIN] Cookie set successfully');
            break;
          }
        }
      } else {
        console.log('🔍 [LOGIN] No set-cookie headers found');
      }
      
      return nextResponse;
    } else {
      // Return the error from the backend
      return NextResponse.json(
        response.data || { message: 'Authentication failed' },
        { status: response.status || 401 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    
    return NextResponse.json(
      { message: 'Login failed', error: error.message },
      { status: 500 }
    );
  }
}