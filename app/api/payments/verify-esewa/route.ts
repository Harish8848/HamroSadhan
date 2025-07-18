import { NextRequest, NextResponse } from 'next/server';

const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || '';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '';
const ESEWA_TEST_MODE = process.env.ESEWA_TEST_MODE === 'true';
const ESEWA_VERIFY_URL = ESEWA_TEST_MODE
  ? 'https://uat.esewa.com.np/epay/transrec'
  : 'https://esewa.com.np/epay/transrec';

export async function POST(request: NextRequest) {
  try {
    if (!ESEWA_MERCHANT_ID) {
      console.error('ESEWA_MERCHANT_ID is not set');
      return NextResponse.json({ error: 'Merchant ID not configured' }, { status: 500 });
    }

    const { amount, productId, referenceId } = await request.json();

    if (!amount || !productId || !referenceId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Use appropriate Esewa URL based on test mode
    const verifyUrl = ESEWA_VERIFY_URL;

    // Construct verification request parameters
    const params = new URLSearchParams();
    params.append('amt', amount.toString());
    params.append('pid', productId);
    params.append('scd', ESEWA_MERCHANT_ID);
    params.append('rid', referenceId);

    // Call Esewa verification API
    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: params,
    });

    const text = await response.text();

    // Esewa returns XML response, check for success tag
    if (text.includes('<response_code>Success</response_code>')) {
      // Payment verified successfully
      return NextResponse.json({ success: true });
    } else {
      // Verification failed
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying Esewa payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
