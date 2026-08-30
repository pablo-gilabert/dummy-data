import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "./authStorage"

const API_URL =
  "https://dummyjson.com/auth"

interface RequestOptions
  extends RequestInit {
  authenticated?: boolean
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

let isRefreshing = false

let refreshPromise:
  Promise<boolean> | null = null

const refreshAccessToken =
  async (): Promise<boolean> => {

    const storedUser =
      getStoredUser()

    if (
      !storedUser ||
      !storedUser.refreshToken
    ) {

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
              }
            )

          if (!response.ok) {

            return false
          }

          const data =
            await (
              response.json()
            ) as RefreshResponse

          setStoredUser({
            ...storedUser,

            accessToken:
              data.accessToken,

            refreshToken:
              data.refreshToken,
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

export const apiClient = async (
  url: string,
  options: RequestOptions = {}
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
          "Content-Type"
        )
      ) {

        requestHeaders.set(
          "Content-Type",
          "application/json"
        )
      }

      if (authenticated) {

        const storedUser =
          getStoredUser()

        if (
          !storedUser?.accessToken
        ) {

          throw new Error(
            "Authentication required."
          )
        }

        requestHeaders.set(
          "Authorization",
          `Bearer ${storedUser.accessToken}`
        )
      }

      return fetch(
        url,
        {
          ...requestOptions,
          headers: requestHeaders,
        }
      )
    }

  if (!authenticated) {

    return makeRequest()
  }

  let response =
    await makeRequest()

  if (
    response.status !== 401
  ) {

    return response
  }

  const refreshed =
    await refreshAccessToken()

  if (!refreshed) {

    clearStoredUser()

    return response
  }

  response =
    await makeRequest()

  return response
}