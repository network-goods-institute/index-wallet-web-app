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
function validateCauseData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Type guard to check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid request body');
    return { valid: false, errors };
  }
  
  const causeData = data as Record<string, unknown>;
  
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
    if (!causeData[field]) {
      errors.push(`${field} is required`);
    }
  }
  
  // Validate email format
  if (causeData.creator_email && typeof causeData.creator_email === 'string' && 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(causeData.creator_email)) {
    errors.push('Invalid email format');
  }
  
  // Validate token abbreviation (3-5 characters)
  if (causeData.token_symbol && typeof causeData.token_symbol === 'string' && 
      (causeData.token_symbol.length < 2 || causeData.token_symbol.length > 5)) {
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
    
    const response = await fetch(`${apiUrl}/causes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

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
  } catch {
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        message: 'Failed to create cause'
      },
      { status: 500 }
    );
  }
}
