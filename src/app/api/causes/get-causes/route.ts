import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
    
    const response = await fetch(`${apiUrl}/causes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        message: 'Failed to fetch causes'
      },
      { status: 500 }
    );
  }
}
