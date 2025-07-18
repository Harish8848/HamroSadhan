import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { generateEsewaSignature } from "@/lib/verifySignature";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseAmount = Number(Number(amount).toFixed(2));
    if (isNaN(baseAmount) || baseAmount < 1) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // 🧾 Fixed eSewa service charge
    const serviceCharge = 0.00;
    const deliveryCharge = 0.00;
    const taxAmount = 0.00;

    const totalAmount = Number((baseAmount + serviceCharge + deliveryCharge).toFixed(2));

    // 🔏 Signature message string
    const transactionUuid = uuidv4();
    const message = [
      `total_amount=${totalAmount.toFixed(2)}`,
      `transaction_uuid=${transactionUuid}`,
      `product_code=${process.env.ESEWA_MERCHANT_ID}`
    ].join(',');

    const signature = generateEsewaSignature(message);

    return NextResponse.json({
      paymentUrl: `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
      redirectUrl: `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
      params: {
        amount: baseAmount.toFixed(2),
        tax_amount: taxAmount.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        product_service_charge: serviceCharge.toFixed(2),
        product_delivery_charge: deliveryCharge.toFixed(2),
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_MERCHANT_ID!,
        signature,
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        failure_url: `${process.env.NEXT_PUBLIC_URL}/failure`,
        signed_field_names: 'total_amount,transaction_uuid,product_code'
      }
    });

  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 500 }
    );
  }
}