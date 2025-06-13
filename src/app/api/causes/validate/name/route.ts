import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { value } = await request.json()
    
    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Name is required' },
        { status: 400 }
      )
    }

    // Forward to backend validation
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
    const response = await fetch(`${apiUrl}/causes/validate/name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value })
    })

    // Check if response is ok
    if (!response.ok) {
      console.error('Backend validation failed:', response.status, response.statusText)
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
    } catch (parseError) {
      console.error('Failed to parse backend response:', parseError)
      // Return a default response if parsing fails
      return NextResponse.json({ 
        valid: true, 
        message: null 
      })
    }
  } catch (error) {
    console.error('Error validating name:', error)
    return NextResponse.json(
      { valid: false, message: 'Failed to validate name' },
      { status: 500 }
    )
  }
}