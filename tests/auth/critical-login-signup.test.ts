import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import LoginPage from "../../app/login/page"
import SignupPage from "../../app/signup/page"
import fetchMock from "jest-fetch-mock"
import { useRouter } from "next/navigation"

fetchMock.enableMocks()

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("Critical tests for Login and Signup", () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    fetchMock.resetMocks()
    pushMock.mockReset()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  describe("LoginPage", () => {
    it("renders login form", () => {
      render(React.createElement(LoginPage))
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument()
    })

    it("successful login redirects to dashboard", async () => {
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

  describe("SignupPage", () => {
    it("renders signup form", () => {
      render(React.createElement(SignupPage))
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    })

    it("shows error if passwords do not match", async () => {
      render(React.createElement(SignupPage))
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password1" } })
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password2" } })
      fireEvent.click(screen.getByRole("button", { name: /Create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
      })
    })

    it("successful signup shows success message", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: "Signup successful, please check your email to confirm your account." }), { status: 200 })

      render(React.createElement(SignupPage))
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } })
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
      fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "+1234567890" } })
      fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } })
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } })

      fireEvent.click(screen.getByRole("button", { name: /Create account/i }))

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/api/auth/signup", expect.anything())
        expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument()
      })
    })

    it("shows error on signup failure", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ error: "Email already registered" }), { status: 409 })

      render(React.createElement(SignupPage))
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } })
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
      fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } })
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } })

      fireEvent.click(screen.getByRole("button", { name: /Create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/Signup failed/i)).toBeInTheDocument()
      })
    })
  })
})
