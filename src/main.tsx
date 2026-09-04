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

import {
  Provider,
} from "react-redux"

import App from "./App"

import {
  queryClient,
} from "./lib/queryClient"

import {
  initializeAuth,
} from "./store/slices/authSlice"

import {
  store,
} from "./store/store"

import "./index.css"


store.dispatch(
  initializeAuth(),
)


createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider
        client={queryClient}
      >
        <Provider store={store}>
          <App />
        </Provider>

        <ReactQueryDevtools
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)