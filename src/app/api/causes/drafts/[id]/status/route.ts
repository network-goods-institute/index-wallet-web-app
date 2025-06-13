import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: draftId } = await params
    
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
    
    // Pass through the backend response as-is to maintain compatibility
    return NextResponse.json({
      status: data.status,
      draft: data.draft,
      onboarding_url: data.onboarding_url,
      cause_id: data.cause_id,
      cause_symbol: data.cause_symbol,
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