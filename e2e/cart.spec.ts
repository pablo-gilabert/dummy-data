import { test, expect, type Page } from "@playwright/test"

const USER_A = {
  username: "emilys",
  password: "emilyspass",
}

const USER_B = {
  username: "michaelw",
  password: "michaelwpass",
}

const login = async (
  page: Page,
  username: string,
  password: string,
) => {
  await page.goto("/login")

  await page
    .getByLabel("Username")
    .fill(username)

  await page
    .getByLabel("Password")
    .fill(password)

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/products\/?$/,
  )
}

test("user can view an empty cart", async ({ page }) => {
  await page.goto("/cart")

  await expect(page).toHaveURL(
    /\/cart\/?$/,
  )

  await expect(
    page.getByRole("heading", {
      name: "Cart",
    }),
  ).toBeVisible()

  await expect(
    page.getByText(/your cart is empty/i),
  ).toBeVisible()

  await expect(
    page.getByRole("link", {
      name: /shopping cart with 0 items/i,
    }),
  ).toBeVisible()
})

test("user can add a product to the cart", async ({ page }) => {
  await page.goto("/products")

  const product = page.getByRole("heading", {
    name: /essence mascara lash princess/i,
  })

  await expect(product).toBeVisible()

  await product.click()

  await expect(page).toHaveURL(
    /\/products\/1\/?$/,
  )

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()

  await page
    .getByRole("button", {
      name: /add to cart/i,
    })
    .click()

  await expect(
    page.getByRole("link", {
      name: /shopping cart with 1 item/i,
    }),
  ).toBeVisible()
})

test("user can view an added product in the cart", async ({ page }) => {
  await page.goto("/products/1")

  await page
    .getByRole("button", {
      name: /add to cart/i,
    })
    .click()

  await page
    .getByRole("link", {
      name: /shopping cart with 1 item/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/cart\/?$/,
  )

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()
})

test("user can remove a product from the cart", async ({ page }) => {
  await page.goto("/products/1")

  await page
    .getByRole("button", {
      name: /add to cart/i,
    })
    .click()

  await page
    .getByRole("link", {
      name: /shopping cart with 1 item/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/cart\/?$/,
  )

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()

  await page
    .getByRole("button", {
      name: /remove/i,
    })
    .click()

  const confirmationDialog = page.getByRole(
    "dialog",
    {
      name: /remove product/i,
    },
  )

  await expect(
    confirmationDialog,
  ).toBeVisible()

  await confirmationDialog
    .getByRole("button", {
      name: /remove/i,
    })
    .click()

  const successDialog = page.getByRole(
    "dialog",
    {
      name: /removed/i,
    },
  )

  await expect(
    successDialog,
  ).toBeVisible()

  await expect(
    successDialog.getByText(
      /the product was removed from your cart/i,
    ),
  ).toBeVisible()

  await successDialog
    .getByRole("button", {
      name: /ok/i,
    })
    .click()

  await expect(
    page.getByText(/your cart is empty/i),
  ).toBeVisible()

  await expect(
    page.getByRole("link", {
      name: /shopping cart with 0 items/i,
    }),
  ).toBeVisible()
})

test("user cart persists after page reload", async ({ page }) => {
  await login(
    page,
    USER_A.username,
    USER_A.password,
  )

  await page.goto("/products/1")

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()

  await page
    .getByRole("button", {
      name: /add to cart/i,
    })
    .click()

  await page
    .getByRole("link", {
      name: /shopping cart with 1 item/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/cart\/?$/,
  )

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()

  await page.reload()

  await expect(page).toHaveURL(
    /\/cart\/?$/,
  )

  await expect(
    page.getByRole("link", {
      name: /shopping cart with 1 item/i,
    }),
  ).toBeVisible()

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()
})

test("users have isolated carts", async ({ page }) => {
  await login(
    page,
    USER_A.username,
    USER_A.password,
  )

  await page.goto("/products/1")

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).toBeVisible()

  await page
    .getByRole("button", {
      name: /add to cart/i,
    })
    .click()

  await expect(
    page.getByRole("link", {
      name: /shopping cart with 1 item/i,
    }),
  ).toBeVisible()

  await page
    .getByRole("button", {
      name: /logout/i,
    })
    .click()

  await expect(page).toHaveURL(
    /\/login\/?$/,
  )

  await login(
    page,
    USER_B.username,
    USER_B.password,
  )

  await page.goto("/cart")

  await expect(page).toHaveURL(
    /\/cart\/?$/,
  )

  await expect(
    page.getByText(/your cart is empty/i),
  ).toBeVisible()

  await expect(
    page.getByRole("link", {
      name: /shopping cart with 0 items/i,
    }),
  ).toBeVisible()

  await expect(
    page.getByRole("heading", {
      name: /essence mascara lash princess/i,
    }),
  ).not.toBeVisible()
})