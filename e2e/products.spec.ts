import { test, expect } from "@playwright/test"

test("user can browse products", async ({ page }) => {
  await page.goto("/products")

  await expect(page).toHaveURL(/\/products/)

  await expect(
    page.getByText("Browse our collection of products.")
  ).toBeVisible()

  await expect(
    page.getByRole("searchbox", { name: "Search products..." })
  ).toBeVisible()

  await expect(
    page.getByRole("button", { name: "Search" })
  ).toBeVisible()

  await expect(
    page.getByText(/194 products/)
  ).toBeVisible()

  await expect(
    page.getByRole("navigation", { name: "Product pagination" })
  ).toBeVisible()
})

test("user can search for products", async ({ page }) => {
  await page.goto("/products")

  const searchInput = page.getByRole("searchbox", {
    name: "Search products...",
  })

  await searchInput.fill("mascara")

  await page.getByRole("button", { name: "Search" }).click()

  await expect(page).toHaveURL(/\/products/)

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    })
  ).toBeVisible()
})

test("user can filter products by category", async ({ page }) => {
  await page.goto("/products")

  await page.getByRole("button", { name: "Beauty" }).click()

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    })
  ).toBeVisible()

  await expect(
    page.getByRole("heading", {
      name: /eyeshadow palette with mirror/i,
    })
  ).toBeVisible()

  await expect(
    page.getByRole("heading", {
      name: /annibale colombo bed/i,
    })
  ).not.toBeVisible()
})

test("user can sort products by price", async ({ page }) => {
  await page.goto("/products")

  const sortSelect = page.getByRole("combobox", {
    name: "Sort by:",
  })

  await sortSelect.selectOption({
    label: "Price: Low to High",
  })

  await expect(sortSelect).toHaveValue("price-asc")

  await expect(
    page.getByRole("heading", {
      name: /lemon/i,
    })
  ).toBeVisible()

  await expect(
    page.getByText("$ 0.79")
  ).toBeVisible()
})

test("user can view a product details", async ({ page }) => {
  await page.goto("/products")

  await page.getByRole("heading", {
    name: /essence mascara lash princess/i,
  }).click()

  await expect(page).toHaveURL(/\/products\/1/)

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    })
  ).toBeVisible()
})

test("user can navigate through product pages", async ({ page }) => {
  await page.goto("/products")

  const pagination = page.getByRole("navigation", {
    name: "Product pagination",
  })

  await expect(pagination).toBeVisible()

  await expect(
    pagination.getByText("Page 1 of 17")
  ).toBeVisible()

  const nextButton = pagination.getByRole("button", {
    name: "NEXT",
  })

  const previousButton = pagination.getByRole("button", {
    name: "PREVIOUS",
  })

  await expect(previousButton).toBeDisabled()
  await expect(nextButton).toBeEnabled()

  await nextButton.click()

  await expect(
    pagination.getByText("Page 2 of 17")
  ).toBeVisible()

  await expect(previousButton).toBeEnabled()

  await expect(
    page.getByRole("heading", {
      name: /furniture|groceries|beauty|fragrances/i,
    }).first()
  ).toBeVisible()

  await previousButton.click()

  await expect(
    pagination.getByText("Page 1 of 17")
  ).toBeVisible()

  await expect(previousButton).toBeDisabled()
})