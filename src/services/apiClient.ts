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

    console.log(
      "[apiClient] refresh requested",
      {
        hasUser: Boolean(storedUser),
        hasRefreshToken: Boolean(
          storedUser?.refreshToken,
        ),
      },
    )

    if (
      !storedUser ||
      !storedUser.refreshToken
    ) {
      console.log(
        "[apiClient] refresh aborted: no refresh token",
      )

      return false
    }

    if (
      isRefreshing &&
      refreshPromise
    ) {
      console.log(
        "[apiClient] waiting for existing refresh",
      )

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

          console.log(
            "[apiClient] refresh response",
            {
              status: response.status,
              ok: response.ok,
            },
          )

          if (!response.ok) {
            return false
          }

          const data =
            await response.json() as RefreshResponse

          console.log(
            "[apiClient] refresh succeeded",
            {
              hasAccessToken:
                Boolean(data.accessToken),
              hasRefreshToken:
                Boolean(data.refreshToken),
            },
          )

          setStoredUser({
            ...storedUser,

            accessToken:
              data.accessToken,

            refreshToken:
              data.refreshToken,
          })

          return true

        } catch (error) {

          console.error(
            "[apiClient] refresh error",
            error,
          )

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

        console.log(
          "[apiClient] authenticated request",
          {
            url,
            hasUser: Boolean(storedUser),
            hasAccessToken:
              Boolean(
                storedUser?.accessToken,
              ),
          },
        )

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

      try {

        const response =
          await fetch(
            url,
            {
              ...requestOptions,
              headers: requestHeaders,
            },
          )

        console.log(
          "[apiClient] response",
          {
            url,
            status: response.status,
            ok: response.ok,
          },
        )

        return response

      } catch (error) {

        console.error(
          "[apiClient] request error",
          {
            url,
            error,
          },
        )

        throw error
      }
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

  console.log(
    "[apiClient] received 401, attempting refresh",
  )

  const refreshed =
    await refreshAccessToken()

  console.log(
    "[apiClient] refresh result",
    {
      refreshed,
    },
  )

  if (!refreshed) {

    console.log(
      "[apiClient] refresh failed",
    )

    return response
  }

  console.log(
    "[apiClient] retrying authenticated request",
  )

  response =
    await makeRequest()

  console.log(
    "[apiClient] retry response",
    {
      url,
      status: response.status,
      ok: response.ok,
    },
  )

  if (
    response.status === 401
  ) {

    console.log(
      "[apiClient] retry returned 401, clearing stored user",
    )

    clearStoredUser()
  }

  return response
}