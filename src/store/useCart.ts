import {
  useAppDispatch,
  useAppSelector,
} from "./hooks"

import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  clearItem as clearItemAction,
  clearCart as clearCartAction,
} from "./slices/cartSlice"

import type {
  Product,
} from "../types/Product"

export const useCart = () => {
  const dispatch =
    useAppDispatch()

  const items =
    useAppSelector(
      (state) => state.cart.items,
    )

  const addItem = (
    product: Product,
  ) => {
    dispatch(
      addItemAction(product),
    )
  }

  const removeItem = (
    productId: number,
  ) => {
    dispatch(
      removeItemAction(productId),
    )
  }

  const clearItem = (
    productId: number,
  ) => {
    dispatch(
      clearItemAction(productId),
    )
  }

  const clearCart = () => {
    dispatch(
      clearCartAction(),
    )
  }

  return {
    items,
    addItem,
    removeItem,
    clearItem,
    clearCart,
  }
}