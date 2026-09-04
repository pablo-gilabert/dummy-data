import {
  describe,
  expect,
  it,
} from "vitest"

import reducer, {
  addItem,
  removeItem,
  clearItem,
  clearCart,
  loadCart,
} from "./cartSlice"

import type {
  Product,
} from "../../types/Product"

import type {
  CartItem,
} from "../../types/CartItem"


const createProduct = (
  overrides: Partial<Product> = {},
): Product => ({
  id: 1,

  title:
    "Test Product",

  description:
    "Test product description",

  category:
    "test-category",

  price:
    100,

  discountPercentage:
    10,

  rating:
    4.5,

  stock:
    10,

  tags:
    ["test"],

  brand:
    "Test Brand",

  sku:
    "TEST-001",

  weight:
    1,

  dimensions: {
    width:
      10,

    height:
      10,

    depth:
      10,
  },

  warrantyInformation:
    "Test warranty",

  shippingInformation:
    "Test shipping",

  availabilityStatus:
    "In Stock",

  reviews:
    [],

  returnPolicy:
    "30 days",

  minimumOrderQuantity:
    1,

  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",

    updatedAt:
      "2026-01-01T00:00:00.000Z",

    barcode:
      "123456789",

    qrCode:
      "https://example.com/qr.png",
  },

  thumbnail:
    "https://example.com/image.jpg",

  images:
    ["https://example.com/image.jpg"],

  ...overrides,
})


const createCartItem = (
  product: Product,
  quantity = 1,
): CartItem => ({
  product,
  quantity,
})


describe(
  "cartSlice",
  () => {

    it(
      "starts with an empty cart",
      () => {
        expect(
          reducer(
            undefined,
            {
              type:
                "unknown",
            },
          ),
        ).toEqual({
          items: [],
        })
      },
    )


    it(
      "adds a new product to the cart",
      () => {
        const product =
          createProduct()

        const state =
          reducer(
            undefined,
            addItem(product),
          )

        expect(
          state.items,
        ).toEqual([
          {
            product,
            quantity: 1,
          },
        ])
      },
    )


    it(
      "does not add a product with no stock",
      () => {
        const product =
          createProduct({
            stock: 0,
          })

        const state =
          reducer(
            undefined,
            addItem(product),
          )

        expect(
          state.items,
        ).toEqual([])
      },
    )


    it(
      "increments the quantity of an existing product",
      () => {
        const product =
          createProduct()

        const initialState = {
          items: [
            createCartItem(
              product,
              1,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            addItem(product),
          )

        expect(
          state.items[0].quantity,
        ).toBe(2)
      },
    )


    it(
      "does not increase quantity beyond stock",
      () => {
        const product =
          createProduct({
            stock: 2,
          })

        const initialState = {
          items: [
            createCartItem(
              product,
              2,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            addItem(product),
          )

        expect(
          state.items[0].quantity,
        ).toBe(2)
      },
    )


    it(
      "decreases the quantity of an existing product",
      () => {
        const product =
          createProduct()

        const initialState = {
          items: [
            createCartItem(
              product,
              3,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            removeItem(product.id),
          )

        expect(
          state.items[0].quantity,
        ).toBe(2)
      },
    )


    it(
      "does not decrease quantity below one",
      () => {
        const product =
          createProduct()

        const initialState = {
          items: [
            createCartItem(
              product,
              1,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            removeItem(product.id),
          )

        expect(
          state.items[0].quantity,
        ).toBe(1)
      },
    )


    it(
      "does nothing when removing a product that is not in the cart",
      () => {
        const product =
          createProduct()

        const otherProduct =
          createProduct({
            id: 2,
          })

        const initialState = {
          items: [
            createCartItem(
              product,
              2,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            removeItem(
              otherProduct.id,
            ),
          )

        expect(
          state,
        ).toEqual(
          initialState,
        )
      },
    )


    it(
      "removes a product from the cart",
      () => {
        const product =
          createProduct()

        const initialState = {
          items: [
            createCartItem(
              product,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            clearItem(product.id),
          )

        expect(
          state.items,
        ).toEqual([])
      },
    )


    it(
      "only removes the requested product",
      () => {
        const product =
          createProduct()

        const otherProduct =
          createProduct({
            id: 2,
          })

        const initialState = {
          items: [
            createCartItem(
              product,
            ),

            createCartItem(
              otherProduct,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            clearItem(product.id),
          )

        expect(
          state.items,
        ).toEqual([
          createCartItem(
            otherProduct,
          ),
        ])
      },
    )


    it(
      "does nothing when clearing a product that is not in the cart",
      () => {
        const product =
          createProduct()

        const initialState = {
          items: [
            createCartItem(
              product,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            clearItem(999),
          )

        expect(
          state,
        ).toEqual(
          initialState,
        )
      },
    )


    it(
      "clears the entire cart",
      () => {
        const product =
          createProduct()

        const otherProduct =
          createProduct({
            id: 2,
          })

        const initialState = {
          items: [
            createCartItem(
              product,
            ),

            createCartItem(
              otherProduct,
            ),
          ],
        }

        const state =
          reducer(
            initialState,
            clearCart(),
          )

        expect(
          state.items,
        ).toEqual([])
      },
    )


    it(
      "loads the provided cart items",
      () => {
        const product =
          createProduct()

        const items = [
          createCartItem(
            product,
            3,
          ),
        ]

        const state =
          reducer(
            undefined,
            loadCart(items),
          )

        expect(
          state.items,
        ).toEqual(items)
      },
    )


    it(
      "replaces existing cart items when loading a cart",
      () => {
        const currentProduct =
          createProduct({
            id: 1,
          })

        const loadedProduct =
          createProduct({
            id: 2,
          })

        const initialState = {
          items: [
            createCartItem(
              currentProduct,
            ),
          ],
        }

        const loadedItems = [
          createCartItem(
            loadedProduct,
            2,
          ),
        ]

        const state =
          reducer(
            initialState,
            loadCart(loadedItems),
          )

        expect(
          state.items,
        ).toEqual(
          loadedItems,
        )
      },
    )
  },
)