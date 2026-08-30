import {
  describe,
  expect,
  it,
} from "vitest"

import {
  cartReducer,
  initialCartState,
} from "./cartReducer"

import {
  CartActionType,
} from "./cartActions"

import type {
  Product,
} from "../types/Product"

const product: Product = {
  id: 1,
  title: "Test product",
  description:
    "Product used for testing",
  category: "test",
  price: 100,
  discountPercentage: 0,
  rating: 4.5,
  stock: 5,
  tags: [],
  brand: "Test",
  sku: "TEST-001",
  weight: 1,

  dimensions: {
    width: 10,
    height: 10,
    depth: 10,
  },

  warrantyInformation: "",
  shippingInformation: "",
  availabilityStatus:
    "In Stock",

  reviews: [],

  returnPolicy: "",

  minimumOrderQuantity: 1,

  meta: {
    createdAt: "",
    updatedAt: "",
    barcode: "",
    qrCode: "",
  },

  images: [],

  thumbnail: "",
}

describe(
  "cartReducer",
  () => {

    it(
      "starts with an empty cart",
      () => {

        expect(
          initialCartState
        ).toEqual({
          items: [],
        })

      }
    )

    it(
      "adds a product to the cart",
      () => {

        const state =
          cartReducer(
            initialCartState,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        expect(
          state.items
        ).toHaveLength(1)

        expect(
          state.items[0]
        ).toEqual({
          product,
          quantity: 1,
        })

      }
    )

    it(
      "increases the quantity of an existing product",
      () => {

        const stateWithProduct =
          cartReducer(
            initialCartState,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        const state =
          cartReducer(
            stateWithProduct,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        expect(
          state.items[0].quantity
        ).toBe(2)

      }
    )

    it(
      "does not exceed product stock",
      () => {

        let state =
          initialCartState

        for (
          let i = 0;
          i < 10;
          i++
        ) {

          state =
            cartReducer(
              state,
              {
                type:
                  CartActionType.ADD_ITEM,
                payload:
                  product,
              }
            )

        }

        expect(
          state.items[0].quantity
        ).toBe(
          product.stock
        )

      }
    )

    it(
      "keeps other products unchanged when adding an existing product",
      () => {

        const product2:
          Product = {
            ...product,

            id: 2,

            title:
              "Another product",
          }

        const state = {
          items: [
            {
              product,
              quantity: 2,
            },
            {
              product:
                product2,
              quantity: 3,
            },
          ],
        }

        const result =
          cartReducer(
            state,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        expect(
          result.items
        ).toEqual([
          {
            product,
            quantity: 3,
          },
          {
            product:
              product2,
            quantity: 3,
          },
        ])

      }
    )

    it(
      "decreases the quantity without going below one",
      () => {

        const stateWithProduct =
          cartReducer(
            initialCartState,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        const state =
          cartReducer(
            stateWithProduct,
            {
              type:
                CartActionType.REMOVE_ITEM,
              payload:
                product.id,
            }
          )

        expect(
          state.items[0].quantity
        ).toBe(1)

      }
    )

    it(
      "keeps other products unchanged when removing an item",
      () => {

        const product2:
          Product = {
            ...product,

            id: 2,

            title:
              "Another product",
          }

        const state = {
          items: [
            {
              product,
              quantity: 2,
            },
            {
              product:
                product2,
              quantity: 3,
            },
          ],
        }

        const result =
          cartReducer(
            state,
            {
              type:
                CartActionType.REMOVE_ITEM,
              payload:
                product.id,
            }
          )

        expect(
          result.items
        ).toEqual([
          {
            product,
            quantity: 1,
          },
          {
            product:
              product2,
            quantity: 3,
          },
        ])

      }
    )

    it(
      "removes a product completely",
      () => {

        const stateWithProduct =
          cartReducer(
            initialCartState,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        const state =
          cartReducer(
            stateWithProduct,
            {
              type:
                CartActionType.CLEAR_ITEM,
              payload:
                product.id,
            }
          )

        expect(
          state.items
        ).toHaveLength(0)

      }
    )

    it(
      "keeps other products when clearing an item",
      () => {

        const product2:
          Product = {
            ...product,

            id: 2,

            title:
              "Another product",
          }

        const state = {
          items: [
            {
              product,
              quantity: 1,
            },
            {
              product:
                product2,
              quantity: 2,
            },
          ],
        }

        const result =
          cartReducer(
            state,
            {
              type:
                CartActionType.CLEAR_ITEM,
              payload:
                product.id,
            }
          )

        expect(
          result.items
        ).toEqual([
          {
            product:
              product2,
            quantity: 2,
          },
        ])

      }
    )

    it(
      "clears the entire cart",
      () => {

        const stateWithProduct =
          cartReducer(
            initialCartState,
            {
              type:
                CartActionType.ADD_ITEM,
              payload:
                product,
            }
          )

        const state =
          cartReducer(
            stateWithProduct,
            {
              type:
                CartActionType.CLEAR_CART,
            }
          )

        expect(
          state
        ).toEqual(
          initialCartState
        )

      }
    )

    it(
      "loads products into the cart",
      () => {

        const loadedItems = [
          {
            product,
            quantity: 3,
          },
        ]

        const result =
          cartReducer(
            initialCartState,
            {
              type:
                CartActionType.LOAD_CART,
              payload:
                loadedItems,
            }
          )

        expect(
          result
        ).toEqual({
          items:
            loadedItems,
        })

      }
    )

    it(
      "returns the current state for an unknown action",
      () => {

        const state = {
          items: [
            {
              product,
              quantity: 2,
            },
          ],
        }

        const result =
          cartReducer(
            state,
            {
              type:
                "UNKNOWN_ACTION",
            } as never
          )

        expect(
          result
        ).toBe(state)

      }
    )

  }
)