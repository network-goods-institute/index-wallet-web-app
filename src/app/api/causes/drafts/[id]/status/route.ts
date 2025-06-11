import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const draftId = params.id
    
    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      )
    }

    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
    const response = await fetch(`${apiUrl}/causes/drafts/${draftId}/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Draft not found' },
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
    
    // Transform the response to match our expected format
    // Include both causeId and causeToken to support different backend responses
    return NextResponse.json({
      status: data.status || 'pending',
      causeId: data.causeId || data.cause_id,
      causeToken: data.cause_symbol, 
      retryUrl: data.retryUrl || data.retry_url || data.onboarding_url,
      message: data.message
    })
  } catch (error) {
    console.error('Error checking draft status:', error)
    return NextResponse.json(
      { error: 'Failed to check draft status' },
      { status: 500 }
    )
  }
}