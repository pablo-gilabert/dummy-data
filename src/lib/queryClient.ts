import {
  QueryClient,
} from "@tanstack/react-query"

import { ApiError } from "../services/api"

export const queryClient =
  new QueryClient({

    defaultOptions: {

      queries: {

        staleTime:
          1000 * 60 * 5,

        gcTime:
          1000 * 60 * 30,

        retry: (
          failureCount,
          error
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

        refetchOnWindowFocus:
          false,

      },

    },

  })