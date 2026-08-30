import { createContext } from "react"

import type { CartState } from "./cartReducer"

interface CartContextValue {
  items: CartState["items"]

  addItem: (
    product: import("../types/Product").Product
  ) => void

  removeItem: (
    productId: number
  ) => void

  clearItem: (
    productId: number
  ) => void

  clearCart: () => void
}

export const CartContext =
  createContext<
    CartContextValue | undefined
  >(undefined)