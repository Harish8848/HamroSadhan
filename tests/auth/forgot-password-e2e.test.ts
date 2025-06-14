import { test, expect } from '@playwright/test';

test.describe("Forgot Password Flow", () => {
  const baseUrl = "http://localhost:3000"

  test("User can request password reset link", async ({ page }) => {
    await page.goto(`${baseUrl}/forgot-password`)
    await page.fill('input[id="email"]', "testuser@example.com")
    await page.click('button:has-text("Send Reset Link")')
    await expect(page.locator('text=Reset link sent')).toBeVisible()
  })

  test("Submitting empty email shows validation error", async ({ page }) => {
    await page.goto(`${baseUrl}/forgot-password`)
    await page.click('button:has-text("Send Reset Link")')
    await expect(page.locator('text=Email is required')).toBeVisible()
  })
})
