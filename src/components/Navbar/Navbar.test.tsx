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
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom"

import Navbar from "./Navbar"

import type {
  Product,
} from "../../types/Product"

vi.mock(
  "../../store/useCart",
  () => ({
    useCart: vi.fn(),
  })
)

vi.mock(
  "../../store/useAuth",
  () => ({
    useAuth: vi.fn(),
  })
)

import {
  useCart,
} from "../../store/useCart"

import {
  useAuth,
} from "../../store/useAuth"

const mockedUseCart =
  vi.mocked(useCart)

const mockedUseAuth =
  vi.mocked(useAuth)

const mockLogout =
  vi.fn()

const mockedNavigate =
  vi.fn()

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

const mockProduct: Product = {
  id: 1,
  title: "Test product",
  description:
    "Test product description",
  category: "test-category",
  price: 10,
  discountPercentage: 0,
  rating: 5,
  stock: 10,
  tags: [],
  brand: "Test brand",
  sku: "TEST-001",
  weight: 1,

  dimensions: {
    width: 10,
    height: 10,
    depth: 10,
  },

  warrantyInformation:
    "Test warranty",

  shippingInformation:
    "Test shipping",

  availabilityStatus:
    "In Stock",

  reviews: [],

  returnPolicy:
    "Test return policy",

  minimumOrderQuantity: 1,

  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",
    updatedAt:
      "2026-01-01T00:00:00.000Z",
    barcode:
      "123456789",
    qrCode:
      "test-qr-code",
  },

  thumbnail:
    "https://example.com/product.jpg",

  images: [
    "https://example.com/product.jpg",
  ],
}

const mockCartItems = [
  {
    product: mockProduct,
    quantity: 2,
  },
]

vi.mock(
  "react-router-dom",
  async () => {

    const actual =
      await vi.importActual<
        typeof import(
          "react-router-dom"
        )
      >(
        "react-router-dom"
      )

    return {
      ...actual,

      useNavigate: () =>
        mockedNavigate,
    }
  }
)

describe("Navbar", () => {

  beforeEach(() => {

    vi.clearAllMocks()

    mockedUseCart.mockReturnValue({
      items: mockCartItems,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      clearItem: vi.fn(),
      clearCart: vi.fn(),
    })

    mockedUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: vi.fn(),
      logout: mockLogout,
    })
  })

  it(
    "renders the navigation links and user",
    () => {

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Dummy Data"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Emily"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Home"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Products"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Orders"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Logout"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows the total number of cart items",
    () => {

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "2"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText(
          "Shopping cart with 2 items"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "does not show the cart count when the cart is empty",
    () => {

      mockedUseCart.mockReturnValue({
        items: [],
        addItem: vi.fn(),
        removeItem: vi.fn(),
        clearItem: vi.fn(),
        clearCart: vi.fn(),
      })

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      )

      expect(
        screen.getByLabelText(
          "Shopping cart with 0 items"
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "0"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "opens and closes the menu",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      )

      const menuButton =
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )

      expect(
        menuButton
      ).toHaveAttribute(
        "aria-expanded",
        "false"
      )

      await user.click(
        menuButton
      )

      expect(
        screen.getByRole(
          "button",
          {
            name: "Close menu",
          }
        )
      ).toHaveAttribute(
        "aria-expanded",
        "true"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Close menu",
          }
        )
      )

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toHaveAttribute(
        "aria-expanded",
        "false"
      )
    }
  )

  it(
    "closes the menu when clicking outside the navbar",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter>
          <Navbar />

          <div data-testid="outside">
            Outside
          </div>
        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      expect(
        screen.getByRole(
          "button",
          {
            name: "Close menu",
          }
        )
      ).toBeInTheDocument()

      await user.click(
        screen.getByTestId(
          "outside"
        )
      )

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "closes the menu after navigating to another route",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter
          initialEntries={[
            "/",
          ]}
        >

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <div>
                  Home page
                </div>
              }
            />

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

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Products",
          }
        )
      )

      expect(
        screen.getByText(
          "Products page"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates to the cart and closes the menu",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter
          initialEntries={[
            "/",
          ]}
        >

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <div>
                  Home page
                </div>
              }
            />

            <Route
              path="/cart"
              element={
                <div>
                  Cart page
                </div>
              }
            />

          </Routes>

        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Shopping cart with 2 items",
          }
        )
      )

      expect(
        screen.getByText(
          "Cart page"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "scrolls to the top when navigating to the current route",
    async () => {

      const user =
        userEvent.setup()

      const scrollTo =
        vi.fn()

      vi.stubGlobal(
        "scrollTo",
        scrollTo
      )

      render(
        <MemoryRouter
          initialEntries={[
            "/products",
          ]}
        >

          <Navbar />

          <Routes>

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

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Products",
          }
        )
      )

      expect(
        scrollTo
      ).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      })
    }
  )

  it(
    "scrolls to the top when clicking the logo on the current route",
    async () => {

      const user =
        userEvent.setup()

      const scrollTo =
        vi.fn()

      vi.stubGlobal(
        "scrollTo",
        scrollTo
      )

      render(
        <MemoryRouter
          initialEntries={[
            "/",
          ]}
        >

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <div>
                  Home page
                </div>
              }
            />

          </Routes>

        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Dummy Data",
          }
        )
      )

      expect(
        scrollTo
      ).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      })
    }
  )

  it(
    "logs out and navigates to login",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Logout",
          }
        )
      )

      expect(
        mockLogout
      ).toHaveBeenCalledTimes(1)

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/login",
        {
          replace: true,
        }
      )

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows Login instead of Orders and Logout when there is no user",
    () => {

      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: mockLogout,
      })

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Login"
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "Orders"
        )
      ).not.toBeInTheDocument()

      expect(
        screen.queryByText(
          "Logout"
        )
      ).not.toBeInTheDocument()

      expect(
        screen.queryByText(
          "Emily"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "navigates to login and closes the menu when there is no user",
    async () => {

      const user =
        userEvent.setup()

      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: mockLogout,
      })

      render(
        <MemoryRouter
          initialEntries={[
            "/",
          ]}
        >

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <div>
                  Home page
                </div>
              }
            />

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

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Login",
          }
        )
      )

      expect(
        screen.getByText(
          "Login page"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates to Orders and closes the menu",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter
          initialEntries={[
            "/",
          ]}
        >

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <div>
                  Home page
                </div>
              }
            />

            <Route
              path="/orders"
              element={
                <div>
                  Orders page
                </div>
              }
            />

          </Routes>

        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Orders",
          }
        )
      )

      expect(
        screen.getByText(
          "Orders page"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates to Home and closes the menu",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter
          initialEntries={[
            "/products",
          ]}
        >

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <div>
                  Home page
                </div>
              }
            />

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

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      )

      await user.click(
        screen.getByRole(
          "link",
          {
            name: "Home",
          }
        )
      )

      expect(
        screen.getByText(
          "Home page"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Open menu",
          }
        )
      ).toBeInTheDocument()
    }
  )
})