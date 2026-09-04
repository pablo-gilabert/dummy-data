import {
  createListenerMiddleware,
} from "@reduxjs/toolkit"

import {
  addItem,
  removeItem,
  clearItem,
  clearCart,
  loadCart,
} from "./slices/cartSlice"

import {
  initializeAuth,
  login,
  logoutAction,
} from "./slices/authSlice"

import {
  CartItemSchema,
} from "../schemas/CartItemSchema"

import {
  z,
} from "zod"

import type {
  CartItem,
} from "../types/CartItem"

import type {
  RootState,
} from "./store"

const CART_STORAGE_KEY = "cart"

const getCartStorageKey = (
  userId: number,
) => {
  return `${CART_STORAGE_KEY}_${userId}`
}

const StoredCartSchema =
  z.object({
    items:
      CartItemSchema.array(),
  })

const getStoredCartItems = (
  userId: number,
): CartItem[] => {
  const storedCart =
    localStorage.getItem(
      getCartStorageKey(userId),
    )

  if (!storedCart) {
    return []
  }

  try {
    const data: unknown =
      JSON.parse(storedCart)

    return StoredCartSchema.parse(
      data,
    ).items
  } catch {
    // Corrupted or invalid local storage
    // should behave like an empty cart.
    return []
  }
}

const persistCart = (
  userId: number,
  items: CartItem[],
  previousItems: CartItem[],
) => {
  const storageKey =
    getCartStorageKey(userId)

  if (items.length === 0) {
    const storedCart =
      localStorage.getItem(
        storageKey,
      )

    // A cart that is already stored as empty
    // does not need to be changed.
    if (storedCart) {
      try {
        const data: unknown =
          JSON.parse(
            storedCart,
          )

        const parsedCart =
          StoredCartSchema.safeParse(
            data,
          )

        if (
          parsedCart.success &&
          parsedCart.data.items.length ===
            0
        ) {
          return
        }
      } catch {
        // Invalid storage is handled below.
      }
    }

    // If the cart previously contained items,
    // the user intentionally emptied it.
    if (previousItems.length > 0) {
      localStorage.removeItem(
        storageKey,
      )
    }

    return
  }

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      items,
    }),
  )
}

const persistCurrentCart = (
  listenerApi: {
    getState: () => unknown
    getOriginalState: () => unknown
  },
) => {
  const state =
    listenerApi.getState() as RootState

  const previousState =
    listenerApi.getOriginalState() as RootState

  const user =
    state.auth.user

  if (!user) {
    return
  }

  persistCart(
    user.id,
    state.cart.items,
    previousState.cart.items,
  )
}

export const cartPersistenceMiddleware =
  createListenerMiddleware()

cartPersistenceMiddleware.startListening({
  actionCreator:
    initializeAuth.fulfilled,

  effect: (
    action,
    listenerApi,
  ) => {
    const user =
      action.payload

    if (!user) {
      listenerApi.dispatch(
        loadCart([]),
      )

      return
    }

    const storedItems =
      getStoredCartItems(
        user.id,
      )

    listenerApi.dispatch(
      loadCart(storedItems),
    )
  },
})

cartPersistenceMiddleware.startListening({
  actionCreator:
    login.fulfilled,

  effect: (
    action,
    listenerApi,
  ) => {
    const storedItems =
      getStoredCartItems(
        action.payload.id,
      )

    listenerApi.dispatch(
      loadCart(storedItems),
    )
  },
})

cartPersistenceMiddleware.startListening({
  actionCreator:
    logoutAction,

  effect: (
    _action,
    listenerApi,
  ) => {
    // Keep the user's persisted cart in localStorage
    // so it can be restored if the user logs in again.
    listenerApi.dispatch(
      loadCart([]),
    )
  },
})

cartPersistenceMiddleware.startListening({
  actionCreator:
    addItem,

  effect: (
    _action,
    listenerApi,
  ) => {
    persistCurrentCart(
      listenerApi,
    )
  },
})

cartPersistenceMiddleware.startListening({
  actionCreator:
    removeItem,

  effect: (
    _action,
    listenerApi,
  ) => {
    persistCurrentCart(
      listenerApi,
    )
  },
})

cartPersistenceMiddleware.startListening({
  actionCreator:
    clearItem,

  effect: (
    _action,
    listenerApi,
  ) => {
    persistCurrentCart(
      listenerApi,
    )
  },
})

cartPersistenceMiddleware.startListening({
  actionCreator:
    clearCart,

  effect: (
    _action,
    listenerApi,
  ) => {
    persistCurrentCart(
      listenerApi,
    )
  },
})