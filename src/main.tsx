import {
  StrictMode,
} from "react"

import {
  createRoot,
} from "react-dom/client"

import {
  QueryClientProvider,
} from "@tanstack/react-query"

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools"

import {
  BrowserRouter,
} from "react-router-dom"

import App from "./App"

import {
  CartProvider,
} from "./CartContext/CartProvider"

import AuthProvider from "./AuthContext/AuthProvider"

import {
  queryClient,
} from "./lib/queryClient"

import "./index.css"

createRoot(
  document.getElementById("root")!
).render(

  <StrictMode>

    <BrowserRouter>

      <QueryClientProvider
        client={queryClient}
      >

        <AuthProvider>

          <CartProvider>

            <App />

          </CartProvider>

        </AuthProvider>

        <ReactQueryDevtools
          initialIsOpen={false}
        />

      </QueryClientProvider>

    </BrowserRouter>

  </StrictMode>
)