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

import Orders from "./Orders"

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

beforeEach(() => {
  vi.clearAllMocks()
})

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
        brand: "Test",
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

          barcode:
            "123456789",

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

describe("Orders", () => {

  it(
    "shows an empty state when the user has no orders",
    () => {

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      mockedGetOrders.mockReturnValue([])

      render(
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "No orders yet"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Your completed orders will appear here."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Start shopping",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows an empty state when there is no authenticated user",
    () => {

      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      )

      expect(
        mockedGetOrders
      ).not.toHaveBeenCalled()

      expect(
        screen.getByText(
          "No orders yet"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Your completed orders will appear here."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Start shopping",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "displays the user's orders",
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
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "Order #order-123"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "$50.00"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "2 items"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "displays singular item when an order has one item",
    () => {

      mockedUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      const singleItemOrder: Order = {
        ...mockOrder,

        items: [
          {
            ...mockOrder.items[0],
            quantity: 1,
          },
        ],

        total: 25,
      }

      mockedGetOrders.mockReturnValue([
        singleItemOrder,
      ])

      render(
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "1 item"
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "1 items"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "navigates to the order detail",
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
            "/orders",
          ]}
        >
          <Routes>

            <Route
              path="/orders"
              element={
                <Orders />
              }
            />

            <Route
              path="/orders/:orderId"
              element={
                <div>
                  Order detail page
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
            name: "View order",
          }
        )
      )

      expect(
        screen.getByText(
          "Order detail page"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates to products from the empty state",
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
            "/orders",
          ]}
        >
          <Routes>

            <Route
              path="/orders"
              element={
                <Orders />
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
            name: "Start shopping",
          }
        )
      )

      expect(
        screen.getByText(
          "Products page"
        )
      ).toBeInTheDocument()
    }
  )
})