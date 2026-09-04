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

import userEvent from "@testing-library/user-event"

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom"

import OrderDetail from "./OrderDetail"

import type {
  Order,
} from "../../types/Order"

vi.mock(
  "../../store/useAuth",
  () => ({
    useAuth: vi.fn(),
  })
)

vi.mock(
  "../../services/orderStorage",
  () => ({
    getOrders: vi.fn(),
  })
)

import {
  useAuth,
} from "../../store/useAuth"

import {
  getOrders,
} from "../../services/orderStorage"

const mockedUseAuth =
  vi.mocked(useAuth)

const mockedGetOrders =
  vi.mocked(getOrders)

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

const mockOrder: Order = {
  id: "order-123",
  userId: 1,
  createdAt:
    "2026-08-20T12:00:00.000Z",

  customer: {
    name: "Emily Johnson",
    email: "emily@example.com",
    phone: "123456789",
    address: "Main Street 123",
    city: "Buenos Aires",
  },

  items: [
    {
      product: {
        id: 1,
        title: "Test product",
        description:
          "Test product description",
        category: "test-category",
        price: 25,
        discountPercentage: 0,
        rating: 5,
        stock: 10,
        tags: [
          "test",
        ],
        sku: "TEST-001",
        weight: 1,

        dimensions: {
          width: 10,
          height: 10,
          depth: 10,
        },

        warrantyInformation:
          "1 year warranty",

        shippingInformation:
          "Ships within 3 days",

        availabilityStatus:
          "In Stock",

        reviews: [],

        returnPolicy:
          "30 days",

        minimumOrderQuantity: 1,

        meta: {
          createdAt:
            "2026-01-01T00:00:00.000Z",
          updatedAt:
            "2026-01-01T00:00:00.000Z",
          barcode: "123456789",
          qrCode:
            "https://example.com/qr",
        },

        images: [
          "https://example.com/product.jpg",
        ],

        thumbnail:
          "https://example.com/product.jpg",
      },

      quantity: 2,
    },
  ],

  total: 50,
}

describe("OrderDetail", () => {

  it(
    "shows the order details when the order exists",
    () => {

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      mockedGetOrders.mockReturnValue([
        mockOrder,
      ])

      render(
        <MemoryRouter
          initialEntries={[
            "/orders/order-123",
          ]}
        >
          <Routes>

            <Route
              path="/orders/:orderId"
              element={
                <OrderDetail />
              }
            />

          </Routes>
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Order #order-123"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Emily Johnson"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "emily@example.com"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "123456789"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Main Street 123"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Buenos Aires"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Test product"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Quantity: 2"
        )
      ).toBeInTheDocument()

      expect(
        screen.getAllByText(
          "$50.00"
        ).length
      ).toBeGreaterThan(0)
    }
  )

  it(
    "shows order not found when the order does not exist",
    () => {

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      mockedGetOrders.mockReturnValue([])

      render(
        <MemoryRouter
          initialEntries={[
            "/orders/does-not-exist",
          ]}
        >
          <Routes>

            <Route
              path="/orders/:orderId"
              element={
                <OrderDetail />
              }
            />

          </Routes>
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Order not found"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "The order you are looking for does not exist."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Back to orders",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates back to orders",
    async () => {

      const user =
        userEvent.setup()

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      mockedGetOrders.mockReturnValue([
        mockOrder,
      ])

      render(
        <MemoryRouter
          initialEntries={[
            "/orders/order-123",
          ]}
        >
          <Routes>

            <Route
              path="/orders/:orderId"
              element={
                <OrderDetail />
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
            name: /Back to orders/i,
          }
        )
      )

      expect(
        screen.getByText(
          "Orders page"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates back to orders when the order does not exist",
    async () => {

      const user =
        userEvent.setup()

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      mockedGetOrders.mockReturnValue([])

      render(
        <MemoryRouter
          initialEntries={[
            "/orders/does-not-exist",
          ]}
        >
          <Routes>

            <Route
              path="/orders/:orderId"
              element={
                <OrderDetail />
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
            name: "Back to orders",
          }
        )
      )

      expect(
        screen.getByText(
          "Orders page"
        )
      ).toBeInTheDocument()
    }
  )
})