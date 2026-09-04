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

import PublicRoute from "./PublicRoute"

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

describe("PublicRoute", () => {

  it(
    "renders the public content when there is no authenticated user",
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
            "/login",
          ]}
        >
          <Routes>

            <Route
              element={
                <PublicRoute />
              }
            >

              <Route
                path="/login"
                element={
                  <div>
                    Login page
                  </div>
                }
              />

            </Route>

            <Route
              path="/products"
              element={
                <div>
                  Products page
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
          "Products page"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "redirects authenticated users to products",
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
            "/login",
          ]}
        >
          <Routes>

            <Route
              element={
                <PublicRoute />
              }
            >

              <Route
                path="/login"
                element={
                  <div>
                    Login page
                  </div>
                }
              />

            </Route>

            <Route
              path="/products"
              element={
                <div>
                  Products page
                </div>
              }
            />

          </Routes>
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Products page"
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