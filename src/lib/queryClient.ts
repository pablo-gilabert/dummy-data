import {
  QueryClient,
} from "@tanstack/react-query"

import { ApiError } from "../services/api"

// Centralizes TanStack Query defaults so every query follows the same
// caching, garbage-collection, retry, and refetching policy.
export const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,

        // Client errors should not be retried because repeating the same
        // request is unlikely to change a 4xx response.
        retry: (
          failureCount,
          error,
        ) => {
          if (
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false
          }

          return failureCount < 2
        },

        // Product data is stable enough that refetching on window focus
        // would add unnecessary network requests for this application.
        refetchOnWindowFocus: false,
      },
    },
  })