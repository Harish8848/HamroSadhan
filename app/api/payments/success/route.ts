// app/api/payment/success/route.ts


import prisma from "@/lib/prisma";
import { generateEsewaSignature } from '@/lib/verifySignature';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract required parameters
    const donationId = formData.get('donationId');
    const transactionUuid = formData.get('transaction_uuid');
    const totalAmount = formData.get('total_amount');
    const productCode = formData.get('product_code');
    const receivedSignature = formData.get('signature');

    // Validate required parameters
    if (!donationId || !transactionUuid || !totalAmount || !productCode || !receivedSignature) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/failure`);
    }

    // Verify with eSewa API
    const verificationResponse = await fetch(`${process.env.ESEWA_BASE_URL}/api/epay/main/v2/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ESEWA_SECRET_KEY}`
      },
      body: JSON.stringify({
        transaction_uuid: transactionUuid.toString(),
        total_amount: totalAmount.toString()
      })
    });

    if (!verificationResponse.ok) {
      throw new Error('eSewa verification failed');
    }

    // Generate signature
    const signatureMessage = [
      `total_amount=${totalAmount.toString()}`,
      `transaction_uuid=${transactionUuid.toString()}`,
      `product_code=${process.env.ESEWA_MERCHANT_ID}`
    ].join(',');

 
    const validSignature = generateEsewaSignature(signatureMessage)
    
    if (validSignature !== receivedSignature.toString()) {
      throw new Error('Invalid signature');
    }

    // Update booking status and transaction UUID
    // Prisma does not recognize transaction_uuid in where clause or update data
    // Use raw query to update booking status and transaction_uuid

    const result = await prisma.$executeRawUnsafe(`
      UPDATE bookings
      SET status = 'confirmed', transaction_uuid = $1
      WHERE transaction_uuid IS NULL
      LIMIT 1
    `, transactionUuid.toString());

    if (result === 0) {
      console.error('No booking updated for transaction UUID:', transactionUuid.toString());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/failure`);
    }

    // Prisma does not recognize transaction_uuid in where clause
    // Use raw query to get booking ID by transaction_uuid

    const bookings = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id FROM bookings WHERE transaction_uuid = $1 LIMIT 1
    `, transactionUuid.toString());

    if (!bookings || bookings.length === 0) {
      console.error('Booking not found after update for transaction UUID:', transactionUuid.toString());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/failure`);
    }

    const bookingId = bookings[0].id;

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/success?bookingId=${bookingId}`);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/failure`);
  }
}
