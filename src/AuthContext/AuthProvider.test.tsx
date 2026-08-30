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
    getCurrentUser: vi.fn(),
    loginUser: vi.fn(),
    refreshAuthToken: vi.fn(),
  })
)

vi.mock(
  "../services/authStorage",
  () => ({
    clearStoredUser: vi.fn(),
    getStoredUser: vi.fn(),
    setStoredUser: vi.fn(),
  })
)

import {
  getCurrentUser,
  loginUser,
  refreshAuthToken,
} from "../services/auth"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../services/authStorage"

const mockedGetCurrentUser =
  vi.mocked(getCurrentUser)

const mockedLoginUser =
  vi.mocked(loginUser)

const mockedRefreshAuthToken =
  vi.mocked(refreshAuthToken)

const mockedGetStoredUser =
  vi.mocked(getStoredUser)

const mockedSetStoredUser =
  vi.mocked(setStoredUser)

const mockedClearStoredUser =
  vi.mocked(clearStoredUser)

const mockUser = {
  id: 1,
  username: "emilys",
  email: "emily@example.com",
  firstName: "Emily",
  lastName: "Johnson",
  gender: "female",
  image:
    "https://example.com/image.jpg",
  accessToken: "access-token",
  refreshToken: "refresh-token",
}

const TestComponent = () => {

  const {
    user,
    isLoading,
    login,
    logout,
  } = useAuth()

  return (
    <div>

      <span>
        {isLoading
          ? "Loading"
          : "Ready"}
      </span>

      <span>
        {user?.firstName ?? "No user"}
      </span>

      <button
        type="button"
        onClick={() =>
          login(
            "emilys",
            "emily-password"
          )
        }
      >
        Login
      </button>

      <button
        type="button"
        onClick={logout}
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
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })

  return render(
    <QueryClientProvider
      client={queryClient}
    >
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe("AuthProvider", () => {

  beforeEach(() => {

    vi.clearAllMocks()

    mockedGetStoredUser.mockReturnValue(
      null
    )
  })

  it(
    "loads and validates the stored user",
    async () => {

      mockedGetStoredUser.mockReturnValue(
        mockUser
      )

      mockedGetCurrentUser.mockResolvedValue({
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
      ).toHaveBeenCalledTimes(1)

      expect(
        mockedSetStoredUser
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          firstName: "Emily",
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

      mockedGetStoredUser.mockReturnValue(
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
        mockedRefreshAuthToken
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
    "refreshes the token when the current session is invalid",
    async () => {

      mockedGetStoredUser.mockReturnValue(
        mockUser
      )

      mockedGetCurrentUser.mockRejectedValue(
        new Error(
          "Session expired"
        )
      )

      mockedRefreshAuthToken.mockResolvedValue({
        accessToken:
          "new-access-token",
        refreshToken:
          "new-refresh-token",
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
        screen.getByText(
          "Emily"
        )
      ).toBeInTheDocument()

      expect(
        mockedGetCurrentUser
      ).toHaveBeenCalledTimes(1)

      expect(
        mockedRefreshAuthToken
      ).toHaveBeenCalledWith(
        "refresh-token"
      )

      expect(
        mockedSetStoredUser
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          firstName: "Emily",
          accessToken:
            "new-access-token",
          refreshToken:
            "new-refresh-token",
        })
      )
    }
  )

  it(
    "clears the session when validation and refresh both fail",
    async () => {

      mockedGetStoredUser.mockReturnValue(
        mockUser
      )

      mockedGetCurrentUser.mockRejectedValue(
        new Error(
          "Session expired"
        )
      )

      mockedRefreshAuthToken.mockRejectedValue(
        new Error(
          "Refresh token expired"
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
          "No user"
        )
      ).toBeInTheDocument()

      expect(
        mockedGetCurrentUser
      ).toHaveBeenCalledTimes(1)

      expect(
        mockedRefreshAuthToken
      ).toHaveBeenCalledWith(
        "refresh-token"
      )

      expect(
        mockedClearStoredUser
      ).toHaveBeenCalledTimes(1)

      expect(
        mockedSetStoredUser
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "logs in and stores the authenticated user",
    async () => {

      const user =
        userEvent.setup()

      mockedGetStoredUser.mockReturnValue(
        null
      )

      mockedLoginUser.mockResolvedValue(
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
            name: "Login",
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
      ).toHaveBeenCalledTimes(1)

      expect(
        mockedSetStoredUser
      ).toHaveBeenCalledWith(
        mockUser
      )
    }
  )

  it(
    "logs out and clears the stored user",
    async () => {

      const user =
        userEvent.setup()

      mockedGetStoredUser.mockReturnValue(
        mockUser
      )

      mockedGetCurrentUser.mockResolvedValue({
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
            name: "Logout",
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
      ).toHaveBeenCalledTimes(1)
    }
  )
})