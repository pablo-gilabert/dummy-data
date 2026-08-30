import type { Product } from "../types/Product"
import type { CartItem } from "../types/CartItem"

export const CartActionType = {

  ADD_ITEM: "ADD_ITEM",

  REMOVE_ITEM: "REMOVE_ITEM",

  CLEAR_ITEM: "CLEAR_ITEM",

  CLEAR_CART: "CLEAR_CART",

  LOAD_CART: "LOAD_CART",

} as const

export type CartActionType =
  typeof CartActionType[
    keyof typeof CartActionType
  ]

export type CartAction =

  | {
      type: "ADD_ITEM"
      payload: Product
    }

  | {
      type: "REMOVE_ITEM"
      payload: number
    }

  | {
      type: "CLEAR_ITEM"
      payload: number
    }

  | {
      type: "CLEAR_CART"
    }

  | {
      type: "LOAD_CART"
      payload: CartItem[]
    }