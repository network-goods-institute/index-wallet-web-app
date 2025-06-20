import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
    const response = await fetch(`${apiUrl}/causes/find-drafts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No drafts found for this email' },
          { status: 404 }
        )
      }
      
      const errorData = await response.json()
      return NextResponse.json(
        errorData,
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Return the drafts sorted by most recent first
    return NextResponse.json({
      drafts: data.drafts || []
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to find drafts' },
      { status: 500 }
    )
  }
}