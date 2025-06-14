import { test, expect } from "@playwright/test"

test.describe("End-to-End Authentication Flow", () => {
  const baseUrl = "http://localhost:3000"

test("User can sign up, confirm email, log in, and access dashboard", async ({ page }) => {
    const email = `testuser${Date.now()}@example.com`
    const password = "Password123!"
    const fullName = "Test User"

    // Sign up
    await page.goto(`${baseUrl}/signup`)
    await page.fill('input[id="fullName"]', fullName)
    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', password)
    await page.fill('input[id="confirmPassword"]', password)
    await page.click('button:has-text("Create account")')
    await expect(page.locator('text=Please check your email to confirm your account')).toBeVisible()

    // Simulate email confirmation by calling API directly (or mock)
    // This step depends on your test environment setup
    // For example, you might call the confirm-email API with a valid token here

    // Log in
    await page.goto(`${baseUrl}/login`)
    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', password)
    await page.click('button:has-text("Log in")')

    // Verify redirect to dashboard
    await expect(page).toHaveURL(`${baseUrl}/dashboard`)
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test("User cannot log in without email confirmation", async ({ page }: { page: any }) => {
    const email = `unconfirmed${Date.now()}@example.com`
    const password = "Password123!"
    const fullName = "Unconfirmed User"

    // Sign up but do not confirm email
    await page.goto(`${baseUrl}/signup`)
    await page.fill('input[id="fullName"]', fullName)
    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', password)
    await page.fill('input[id="confirmPassword"]', password)
    await page.click('button:has-text("Create account")')
    await expect(page.locator('text=Please check your email to confirm your account')).toBeVisible()

    // Attempt to log in without confirming email
    await page.goto(`${baseUrl}/login`)
    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', password)
    await page.click('button:has-text("Log in")')

    // Expect error message about email confirmation
    await expect(page.locator('text=Email not confirmed')).toBeVisible()
  })
})
