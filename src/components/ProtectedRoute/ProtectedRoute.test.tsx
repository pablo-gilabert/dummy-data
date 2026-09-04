import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom"

import ProtectedRoute from "./ProtectedRoute"

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

describe("ProtectedRoute", () => {

  it(
    "shows nothing while authentication is loading",
    () => {

      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        login: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <MemoryRouter
          initialEntries={[
            "/protected",
          ]}
        >
          <Routes>

            <Route
              element={
                <ProtectedRoute />
              }
            >

              <Route
                path="/protected"
                element={
                  <div>
                    Protected content
                  </div>
                }
              />

            </Route>

          </Routes>
        </MemoryRouter>
      )

      expect(
        screen.queryByText(
          "Protected content"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "redirects to login when there is no authenticated user",
    () => {

      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <MemoryRouter
          initialEntries={[
            "/protected",
          ]}
        >
          <Routes>

            <Route
              element={
                <ProtectedRoute />
              }
            >

              <Route
                path="/protected"
                element={
                  <div>
                    Protected content
                  </div>
                }
              />

            </Route>

            <Route
              path="/login"
              element={
                <div>
                  Login page
                </div>
              }
            />

          </Routes>
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Login page"
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "Protected content"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "renders the protected content when the user is authenticated",
    () => {

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <MemoryRouter
          initialEntries={[
            "/protected",
          ]}
        >
          <Routes>

            <Route
              element={
                <ProtectedRoute />
              }
            >

              <Route
                path="/protected"
                element={
                  <div>
                    Protected content
                  </div>
                }
              />

            </Route>

            <Route
              path="/login"
              element={
                <div>
                  Login page
                </div>
              }
            />

          </Routes>
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Protected content"
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "Login page"
        )
      ).not.toBeInTheDocument()
    }
  )
})