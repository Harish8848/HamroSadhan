"use client";

import React, { useState, useEffect } from "react";
import PaymentButton from "@/components/payment-button";
import { getSession } from "next-auth/react";
import type { Vehicle } from "@/types";

interface BookingPaymentSectionProps {
  vehicle: Vehicle;
}

const BookingPaymentSection: React.FC<BookingPaymentSectionProps> = ({ vehicle }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const handleBookNowClick = () => {
    if (!isLoggedIn) {
      alert("Please login first to proceed with booking.");
      return;
    }
    // Store booking vehicle details in localStorage for payment callback/IPN
    localStorage.setItem("booking_vehicle", JSON.stringify(vehicle));
    setShowPayment(true);
  };

  return (
    <div>
      {!showPayment ? (
        <button
          onClick={handleBookNowClick}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Book Now
        </button>
      ) : (
        <PaymentButton
          amount={vehicle.price_per_day}
          productId={vehicle.id}
          productName={vehicle.type + " booking"}
        />
      )}
    </div>
  );
};

export default BookingPaymentSection;
