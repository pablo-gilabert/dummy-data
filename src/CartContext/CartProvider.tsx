import {
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react"

import type { Product } from "../types/Product"

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

// Each authenticated user gets an independent storage key so switching
// accounts cannot expose another user's cart.
const getCartStorageKey = (userId: number) => {
  return `${CART_STORAGE_KEY}_${userId}`
}

const getStoredCartItems = (userId: number) => {
  const storedCart = localStorage.getItem(
    getCartStorageKey(userId),
  )

  if (!storedCart) {
    return []
  }

  try {
    const parsedCart = JSON.parse(storedCart)

    if (
      !parsedCart ||
      !Array.isArray(parsedCart.items)
    ) {
      return []
    }

    return parsedCart.items
  } catch {
    // Corrupted local storage should behave like an empty cart.
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

  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
  )

  const previousUserId = useRef<number | null>(null)

  useEffect(() => {
    // Wait for authentication initialization before deciding which cart to load.
    if (isLoading) {
      return
    }

    const currentUserId = user?.id ?? null

    if (previousUserId.current === currentUserId) {
      return
    }

    previousUserId.current = currentUserId

    if (!user) {
      dispatch({
        type: CartActionType.LOAD_CART,
        payload: [],
      })
      return
    }

    const storedItems = getStoredCartItems(user.id)

    dispatch({
      type: CartActionType.LOAD_CART,
      payload: storedItems,
    })
  }, [user, isLoading])

  // Persist only successful state transitions. The reducer is reused here to
  // calculate the exact next state before React schedules the dispatch.
  const persistCart = (items: typeof state.items) => {
    if (!user) {
      return
    }

    const storageKey = getCartStorageKey(user.id)

    if (items.length === 0) {
      localStorage.removeItem(storageKey)
      return
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({ items }),
    )
  }

  const addItem = (product: Product) => {
    const action = {
      type: CartActionType.ADD_ITEM,
      payload: product,
    } as const

    const nextState = cartReducer(state, action)
    dispatch(action)

    if (nextState !== state) {
      persistCart(nextState.items)
    }
  }

  const removeItem = (productId: number) => {
    const action = {
      type: CartActionType.REMOVE_ITEM,
      payload: productId,
    } as const

    const nextState = cartReducer(state, action)
    dispatch(action)

    if (nextState !== state) {
      persistCart(nextState.items)
    }
  }

  const clearItem = (productId: number) => {
    const action = {
      type: CartActionType.CLEAR_ITEM,
      payload: productId,
    } as const

    const nextState = cartReducer(state, action)
    dispatch(action)

    if (nextState !== state) {
      persistCart(nextState.items)
    }
  }

  const clearCart = () => {
    const action = {
      type: CartActionType.CLEAR_CART,
    } as const

    const nextState = cartReducer(state, action)
    dispatch(action)

    if (nextState !== state) {
      persistCart(nextState.items)
    }
  }

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