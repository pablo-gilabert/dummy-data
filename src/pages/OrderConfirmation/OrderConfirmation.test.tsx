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

import OrderConfirmation from "./OrderConfirmation"

import {
  useAuth,
} from "../../AuthContext/useAuth"

import {
  getOrders,
} from "../../services/orderStorage"

vi.mock(
  "../../AuthContext/useAuth",
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

const mockedUseAuth =
  vi.mocked(useAuth)

const mockedGetOrders =
  vi.mocked(getOrders)

const mockedNavigate =
  vi.fn()

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

const mockOrder = {
  id: "order-123",
  userId: 1,
  createdAt:
    "2025-01-15T12:00:00.000Z",

  customer: {
    name:
      "Emily Johnson",
    email:
      "emily@example.com",
    phone:
      "123456789",
    address:
      "Main Street 123",
    city:
      "Buenos Aires",
  },

  items: [
    {
      product: {
        id: 1,
        title: "Laptop",
        description:
          "A powerful laptop.",
        category:
          "laptops",
        price: 999,
        discountPercentage: 10,
        rating: 4.5,
        stock: 10,
        tags: [],
        brand:
          "Tech Brand",
        sku:
          "LAPTOP-001",
        weight: 2,
        dimensions: {
          width: 30,
          height: 2,
          depth: 20,
        },
        warrantyInformation:
          "1 year warranty",
        shippingInformation:
          "Ships in 2 days",
        availabilityStatus:
          "In Stock",
        reviews: [],
        returnPolicy:
          "30 days return policy",
        minimumOrderQuantity: 1,
        meta: {
          createdAt:
            "2025-01-01T00:00:00.000Z",
          updatedAt:
            "2025-01-01T00:00:00.000Z",
          barcode:
            "123456789",
          qrCode:
            "https://example.com/qr",
        },
        thumbnail:
          "https://example.com/laptop.jpg",
        images: [
          "https://example.com/laptop.jpg",
        ],
      },

      quantity: 2,
    },
  ],

  total: 1998,
}

describe("OrderConfirmation", () => {

  beforeEach(() => {

    vi.clearAllMocks()

    localStorage.clear()

    mockedUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    mockedGetOrders.mockReturnValue([
      mockOrder,
    ])
  })

  it(
    "renders the order confirmation",
    () => {

      localStorage.setItem(
        "lastOrderId",
        "order-123"
      )

      render(
        <OrderConfirmation />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name:
              "Order placed successfully!",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Thank you for your purchase, Emily Johnson."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders the order information",
    () => {

      localStorage.setItem(
        "lastOrderId",
        "order-123"
      )

      render(
        <OrderConfirmation />
      )

      expect(
        screen.getByText(
          "Order ID"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "order-123"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Date"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders the products from the order",
    () => {

      localStorage.setItem(
        "lastOrderId",
        "order-123"
      )

      render(
        <OrderConfirmation />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name:
              "Your order",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Laptop"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          /Quantity:\s*2/
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "$1998.00"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders the total",
    () => {

      localStorage.setItem(
        "lastOrderId",
        "order-123"
      )

      render(
        <OrderConfirmation />
      )

      expect(
        screen.getByText(
          "Total"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "$ 1998.00"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "redirects to orders when there is no last order id",
    () => {

      render(
        <OrderConfirmation />
      )

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/orders",
        {
          replace: true,
        }
      )

      expect(
        screen.queryByRole(
          "heading",
          {
            name:
              "Order placed successfully!",
          }
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "redirects to orders when the last order cannot be found",
    () => {

      localStorage.setItem(
        "lastOrderId",
        "missing-order"
      )

      mockedGetOrders.mockReturnValue([
        mockOrder,
      ])

      render(
        <OrderConfirmation />
      )

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/orders",
        {
          replace: true,
        }
      )

      expect(
        screen.queryByText(
          "Order placed successfully!"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "redirects to orders when there is no authenticated user",
    () => {

      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <OrderConfirmation />
      )

      expect(
        mockedGetOrders
      ).not.toHaveBeenCalled()

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/orders",
        {
          replace: true,
        }
      )
    }
  )

  it(
    "navigates to products when continuing shopping",
    async () => {

      const user =
        userEvent.setup()

      localStorage.setItem(
        "lastOrderId",
        "order-123"
      )

      render(
        <OrderConfirmation />
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name:
              "Continue shopping",
          }
        )
      )

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/products"
      )
    }
  )
})