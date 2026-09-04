import {
  configureStore,
} from "@reduxjs/toolkit"

import authReducer from "./slices/authSlice"

import cartReducer from "./slices/cartSlice"

import {
  cartPersistenceMiddleware,
} from "./cartPersistence"


export const store =
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },

    middleware: (
      getDefaultMiddleware,
    ) =>
      getDefaultMiddleware().prepend(
        cartPersistenceMiddleware.middleware,
      ),
  })


export type RootState =
  ReturnType<
    typeof store.getState
  >


export type AppDispatch =
  typeof store.dispatch