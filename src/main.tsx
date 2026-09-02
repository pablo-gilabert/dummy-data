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

// The provider order is intentional: routing and server-state services
// are available to both authentication and cart state throughout the app.
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

        {/* Devtools are useful locally without changing application behavior. */}
        <ReactQueryDevtools
          initialIsOpen={false}
        />

      </QueryClientProvider>

    </BrowserRouter>

  </StrictMode>
)