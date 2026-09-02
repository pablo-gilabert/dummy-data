import {
  expect,
  test,
  type Page,
} from "@playwright/test"

const TEST_USER = {
  username: "emilys",
  password: "emilyspass",
}

const PRODUCT_ID = 1

const login = async (page: Page) => {
  await page.goto("/login")

  await page
    .getByLabel("Username")
    .fill(TEST_USER.username)

  await page
    .getByLabel("Password")
    .fill(TEST_USER.password)

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click()

  await expect(page).not.toHaveURL(
    /\/login$/,
  )
}

const setupCart = async (page: Page) => {
  await login(page)

  await page.goto(
    `/products/${PRODUCT_ID}`,
  )

  await expect(
    page.getByRole("heading", {
      name: "Essence Mascara Lash Princess",
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
    /\/cart$/,
  )
}

const confirmPlaceOrder = async (
  page: Page,
) => {
  const confirmationDialog =
    page.getByRole("dialog", {
      name: /place order/i,
    })

  await expect(
    confirmationDialog,
  ).toBeVisible()

  await confirmationDialog
    .getByRole("button", {
      name: /place order/i,
    })
    .click()
}

const continueAfterOrderPlaced = async (
  page: Page,
) => {
  const orderPlacedDialog =
    page.getByRole("dialog", {
      name: /order placed/i,
    })

  await expect(
    orderPlacedDialog,
  ).toBeVisible()

  await orderPlacedDialog
    .getByRole("button", {
      name: /continue/i,
    })
    .click()
}

test.describe("Checkout", () => {
  test(
    "user can access checkout with a product in the cart",
    async ({ page }) => {
      await setupCart(page)

      await page
        .getByRole("button", {
          name: /checkout/i,
        })
        .click()

      await expect(page).toHaveURL(
        /\/checkout$/,
      )

      await expect(
        page.getByRole("heading", {
          name: /checkout/i,
        }),
      ).toBeVisible()
    },
  )

  test(
    "checkout form displays required fields",
    async ({ page }) => {
      await setupCart(page)

      await page
        .getByRole("button", {
          name: /checkout/i,
        })
        .click()

      await expect(page).toHaveURL(
        /\/checkout$/,
      )

      await expect(
        page.getByLabel(/full name/i),
      ).toBeVisible()

      await expect(
        page.getByLabel(/email/i),
      ).toBeVisible()

      await expect(
        page.getByLabel(/phone/i),
      ).toBeVisible()

      await expect(
        page.getByLabel(/address/i),
      ).toBeVisible()

      await expect(
        page.getByLabel(/city/i),
      ).toBeVisible()
    },
  )

  test(
    "user can complete checkout and place an order",
    async ({ page }) => {
      await setupCart(page)

      await page
        .getByRole("button", {
          name: /checkout/i,
        })
        .click()

      await expect(page).toHaveURL(
        /\/checkout$/,
      )

      await page
        .getByLabel(/full name/i)
        .fill("Pablo Gilabert")

      await page
        .getByLabel(/email/i)
        .fill("pablo@example.com")

      await page
        .getByLabel(/phone/i)
        .fill("1123456789")

      await page
        .getByLabel(/address/i)
        .fill("123 Main Street")

      await page
        .getByLabel(/city/i)
        .fill("Buenos Aires")

      await page
        .getByRole("button", {
          name: /place order/i,
        })
        .click()

      await confirmPlaceOrder(page)

      await expect(
        page.getByRole("dialog", {
          name: /order placed/i,
        }),
      ).toBeVisible()
    },
  )

  test(
    "user can view the created order",
    async ({ page }) => {
      await setupCart(page)

      await page
        .getByRole("button", {
          name: /checkout/i,
        })
        .click()

      await expect(page).toHaveURL(
        /\/checkout$/,
      )

      await page
        .getByLabel(/full name/i)
        .fill("Pablo Gilabert")

      await page
        .getByLabel(/email/i)
        .fill("pablo@example.com")

      await page
        .getByLabel(/phone/i)
        .fill("1123456789")

      await page
        .getByLabel(/address/i)
        .fill("123 Main Street")

      await page
        .getByLabel(/city/i)
        .fill("Buenos Aires")

      await page
        .getByRole("button", {
          name: /place order/i,
        })
        .click()

      await confirmPlaceOrder(page)

      await continueAfterOrderPlaced(page)

      await expect(page).toHaveURL(
        /\/order-confirmation$/,
      )

      await expect(
        page.getByRole("heading", {
          name: /order placed successfully/i,
        }),
      ).toBeVisible()
    },
  )

  test(
    "cart cannot exceed product stock",
    async ({ page }) => {
      await login(page)

      await page.goto(
        `/products/${PRODUCT_ID}`,
      )

      await expect(
        page.getByRole("heading", {
          name: "Essence Mascara Lash Princess",
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
        /\/cart$/,
      )

      const cartItem =
        page.getByRole("article").filter({
          has: page.getByRole("heading", {
            name: "Essence Mascara Lash Princess",
          }),
        })

      const quantityText =
        cartItem.getByText(/^\d+$/, {
          exact: true,
        })

      await expect(
        quantityText,
      ).toHaveText("1")

      const increaseButton =
        cartItem.getByRole("button", {
          name: /increase quantity/i,
        })

      await expect(
        increaseButton,
      ).toBeVisible()

      const productResponse =
        await page.request.get(
          `https://dummyjson.com/products/${PRODUCT_ID}`,
        )

      expect(
        productResponse.ok(),
      ).toBe(true)

      const product =
        await productResponse.json()

      const stock = product.stock

      for (
        let index = 1;
        index < stock;
        index++
      ) {
        await increaseButton.click()
      }

      await expect(
        quantityText,
      ).toHaveText(
        String(stock),
      )

      await increaseButton.click()

      await expect(
        quantityText,
      ).toHaveText(
        String(stock),
      )
    },
  )

  test(
    "unauthenticated user cannot access checkout",
    async ({ page }) => {
      await page.goto("/checkout")

      await expect(page).toHaveURL(
        /\/login$/,
      )

      await expect(
        page.getByRole("button", {
          name: /sign in/i,
        }),
      ).toBeVisible()
    },
  )

  test(
    "unauthenticated user cannot access orders",
    async ({ page }) => {
      await page.goto("/orders")

      await expect(page).toHaveURL(
        /\/login$/,
      )

      await expect(
        page.getByRole("button", {
          name: /sign in/i,
        }),
      ).toBeVisible()
    },
  )

  test(
    "cart persists after page reload",
    async ({ page }) => {
      await setupCart(page)

      await expect(
        page.getByRole("heading", {
          name: "Cart",
        }),
      ).toBeVisible()

      await expect(
        page.getByText(
          "Essence Mascara Lash Princess",
        ),
      ).toBeVisible()

      await expect
        .poll(async () => {
          return page.evaluate(() =>
            localStorage.getItem(
              "cart_1",
            ),
          )
        })
        .not.toBeNull()

      await page.reload()

      await expect(page).toHaveURL(
        /\/cart$/,
      )

      await expect(
        page.getByRole("link", {
          name: /shopping cart with 1 item/i,
        }),
      ).toBeVisible()

      await expect(
        page.getByText(
          "Essence Mascara Lash Princess",
        ),
      ).toBeVisible()
    },
  )
})