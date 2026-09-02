import { test, expect } from "@playwright/test"

test("user can view an empty orders page", async ({ page }) => {
  await page.goto("/login")

  await page.getByLabel("Username").fill("emilys")
  await page.getByLabel("Password").fill("emilyspass")

  await page.getByRole("button", {
    name: /sign in/i,
  }).click()

  await expect(page).toHaveURL(/\/products/)

  await page.goto("/orders")

  await expect(page).toHaveURL(/\/orders/)

  await expect(
    page.getByRole("heading", {
      name: "Orders",
      exact: true,
    })
  ).toBeVisible()

  await expect(
    page.getByRole("heading", {
      name: "No orders yet",
      exact: true,
    })
  ).toBeVisible()

  await expect(
    page.getByText(
      "Your completed orders will appear here.",
      { exact: true }
    )
  ).toBeVisible()

  await expect(
    page.getByRole("button", {
      name: "Start shopping",
      exact: true,
    })
  ).toBeVisible()
})

test("user can start shopping from orders page", async ({ page }) => {
  await page.goto("/login")

  await page.getByLabel("Username").fill("emilys")
  await page.getByLabel("Password").fill("emilyspass")

  await page.getByRole("button", {
    name: /sign in/i,
  }).click()

  await expect(page).toHaveURL(/\/products/)

  await page.goto("/orders")

  await expect(page).toHaveURL(/\/orders/)

  await page.getByRole("button", {
    name: "Start shopping",
    exact: true,
  }).click()

  await expect(page).toHaveURL(/\/products/)

  await expect(
    page.getByText(
      "Browse our collection of products.",
      { exact: true }
    )
  ).toBeVisible()
})