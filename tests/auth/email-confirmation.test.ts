jest.mock("../../lib/prisma", () => {
  return {
    __esModule: true,
    default: {
      users: {
        update: jest.fn(),
      },
    },
  };
});

import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

process.env.EMAIL_CONFIRMATION_SECRET = "email_secret";

class MockRequest extends NextRequest {
  constructor(url: string) {
    super(new URL(url));
  }
}

describe("Email Confirmation Flow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if token is missing", async () => {
    const request = new MockRequest("http://localhost/api/auth/confirm-email");

    const mod = await import("@/app/api/auth/confirm-email/route");
    const response = await mod.GET(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("Missing token");
  });

  it("returns 400 if token is invalid", async () => {
    const request = new MockRequest("http://localhost/api/auth/confirm-email?token=invalidtoken");

    const mod = await import("@/app/api/auth/confirm-email/route");
    const response = await mod.GET(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("Invalid or expired token");
  });

  it("confirms user email successfully", async () => {
    const userId = "1";
    const token = jwt.sign({ userId }, process.env.EMAIL_CONFIRMATION_SECRET!, { expiresIn: "1d" });

    (prisma.users.update as jest.Mock).mockResolvedValue({
      id: userId,
      role: "confirmed",
    });

    const request = new MockRequest(`http://localhost/api/auth/confirm-email?token=${token}`);

    const mod = await import("@/app/api/auth/confirm-email/route");
    const response = await mod.GET(request);

    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { role: "confirmed" },
    });
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.message).toContain("Email confirmed successfully");
  });

  it("handles database update errors gracefully", async () => {
    const userId = "1";
    const token = jwt.sign({ userId }, process.env.EMAIL_CONFIRMATION_SECRET!, { expiresIn: "1d" });

    (prisma.users.update as jest.Mock).mockRejectedValue(new Error("DB error"));

    const request = new MockRequest(`http://localhost/api/auth/confirm-email?token=${token}`);

    const mod = await import("@/app/api/auth/confirm-email/route");
    const response = await mod.GET(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toContain("Internal Server Error");
  });
});