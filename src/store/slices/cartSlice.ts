import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"

import type {
  Product,
} from "../../types/Product"

import type {
  CartItem,
} from "../../types/CartItem"

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addItem: (
      state,
      action: PayloadAction<Product>,
    ) => {
      const product =
        action.payload

      const existingItem =
        state.items.find(
          (item) =>
            item.product.id ===
            product.id,
        )

      if (!existingItem) {
        // Products with no stock cannot be added.
        if (product.stock <= 0) {
          return
        }

        state.items.push({
          product,
          quantity: 1,
        })

        return
      }

      // Never allow the cart quantity
      // to exceed the product stock.
      if (
        existingItem.quantity >=
        existingItem.product.stock
      ) {
        return
      }

      existingItem.quantity += 1
    },

    removeItem: (
      state,
      action: PayloadAction<number>,
    ) => {
      const item =
        state.items.find(
          (cartItem) =>
            cartItem.product.id ===
            action.payload,
        )

      if (!item) {
        return
      }

      // Quantity one is the minimum.
      // Removing the item is a separate action.
      item.quantity = Math.max(
        1,
        item.quantity - 1,
      )
    },

    clearItem: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.items =
        state.items.filter(
          (item) =>
            item.product.id !==
            action.payload,
        )
    },

    clearCart: (state) => {
      state.items = []
    },

    loadCart: (
      state,
      action: PayloadAction<CartItem[]>,
    ) => {
      state.items = action.payload
    },
  },
})

export const {
  addItem,
  removeItem,
  clearItem,
  clearCart,
  loadCart,
} = cartSlice.actions

export default cartSlice.reducer