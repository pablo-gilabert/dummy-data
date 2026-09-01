import type {
  CartItem,
} from "../types/CartItem"

import {
  CartActionType,
  type CartAction,
} from "./cartActions"


export interface CartState {
  items: CartItem[]
}


export const initialCartState: CartState = {
  items: [],
}


export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {

  switch (action.type) {

    case CartActionType.ADD_ITEM: {

      const existingItem =
        state.items.find(
          (item) =>
            item.product.id ===
            action.payload.id
        )

      if (!existingItem) {

        if (
          action.payload.stock <= 0
        ) {
          return state
        }

        return {
          ...state,

          items: [
            ...state.items,

            {
              product: action.payload,
              quantity: 1,
            },
          ],
        }
      }

      if (
        existingItem.quantity >=
        existingItem.product.stock
      ) {
        return state
      }

      return {
        ...state,

        items: state.items.map(
          (item) => {

            if (
              item.product.id !==
              action.payload.id
            ) {
              return item
            }

            return {
              ...item,

              quantity:
                item.quantity + 1,
            }
          }
        ),
      }
    }

    case CartActionType.REMOVE_ITEM: {

      return {
        ...state,

        items: state.items.map(
          (item) => {

            if (
              item.product.id !==
              action.payload
            ) {
              return item
            }

            return {
              ...item,

              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          }
        ),
      }
    }

    case CartActionType.CLEAR_ITEM: {

      return {
        ...state,

        items: state.items.filter(
          (item) =>
            item.product.id !==
            action.payload
        ),
      }
    }

    case CartActionType.CLEAR_CART: {

      return initialCartState
    }

    case CartActionType.LOAD_CART: {

      return {
        items: action.payload,
      }
    }

    default:
      return state
  }
}