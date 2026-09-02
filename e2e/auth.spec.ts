import { test, expect } from "@playwright/test"

test("user can login successfully", async ({ page }) => {
  await page.goto("/login")

  await page
    .getByLabel("Username")
    .fill("emilys")

  await page
    .getByLabel("Password")
    .fill("emilyspass")

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/products\/?$/,
  )

  await expect(
    page.getByRole("button", {
      name: /logout/i,
    }),
  ).toBeVisible()
})

test("shows an error when login fails", async ({ page }) => {
  await page.goto("/login")

  await page
    .getByLabel("Username")
    .fill("invalid-user")

  await page
    .getByLabel("Password")
    .fill("invalid-password")

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click()

  await expect(
    page.getByRole("alert"),
  ).toHaveText(
    "Invalid username or password.",
  )

  await expect(page).toHaveURL(
    /\/login\/?$/,
  )
})

test("logged out user cannot access protected routes", async ({ page }) => {
  await page.goto("/login")

  await page
    .getByLabel("Username")
    .fill("emilys")

  await page
    .getByLabel("Password")
    .fill("emilyspass")

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/products\/?$/,
  )

  await page
    .getByRole("button", {
      name: /logout/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/login\/?$/,
  )

  await page.goto("/orders")

  await expect(page).toHaveURL(
    /\/login\/?$/,
  )

  await expect(
    page.getByRole("button", {
      name: /sign in/i,
    }),
  ).toBeVisible()
})