import { NextRequest, NextResponse } from 'next/server'

interface DonateRequest {
  cause_id: string
  amount_cents: number
  user_wallet_address: string
}

export async function POST(request: NextRequest) {
  try {
    const body: DonateRequest = await request.json()
    
    // Validate required fields
    if (!body.cause_id || !body.amount_cents || !body.user_wallet_address) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'cause_id, amount_cents, and user_wallet_address are required' },
        { status: 400 }
      )
    }
    
    // Validate amount
    if (body.amount_cents < 100) {
      return NextResponse.json(
        { error: 'Invalid amount', message: 'Minimum donation amount is $1.00' },
        { status: 400 }
      )
    }
    
    if (body.amount_cents > 999999) {
      return NextResponse.json(
        { error: 'Invalid amount', message: 'Maximum donation amount is $9,999.99' },
        { status: 400 }
      )
    }
    
    // Validate wallet address format (basic check)
    if (!body.user_wallet_address || body.user_wallet_address.trim().length < 10) {
      return NextResponse.json(
        { error: 'Invalid wallet address', message: 'Please provide a valid wallet address' },
        { status: 400 }
      )
    }

    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
    
    console.log('Creating donation checkout session:', {
      cause_id: body.cause_id,
      amount_cents: body.amount_cents,
      user_wallet_address: body.user_wallet_address.substring(0, 10) + '...'
    })
    
    const response = await fetch(`${apiUrl}/causes/donate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const responseData = await response.json()
    console.log('Backend response:', response.status, responseData)

    if (!response.ok) {
      // Forward backend error
      return NextResponse.json(
        responseData,
        { status: response.status }
      )
    }

    // Validate response has required fields
    if (!responseData.checkout_url || !responseData.session_id) {
      console.error('Invalid backend response:', responseData)
      return NextResponse.json(
        { error: 'Invalid response', message: 'Backend returned invalid checkout session data' },
        { status: 500 }
      )
    }

    // Ensure the backend includes success_url with session_id parameter
    // The backend should configure Stripe to redirect to /donation-success?session_id={CHECKOUT_SESSION_ID}
    
    // Return the checkout URL and session ID
    return NextResponse.json({
      checkout_url: responseData.checkout_url,
      session_id: responseData.session_id
    })
  } catch (error) {
    console.error('Error creating donation session:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create donation session. Please try again.'
      },
      { status: 500 }
    )
  }
}