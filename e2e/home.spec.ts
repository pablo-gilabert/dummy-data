import { test, expect } from "@playwright/test"

test("user can navigate from home to products", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      name: /explore products/i,
    }),
  ).toBeVisible()

  await page
    .getByRole("link", {
      name: /browse products/i,
    })
    .click()

  await expect(page).toHaveURL(/\/products\/?$/)
})