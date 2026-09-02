import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import AuthProvider from "./AuthProvider"

import {
  useAuth,
} from "./useAuth"

vi.mock(
  "../services/auth",
  () => ({
    getCurrentUser:
      vi.fn(),

    loginUser:
      vi.fn(),
  })
)

vi.mock(
  "../services/authStorage",
  () => ({
    clearStoredUser:
      vi.fn(),

    getStoredUser:
      vi.fn(),

    setStoredUser:
      vi.fn(),
  })
)

import {
  getCurrentUser,
  loginUser,
} from "../services/auth"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../services/authStorage"

const mockedGetCurrentUser =
  vi.mocked(
    getCurrentUser
  )

const mockedLoginUser =
  vi.mocked(
    loginUser
  )

const mockedGetStoredUser =
  vi.mocked(
    getStoredUser
  )

const mockedSetStoredUser =
  vi.mocked(
    setStoredUser
  )

const mockedClearStoredUser =
  vi.mocked(
    clearStoredUser
  )

const mockUser = {
  id:
    1,

  username:
    "emilys",

  email:
    "emily@example.com",

  firstName:
    "Emily",

  lastName:
    "Johnson",

  gender:
    "female",

  image:
    "https://example.com/image.jpg",

  accessToken:
    "access-token",

  refreshToken:
    "refresh-token",
}

const TestComponent = () => {

  const {
    user,
    isLoading,
    login,
    logout,
  } = useAuth()

  const handleLogin = async () => {

    try {

      await login(
        "emilys",
        "emily-password"
      )

    } catch {

      // Expected login errors are
      // handled by the provider consumer.

    }
  }

  return (

    <div>

      <span>
        {isLoading
          ? "Loading"
          : "Ready"}
      </span>

      <span>
        {user?.firstName ??
          "No user"}
      </span>

      <button
        type="button"
        onClick={
          handleLogin
        }
      >
        Login
      </button>

      <button
        type="button"
        onClick={
          logout
        }
      >
        Logout
      </button>

    </div>

  )
}

const renderAuthProvider = () => {

  const queryClient =
    new QueryClient({

      defaultOptions: {

        queries: {
          retry:
            false,
        },

        mutations: {
          retry:
            false,
        },

      },

    })

  return render(

    <QueryClientProvider
      client={
        queryClient
      }
    >

      <AuthProvider>

        <TestComponent />

      </AuthProvider>

    </QueryClientProvider>

  )
}

describe(
  "AuthProvider",
  () => {

    beforeEach(() => {

      vi.clearAllMocks()

      mockedGetStoredUser
        .mockReturnValue(
          null
        )

    })

    it(
      "starts in loading state",
      () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser
          )

        mockedGetCurrentUser
          .mockImplementation(
            () =>
              new Promise(
                () => {}
              )
          )

        renderAuthProvider()

        expect(
          screen.getByText(
            "Loading"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Emily"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "loads and validates the stored user",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser
          )

        mockedGetCurrentUser
          .mockResolvedValue({
            ...mockUser,
          })

        renderAuthProvider()

        expect(
          screen.getByText(
            "Loading"
          )
        ).toBeInTheDocument()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        expect(
          screen.getByText(
            "Emily"
          )
        ).toBeInTheDocument()

        expect(
          mockedGetCurrentUser
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          mockedSetStoredUser
        ).toHaveBeenCalledWith(

          expect.objectContaining({

            id:
              1,

            firstName:
              "Emily",

            accessToken:
              "access-token",

            refreshToken:
              "refresh-token",

          })

        )

      }
    )

    it(
      "preserves the latest stored tokens when validating the session",
      async () => {

        const latestStoredUser = {

          ...mockUser,

          accessToken:
            "latest-access-token",

          refreshToken:
            "latest-refresh-token",

        }

        mockedGetStoredUser
          .mockReturnValue(
            latestStoredUser
          )

        mockedGetCurrentUser
          .mockResolvedValue({

            ...mockUser,

            accessToken:
              "api-access-token",

            refreshToken:
              "api-refresh-token",

          })

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        expect(
          mockedSetStoredUser
        ).toHaveBeenCalledWith(

          expect.objectContaining({

            accessToken:
              "latest-access-token",

            refreshToken:
              "latest-refresh-token",

          })

        )

      }
    )

    it(
      "falls back to the original stored tokens when no latest tokens are available",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser
          )

        mockedGetCurrentUser
          .mockResolvedValue({

            id:
              mockUser.id,

            username:
              mockUser.username,

            email:
              mockUser.email,

            firstName:
              mockUser.firstName,

            lastName:
              mockUser.lastName,

            gender:
              mockUser.gender,

            image:
              mockUser.image,

            accessToken:
              "api-access-token",

            refreshToken:
              "api-refresh-token",

          })

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        expect(
          mockedSetStoredUser
        ).toHaveBeenCalledWith(

          expect.objectContaining({

            accessToken:
              "access-token",

            refreshToken:
              "refresh-token",

          })

        )

      }
    )

    it(
      "does not validate a session when there is no stored user",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            null
          )

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        expect(
          screen.getByText(
            "No user"
          )
        ).toBeInTheDocument()

        expect(
          mockedGetCurrentUser
        ).not.toHaveBeenCalled()

        expect(
          mockedSetStoredUser
        ).not.toHaveBeenCalled()

        expect(
          mockedClearStoredUser
        ).not.toHaveBeenCalled()

      }
    )

    it(
      "preserves the session when the current user cannot be validated",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser
          )

        mockedGetCurrentUser
          .mockRejectedValue(
            new Error(
              "Network error"
            )
          )

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        expect(
          screen.getByText(
            "Emily"
          )
        ).toBeInTheDocument()

        expect(
          screen.queryByText(
            "No user"
          )
        ).not.toBeInTheDocument()

        expect(
          mockedGetCurrentUser
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          mockedClearStoredUser
        ).not.toHaveBeenCalled()

        expect(
          mockedSetStoredUser
        ).not.toHaveBeenCalled()

      }
    )

    it(
      "clears the user when the stored session is removed during successful validation",
      async () => {

        let storedUser:
          typeof mockUser | null =
            mockUser

        mockedGetStoredUser
          .mockImplementation(
            () => storedUser
          )

        mockedGetCurrentUser
          .mockImplementation(
            async () => {

              storedUser = null

              return {
                ...mockUser,
              }

            }
          )

        renderAuthProvider()

        expect(
          screen.getByText(
            "Emily"
          )
        ).toBeInTheDocument()

        await waitFor(() => {

          expect(
            screen.getByText(
              "No user"
            )
          ).toBeInTheDocument()

        })

        expect(
          mockedGetCurrentUser
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          mockedSetStoredUser
        ).not.toHaveBeenCalled()

      }
    )

    it(
      "clears the user when the stored session is removed during failed validation",
      async () => {

        let storedUser:
          typeof mockUser | null =
            mockUser

        mockedGetStoredUser
          .mockImplementation(
            () => storedUser
          )

        mockedGetCurrentUser
          .mockImplementation(
            async () => {

              storedUser = null

              throw new Error(
                "Network error"
              )

            }
          )

        renderAuthProvider()

        expect(
          screen.getByText(
            "Emily"
          )
        ).toBeInTheDocument()

        await waitFor(() => {

          expect(
            screen.getByText(
              "No user"
            )
          ).toBeInTheDocument()

        })

        expect(
          mockedGetCurrentUser
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          mockedSetStoredUser
        ).not.toHaveBeenCalled()

        expect(
          mockedClearStoredUser
        ).not.toHaveBeenCalled()

      }
    )

    it(
      "logs in and stores the authenticated user",
      async () => {

        const user =
          userEvent.setup()

        mockedGetStoredUser
          .mockReturnValue(
            null
          )

        mockedLoginUser
          .mockResolvedValue(
            mockUser
          )

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        expect(
          screen.getByText(
            "No user"
          )
        ).toBeInTheDocument()

        await user.click(

          screen.getByRole(
            "button",
            {
              name:
                "Login",
            }
          )

        )

        await waitFor(() => {

          expect(
            screen.getByText(
              "Emily"
            )
          ).toBeInTheDocument()

        })

        expect(
          mockedLoginUser
        ).toHaveBeenCalledWith(
          "emilys",
          "emily-password"
        )

        expect(
          mockedLoginUser
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          mockedSetStoredUser
        ).toHaveBeenCalledWith(
          mockUser
        )

      }
    )

    it(
      "does not authenticate the user when login fails",
      async () => {

        const user =
          userEvent.setup()

        mockedGetStoredUser
          .mockReturnValue(
            null
          )

        mockedLoginUser
          .mockRejectedValue(
            new Error(
              "Invalid credentials"
            )
          )

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        await user.click(

          screen.getByRole(
            "button",
            {
              name:
                "Login",
            }
          )

        )

        await waitFor(() => {

          expect(
            mockedLoginUser
          ).toHaveBeenCalledTimes(
            1
          )

        })

        expect(
          screen.getByText(
            "No user"
          )
        ).toBeInTheDocument()

        expect(
          mockedSetStoredUser
        ).not.toHaveBeenCalled()

      }
    )

    it(
      "logs out and clears the stored user",
      async () => {

        const user =
          userEvent.setup()

        mockedGetStoredUser
          .mockReturnValue(
            mockUser
          )

        mockedGetCurrentUser
          .mockResolvedValue({
            ...mockUser,
          })

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Emily"
            )
          ).toBeInTheDocument()

        })

        await user.click(

          screen.getByRole(
            "button",
            {
              name:
                "Logout",
            }
          )

        )

        expect(
          screen.getByText(
            "No user"
          )
        ).toBeInTheDocument()

        expect(
          mockedClearStoredUser
        ).toHaveBeenCalledTimes(
          1
        )

      }
    )

    it(
      "resets the login mutation when logging out",
      async () => {

        const user =
          userEvent.setup()

        mockedGetStoredUser
          .mockReturnValue(
            null
          )

        mockedLoginUser
          .mockResolvedValue(
            mockUser
          )

        renderAuthProvider()

        await waitFor(() => {

          expect(
            screen.getByText(
              "Ready"
            )
          ).toBeInTheDocument()

        })

        await user.click(

          screen.getByRole(
            "button",
            {
              name:
                "Login",
            }
          )

        )

        await waitFor(() => {

          expect(
            screen.getByText(
              "Emily"
            )
          ).toBeInTheDocument()

        })

        await user.click(

          screen.getByRole(
            "button",
            {
              name:
                "Logout",
            }
          )

        )

        expect(
          mockedClearStoredUser
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          screen.getByText(
            "No user"
          )
        ).toBeInTheDocument()

      }
    )

  }
)