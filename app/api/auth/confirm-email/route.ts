import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import * as jwt from "jsonwebtoken"

if (!process.env.EMAIL_CONFIRMATION_SECRET) {
  throw new Error("EMAIL_CONFIRMATION_SECRET is not set in environment variables");
}
const EMAIL_CONFIRMATION_SECRET = process.env.EMAIL_CONFIRMATION_SECRET;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!token) {
      console.error("Confirm Email: Missing token");
      return new NextResponse(JSON.stringify({ error: "Missing token" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    interface EmailTokenPayload {
      userId: string;
    }
    let payload: EmailTokenPayload;
    try {
      payload = jwt.verify(token, EMAIL_CONFIRMATION_SECRET) as EmailTokenPayload
    } catch (err) {
      console.error("Confirm Email: Invalid or expired token", err);
      return new NextResponse(JSON.stringify({ error: "Invalid or expired token" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    const userId = payload.userId

    try {
      const userExists = await prisma.users.findUnique({ where: { id: userId } });
      if (!userExists) {
        console.error("Confirm Email: User not found for userId:", userId);
        return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
      }
      const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: { role: "user" },
      })
      console.log("Confirm Email: User role updated to user for userId:", userId);
      } catch (updateError) {
        console.error("Confirm Email: Error updating user role", updateError);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
      }

    return new NextResponse(JSON.stringify({ message: "Email confirmed successfully" }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (error: any) {
    console.error("Confirm Email: Internal server error", error);
    return new NextResponse(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
