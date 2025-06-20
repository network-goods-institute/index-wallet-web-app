import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'bad_request', message: 'ID parameter is required' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

    const response = await fetch(`${apiUrl}/causes/by-symbol/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        message: 'Failed to fetch cause details'
      },
      { status: 500 }
    );
  }
}
