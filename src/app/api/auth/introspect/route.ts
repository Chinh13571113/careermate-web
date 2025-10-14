import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    // Make a direct request to the backend introspect endpoint using PUT method
    const response = await axios.put(
      `${apiUrl}/api/auth/introspect`,
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: status => status < 500, // Allow non-server error responses
        maxRedirects: 0, // Don't follow redirects
      }
    );
    
    // Check if response is valid
    if (response.status === 200 && response.data?.result) {
      return NextResponse.json({
        result: response.data.result,
        success: true
      });
    } else {
      // Return the error from the backend
      return NextResponse.json(
        response.data || { message: 'Token introspection failed' },
        { status: response.status || 400 }
      );
    }
  } catch (error: any) {
    console.error('Introspection error:', error.message);
    
    return NextResponse.json(
      { message: 'Token introspection failed', error: error.message },
      { status: 500 }
    );
  }
}