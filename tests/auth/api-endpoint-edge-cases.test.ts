
process.env.JWT_SECRET = "test_jwt_secret";

import { POST as signupPOST } from "@/app/api/auth/signup/route"
import { POST as loginPOST } from "@/app/api/auth/login/route"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    default: {
      users: {
        findUnique: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      $disconnect: jest.fn(),
    },
  };
});

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("API Endpoint Edge Cases", () => {
  beforeAll(async () => {
    (prisma.users.deleteMany as jest.Mock).mockResolvedValue({});
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    (prisma.$disconnect as jest.Mock).mockResolvedValue({});
  });

  function createRequest(body: any): Request {
    return new Request("http://localhost/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function getJsonBody(response: Response) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  it("signup with missing fields returns 400", async () => {
    (prisma.users.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const request = createRequest({ email: "" });
    const response = await signupPOST(request);
    expect(response.status).toBe(400);
    const data = await getJsonBody(response);
    expect(data.error).toBeDefined();
  });

  it("signup with duplicate email returns 409", async () => {
    (prisma.users.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "1",
      email: "existing@example.com",
    });
    const request = createRequest({ email: "existing@example.com", password: "password123", fullName: "Test User" });
    const response = await signupPOST(request);
    expect(response.status).toBe(409);
    const data = await getJsonBody(response);
    expect(data.error).toBe("Email already registered");
  });

  it("login with missing fields returns 400", async () => {
    const request = createRequest({ email: "" });
    const response = await loginPOST(request);
    expect(response.status).toBe(400);
    const data = await getJsonBody(response);
    expect(data.error).toBeDefined();
  });

  it("login with unconfirmed email returns 403", async () => {
    (prisma.users.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "1",
      email: "unconfirmed@example.com",
      password_hash: "hashed_password",
      role: "pending",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    const request = createRequest({ email: "unconfirmed@example.com", password: "password123" });
    const response = await loginPOST(request);
    expect(response.status).toBe(403);
    const data = await getJsonBody(response);
    expect(data.error).toBe("Email not confirmed. Please check your email.");
  });
});
