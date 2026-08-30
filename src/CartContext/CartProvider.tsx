import {
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react"

import type {
  Product,
} from "../types/Product"

import {
  cartReducer,
  initialCartState,
} from "./cartReducer"

import {
  CartActionType,
} from "./cartActions"

import {
  CartContext,
} from "./cartContext"

import {
  useAuth,
} from "../AuthContext/useAuth"

interface CartProviderProps {
  children: ReactNode
}

const CART_STORAGE_KEY = "cart"

const getCartStorageKey = (
  userId: number
) => {
  return `${CART_STORAGE_KEY}_${userId}`
}

const getStoredCartItems = (
  userId: number
) => {
  const storedCart =
    localStorage.getItem(
      getCartStorageKey(userId)
    )

  if (!storedCart) {
    return []
  }

  try {
    const parsedCart =
      JSON.parse(storedCart)

    if (
      !parsedCart ||
      !Array.isArray(
        parsedCart.items
      )
    ) {
      return []
    }

    return parsedCart.items
  } catch {
    return []
  }
}

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  const {
    user,
    isLoading,
  } = useAuth()

  const [
    state,
    dispatch,
  ] = useReducer(
    cartReducer,
    initialCartState
  )

  const previousUserId =
    useRef<number | null>(null)

  /*
   * Indicates whether the current state
   * was changed by the user.
   *
   * LOAD_CART does not count as a change.
   */
  const cartWasModified =
    useRef(false)

  /*
   * Keeps track of which user's cart is
   * currently represented by `state`.
   */
  const stateUserId =
    useRef<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      return
    }

    const currentUserId =
      user?.id ?? null

    if (
      previousUserId.current ===
      currentUserId
    ) {
      return
    }

    previousUserId.current =
      currentUserId

    /*
     * The current state belongs to the
     * previous user.
     */
    stateUserId.current =
      null

    /*
     * Loading a cart is NOT a modification.
     */
    cartWasModified.current =
      false

    if (!user) {
      dispatch({
        type:
          CartActionType.LOAD_CART,
        payload: [],
      })

      return
    }

    const storedItems =
      getStoredCartItems(
        user.id
      )

    dispatch({
      type:
        CartActionType.LOAD_CART,
      payload: storedItems,
    })
  }, [
    user,
    isLoading,
  ])

  /*
   * After the LOAD_CART render has completed,
   * associate the state with the current user.
   */
  useEffect(() => {
    if (isLoading) {
      return
    }

    const currentUserId =
      user?.id ?? null

    if (
      previousUserId.current !==
      currentUserId
    ) {
      return
    }

    /*
     * Only establish ownership after
     * the cart for this user has rendered.
     */
    if (
      stateUserId.current !==
      currentUserId
    ) {
      stateUserId.current =
        currentUserId
    }
  }, [
    state,
    user,
    isLoading,
  ])

  const addItem = (
    product: Product
  ) => {
    cartWasModified.current =
      true

    dispatch({
      type:
        CartActionType.ADD_ITEM,
      payload: product,
    })
  }

  const removeItem = (
    productId: number
  ) => {
    cartWasModified.current =
      true

    dispatch({
      type:
        CartActionType.REMOVE_ITEM,
      payload: productId,
    })
  }

  const clearItem = (
    productId: number
  ) => {
    cartWasModified.current =
      true

    dispatch({
      type:
        CartActionType.CLEAR_ITEM,
      payload: productId,
    })
  }

  const clearCart = () => {
    cartWasModified.current =
      true

    dispatch({
      type:
        CartActionType.CLEAR_CART,
    })
  }

  useEffect(() => {
    if (
      isLoading ||
      !user
    ) {
      return
    }

    /*
     * Never persist a cart just because
     * LOAD_CART changed the state.
     */
    if (
      !cartWasModified.current
    ) {
      return
    }

    /*
     * Never save a cart under the wrong
     * user's key.
     */
    if (
      stateUserId.current !==
      user.id
    ) {
      return
    }

    const storageKey =
      getCartStorageKey(user.id)

    /*
     * An empty cart does not need to be
     * persisted. Remove the user's key
     * instead of storing {"items":[]}.
     */
    if (state.items.length === 0) {
      localStorage.removeItem(
        storageKey
      )

      return
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(state)
    )
  }, [
    state,
    user,
    isLoading,
  ])

  return (
    <CartContext.Provider
      value={{
        items: state.items,

        addItem,

        removeItem,

        clearItem,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}