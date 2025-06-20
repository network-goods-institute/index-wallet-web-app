import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { value } = await request.json()
    
    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Token name is required' },
        { status: 400 }
      )
    }

    // Forward to backend validation
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
    const response = await fetch(`${apiUrl}/causes/validate/token-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value })
    })

    // Check if response is ok
    if (!response.ok) {
      // Return a default response instead of throwing
      return NextResponse.json({ 
        valid: true, 
        message: null 
      })
    }

    // Try to parse JSON, but handle errors
    try {
      const data = await response.json()
      return NextResponse.json(data)
    } catch {
      // Return a default response if parsing fails
      return NextResponse.json({ 
        valid: true, 
        message: null 
      })
    }
  } catch {
    return NextResponse.json(
      { valid: false, message: 'Failed to validate token name' },
      { status: 500 }
    )
  }
}