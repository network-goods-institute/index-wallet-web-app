import { NextRequest, NextResponse } from 'next/server';

// Define the expected request body structure
interface CreateCauseRequest {
  name: string;
  organization: string;
  description: string;
  long_description: string;
  creator_email: string;
  token_symbol: string;
  token_name: string;
}

// Validation function to check if the request body has all required fields
function validateCauseData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for required fields
  const requiredFields: (keyof CreateCauseRequest)[] = [
    'name', 
    'organization', 
    'description', 
    'long_description', 
    'creator_email', 
    'token_symbol', 
    'token_name'
  ];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  }
  
  // Validate email format
  if (data.creator_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.creator_email)) {
    errors.push('Invalid email format');
  }
  
  // Validate token abbreviation (3-5 characters)
  if (data.token_symbol && (data.token_symbol.length < 2 || data.token_symbol.length > 5)) {
    errors.push('Token abbreviation must be between 2 and 5 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate the request data
    const validation = validateCauseData(data);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API_URL environment variable is not set');
    }

    console.log('API URL:', apiUrl);
    console.log('Full URL:', `${apiUrl}/causes`);
    console.log('Request body:', data);

    // Force IPv4 connection
    const response = await fetch(`${apiUrl}/causes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log('Backend response:', responseData);
    console.log('Response status:', response.status);

    if (!response.ok) {
      // Forward the error from the backend
      return NextResponse.json(
        responseData, // Backend already returns { error, message }
        { status: response.status }
      );
    }

    // Handle the response based on the flow type
    // Check for Stripe Connect flow indicators
    if (responseData.onboarding_url && responseData.draft_id) {
      // New Stripe Connect flow - pass through the exact response
      return NextResponse.json(
        responseData,
        { status: 200 }
      );
    } else if ((responseData.stripeUrl && responseData.draftId) || 
               (responseData.stripe_url && responseData.draft_id)) {
      // Alternative naming conventions
      return NextResponse.json({
        stripeUrl: responseData.stripeUrl || responseData.stripe_url,
        draftId: responseData.draftId || responseData.draft_id,
        stripe_url: responseData.stripe_url || responseData.stripeUrl,
        draft_id: responseData.draft_id || responseData.draftId,
        onboarding_url: responseData.stripeUrl || responseData.stripe_url,
        message: 'Redirecting to Stripe for payment setup'
      }, { status: 200 });
    } else {
      // Legacy flow or direct cause creation - forward all fields
      return NextResponse.json(
        responseData,
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error creating cause:', error);
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        message: 'Failed to create cause'
      },
      { status: 500 }
    );
  }
}
