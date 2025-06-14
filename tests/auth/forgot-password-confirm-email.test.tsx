import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import '@testing-library/jest-dom'
// eslint-disable-next-line import/no-named-as-default
// Update the import path below if your tsconfig does not support the "@" alias
import ForgotPasswordPage from "../../app/forgot-password/page"

describe("Forgot Password Page", () => {
  it("renders forgot password form", () => {
    render(<ForgotPasswordPage />)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Send Reset Link/i })).toBeInTheDocument()
  })

  it("shows error on submitting empty email", async () => {
    render(<ForgotPasswordPage />)
    fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }))
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
    })
  })

  it("submits email and shows success message", async () => {
    render(<ForgotPasswordPage />)
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }))
    await waitFor(() => {
      expect(screen.getByText(/Reset link sent/i)).toBeInTheDocument()
    })
  })
})
