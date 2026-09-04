import {
  RefreshResponseSchema,
} from "../schemas/RefreshResponseSchema"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "./authStorage"

const API_URL = "https://dummyjson.com/auth"

interface RequestOptions extends RequestInit {
  authenticated?: boolean
}

let isRefreshing = false
let refreshPromise: Promise<boolean> | null =
  null

// Refreshing is shared between concurrent requests so several 401 responses
// cannot trigger multiple refresh-token requests at the same time.
const refreshAccessToken =
  async (): Promise<boolean> => {
    const storedUser =
      getStoredUser()

    if (!storedUser?.refreshToken) {
      return false
    }

    if (
      isRefreshing &&
      refreshPromise
    ) {
      return refreshPromise
    }

    isRefreshing = true

    refreshPromise =
      (async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/refresh`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  refreshToken:
                    storedUser.refreshToken,
                }),
              },
            )

          if (!response.ok) {
            return false
          }

          const data: unknown =
            await response.json()

          const parsedData =
            RefreshResponseSchema.parse(
              data,
            )

          setStoredUser({
            ...storedUser,
            accessToken:
              parsedData.accessToken,
            refreshToken:
              parsedData.refreshToken,
          })

          return true
        } catch {
          return false
        } finally {
          isRefreshing = false
          refreshPromise = null
        }
      })()

    return refreshPromise
  }

// Wraps authenticated requests with token injection and a single automatic
// retry after a successful refresh. The service layer remains unaware of this flow.
export const apiClient = async (
  url: string,
  options: RequestOptions = {},
): Promise<Response> => {
  const {
    authenticated = false,
    headers,
    ...requestOptions
  } = options

  const makeRequest =
    async (): Promise<Response> => {
      const requestHeaders =
        new Headers(headers)

      if (
        !requestHeaders.has(
          "Content-Type",
        )
      ) {
        requestHeaders.set(
          "Content-Type",
          "application/json",
        )
      }

      if (authenticated) {
        const storedUser =
          getStoredUser()

        if (
          !storedUser?.accessToken
        ) {
          throw new Error(
            "Authentication required.",
          )
        }

        requestHeaders.set(
          "Authorization",
          `Bearer ${storedUser.accessToken}`,
        )
      }

      return fetch(url, {
        ...requestOptions,
        headers: requestHeaders,
      })
    }

  if (!authenticated) {
    return makeRequest()
  }

  let response =
    await makeRequest()

  if (response.status !== 401) {
    return response
  }

  const refreshed =
    await refreshAccessToken()

  if (!refreshed) {
    return response
  }

  response =
    await makeRequest()

  // A second 401 means the refreshed session is no longer valid.
  if (response.status === 401) {
    clearStoredUser()
  }

  return response
}