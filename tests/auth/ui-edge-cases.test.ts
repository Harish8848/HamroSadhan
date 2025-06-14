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

describe("UI/UX Edge Cases and Input Validation Tests", () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    fetchMock.resetMocks()
    pushMock.mockReset()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  describe("LoginPage", () => {
    it("shows error for invalid email format", async () => {
      render(React.createElement(LoginPage))
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } })
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } })
      fireEvent.click(screen.getByRole("button", { name: /Log in/i }))

      await waitFor(() => {
        expect(screen.getByText(/Login failed/i)).toBeInTheDocument()
      })
    })

    it("shows error for empty email and password", async () => {
      render(React.createElement(LoginPage))
      fireEvent.click(screen.getByRole("button", { name: /Log in/i }))

      await waitFor(() => {
        expect(screen.getByText(/Login failed/i)).toBeInTheDocument()
      })
    })
  })

  describe("SignupPage", () => {
    it("shows error for invalid email format", async () => {
      render(React.createElement(SignupPage))
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } })
      fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } })
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } })
      fireEvent.click(screen.getByRole("button", { name: /Create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/Signup failed/i)).toBeInTheDocument()
      })
    })

    it("shows error for empty required fields", async () => {
      render(React.createElement(SignupPage))
      fireEvent.click(screen.getByRole("button", { name: /Create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/Signup failed/i)).toBeInTheDocument()
      })
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
  })
})
