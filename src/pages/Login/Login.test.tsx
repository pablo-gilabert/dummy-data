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
  MemoryRouter,
} from "react-router-dom"

import Login from "./Login"

vi.mock(
  "../../store/useAuth",
  () => ({
    useAuth: vi.fn(),
  })
)

import {
  useAuth,
} from "../../store/useAuth"

const mockedUseAuth =
  vi.mocked(useAuth)

const mockLogin =
  vi.fn()

const mockNavigate =
  vi.fn()

vi.mock(
  "react-router-dom",
  async () => {

    const actual =
      await vi.importActual<
        typeof import("react-router-dom")
      >(
        "react-router-dom"
      )

    return {
      ...actual,

      useNavigate: () =>
        mockNavigate,
    }
  }
)

describe("Login", () => {

  beforeEach(() => {

    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
    })
  })

  it(
    "renders the login form",
    () => {

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Login",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText(
          "Username"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText(
          "Password"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Sign in",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows an error when username is empty",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Sign in",
          }
        )
      )

      expect(
        screen.getByText(
          "Username is required."
        )
      ).toBeInTheDocument()

      expect(
        mockLogin
      ).not.toHaveBeenCalled()

      expect(
        mockNavigate
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "shows an error when password is empty",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      await user.type(
        screen.getByLabelText(
          "Username"
        ),
        "emilys"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Sign in",
          }
        )
      )

      expect(
        screen.getByText(
          "Password is required."
        )
      ).toBeInTheDocument()

      expect(
        mockLogin
      ).not.toHaveBeenCalled()

      expect(
        mockNavigate
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "logs in and navigates to products",
    async () => {

      const user =
        userEvent.setup()

      mockLogin.mockResolvedValue(
        undefined
      )

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      await user.type(
        screen.getByLabelText(
          "Username"
        ),
        "  emilys  "
      )

      await user.type(
        screen.getByLabelText(
          "Password"
        ),
        "emilyspass"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Sign in",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockLogin
        ).toHaveBeenCalledWith(
          "emilys",
          "emilyspass"
        )

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          "/products"
        )

      })
    }
  )

  it(
    "shows the login error when authentication fails",
    async () => {

      const user =
        userEvent.setup()

      mockLogin.mockRejectedValue(
        new Error(
          "Invalid username or password."
        )
      )

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      await user.type(
        screen.getByLabelText(
          "Username"
        ),
        "wrong-user"
      )

      await user.type(
        screen.getByLabelText(
          "Password"
        ),
        "wrong-password"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Sign in",
          }
        )
      )

      await waitFor(() => {

        expect(
          screen.getByText(
            "Invalid username or password."
          )
        ).toBeInTheDocument()

      })

      expect(
        mockNavigate
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "disables the form while login is loading",
    async () => {

      const user =
        userEvent.setup()

      let resolveLogin:
        (() => void) | undefined

      mockLogin.mockImplementation(
        () =>
          new Promise<void>(
            (resolve) => {
              resolveLogin = resolve
            }
          )
      )

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      const usernameInput =
        screen.getByLabelText(
          "Username"
        )

      const passwordInput =
        screen.getByLabelText(
          "Password"
        )

      await user.type(
        usernameInput,
        "emilys"
      )

      await user.type(
        passwordInput,
        "emilyspass"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Sign in",
          }
        )
      )

      expect(
        screen.getByRole(
          "button",
          {
            name: "Signing in...",
          }
        )
      ).toBeDisabled()

      expect(
        usernameInput
      ).toBeDisabled()

      expect(
        passwordInput
      ).toBeDisabled()

      resolveLogin?.()

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "Sign in",
            }
          )
        ).toBeEnabled()

      })
    }
  )
})