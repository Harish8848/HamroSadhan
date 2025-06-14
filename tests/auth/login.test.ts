import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import LoginPage from "../../app/login/page.tsx"
import fetchMock from "jest-fetch-mock"
import { useRouter } from "next/navigation"

fetchMock.enableMocks()

// Mock next/navigation useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("LoginPage", () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    fetchMock.resetMocks()
    pushMock.mockReset()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it("renders login form", () => {
    render(React.createElement(LoginPage))
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument()
  })

  it("submits form successfully and redirects", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ token: "fake-jwt-token", user: { id: 1, email: "john@example.com", role: "confirmed" } }),
      { status: 200 }
    )

    render(React.createElement(LoginPage))
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } })

    fireEvent.click(screen.getByRole("button", { name: /Log in/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "john@example.com", password: "password123" }),
        })
      )
      expect(localStorage.getItem("token")).toBe("fake-jwt-token")
      expect(pushMock).toHaveBeenCalledWith("/dashboard")
    })
  })

  it("shows error on login failure", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: "Invalid email or password" }), { status: 401 })

    render(React.createElement(LoginPage))
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpassword" } })

    fireEvent.click(screen.getByRole("button", { name: /Log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument()
    })
  })
})
