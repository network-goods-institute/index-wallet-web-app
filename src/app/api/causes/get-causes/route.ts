import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = 'http://127.0.0.1:8080';
    if (!apiUrl) {
      throw new Error('API_URL environment variable is not set');
    }

    console.log(apiUrl)
    // Force IPv4 connection
    const response = await fetch(`${apiUrl}/causes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching causes:', error);
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        message: 'Failed to fetch causes'
      },
      { status: 500 }
    );
  }
}
