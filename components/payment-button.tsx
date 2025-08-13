'use client';

import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wallet } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  productId: string;
  productName: string;
  bookingId?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ amount, productId, productName, bookingId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (bookingId) {
        localStorage.setItem('bookingId', bookingId);
      }

      let successUrl = window.location.origin + '/success';
      const failureUrl = window.location.origin + '/failure';

      if (bookingId) {
        successUrl += `?bookingId=${bookingId}`;
      }

      const useMockApi = process.env.NEXT_PUBLIC_ESEWA_USE_MOCK_API === 'true';
      const apiEndpoint = useMockApi ? '/api/payments/mock-payment' : '/api/payments/initiate';


      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          productId,
          productName,
          successUrl,
          failureUrl
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        // Create hidden form for eSewa submission
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.redirectUrl;
        form.style.display = 'none';

        // Add fields in required order
        const addField = (name: string, value: string) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };

        addField('amount', data.params.amount);
        addField('tax_amount', data.params.tax_amount);
        addField('total_amount', data.params.total_amount);
        addField('transaction_uuid', data.params.transaction_uuid);
        addField('product_code', data.params.product_code);
        addField('product_service_charge', data.params.product_service_charge);
        addField('product_delivery_charge', data.params.product_delivery_charge);
        addField('signed_field_names', data.params.signed_field_names);
        addField('signature', data.params.signature);
        addField('success_url', data.params.success_url);
        addField('failure_url', data.params.failure_url);

        document.body.appendChild(form);
        form.submit();
      } else {
        setError('Failed to initiate payment');
      }
    } catch (err) {
      setError('An error occurred during payment initiation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='text-2xl font-bold text-center mb-4 bg-green-600 p-3 rounded-md'> Payment Methods</h2>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <h2></h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-green-600">eSewa</div>
          </div>
          <CardTitle>Pay with eSewa</CardTitle>
          <CardDescription>Secure digital wallet payment</CardDescription>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 align-center"
          >
            {loading ? 'Processing...' : `Pay Rs. ${amount} with Esewa`}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </button>
        </CardHeader>
      </Card>
    </>
  );
};

export default PaymentButton;
