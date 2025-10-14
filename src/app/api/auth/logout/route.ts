import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Get the refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    // Make a direct request to the backend logout endpoint
    const response = await axios.post(
      `${apiUrl}/api/auth/logout`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': refreshToken ? `refreshToken=${refreshToken}` : '', // Pass the refresh token via Cookie header
        },
        validateStatus: status => status < 500, // Allow non-server error responses
        maxRedirects: 0, // Don't follow redirects
      }
    );
    
    // Create the response
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear the refresh token cookie
    nextResponse.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0 // Delete the cookie
    });
    
    return nextResponse;
  } catch (error: any) {
    console.error('Logout error:', error.message);
    
    // Even if backend logout fails, we still clear the cookie
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Logged out (client-side cleanup)'
    });
    
    // Clear the refresh token cookie
    nextResponse.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0 // Delete the cookie
    });
    
    return nextResponse;
  }
}