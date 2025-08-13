
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getSession, signIn } from "next-auth/react";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  let bookingId = searchParams.get("bookingId");
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Confirming your booking...");

  useEffect(() => {
    async function updateBookingStatus() {
      if (!bookingId) {
        // Try to get bookingId from localStorage
        bookingId = localStorage.getItem("bookingId");
      }

      if (!bookingId) {
        toast({
          title: "Booking ID missing",
          description: "Cannot confirm booking without booking ID.",
          variant: "destructive",
        });
        setLoading(false);
        setMessage("Booking confirmation failed: Booking ID is missing.");
        return;
      }

      try {
        const session = await getSession();

        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please log in to confirm your booking.",
            variant: "destructive",
          });
          signIn(); // Redirect to login
          return;
        }

        const response = await fetch("/api/bookings/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            status: "confirmed",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update booking status");
        }

        toast({
          title: "Booking confirmed!",
          description: "Your booking has been successfully confirmed.",
        });
        setMessage("Your booking has been confirmed!");

      } catch (error: any) {
        toast({
          title: "Booking confirmation failed",
          description: error.message,
          variant: "destructive",
        });
        setMessage(`Booking confirmation failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    updateBookingStatus();
  }, [bookingId, toast, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="mt-4 text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
