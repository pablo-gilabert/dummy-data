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

import Checkout from "./Checkout"

import {
  useCart,
} from "../../CartContext/useCart"

import {
  useAuth,
} from "../../AuthContext/useAuth"

import {
  saveOrder,
} from "../../services/orderStorage"

import Swal from "sweetalert2"

vi.mock(
  "../../CartContext/useCart",
  () => ({
    useCart: vi.fn(),
  })
)

vi.mock(
  "../../AuthContext/useAuth",
  () => ({
    useAuth: vi.fn(),
  })
)

vi.mock(
  "../../services/orderStorage",
  () => ({
    saveOrder: vi.fn(),
  })
)

vi.mock(
  "sweetalert2",
  () => ({
    default: {
      fire: vi.fn(),
    },
  })
)

const mockedUseCart =
  vi.mocked(useCart)

const mockedUseAuth =
  vi.mocked(useAuth)

const mockedSaveOrder =
  vi.mocked(saveOrder)

const mockedSwalFire =
  vi.mocked(Swal.fire)

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

const mockProduct = {
  id: 1,
  title: "Laptop",
  description:
    "A powerful laptop.",
  category: "laptops",
  price: 999,
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  tags: [],
  brand: "Tech Brand",
  sku: "LAPTOP-001",
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
    barcode: "123456789",
    qrCode:
      "https://example.com/qr",
  },
  thumbnail:
    "https://example.com/laptop.jpg",
  images: [
    "https://example.com/laptop.jpg",
  ],
}

const mockItems = [
  {
    product: mockProduct,
    quantity: 2,
  },
]

const defaultCart = {
  items: mockItems,
  addItem: vi.fn(),
  removeItem: vi.fn(),
  clearItem: vi.fn(),
  clearCart: vi.fn(),
}

const defaultAuth = {
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
}

const renderCheckout = () => {

  return render(
    <Checkout />
  )
}

describe("Checkout", () => {

  beforeEach(() => {

    vi.clearAllMocks()

    mockedUseCart.mockReturnValue(
      defaultCart
    )

    mockedUseAuth.mockReturnValue(
      defaultAuth
    )

    mockedSwalFire.mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    } as never)
  })

  it(
    "renders the checkout form",
    () => {

      renderCheckout()

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Checkout",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText(
          "Full name"
        )
      ).toHaveValue(
        "Emily Johnson"
      )

      expect(
        screen.getByLabelText(
          "Email"
        )
      ).toHaveValue(
        "emily@example.com"
      )

      expect(
        screen.getByLabelText(
          "Phone"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText(
          "Address"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText(
          "City"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders the order summary",
    () => {

      renderCheckout()

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

      expect(
        screen.getByText(
          "$ 1998.00"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows validation errors when the form is empty",
    async () => {

      const user =
        userEvent.setup()

      renderCheckout()

      await user.clear(
        screen.getByLabelText(
          "Full name"
        )
      )

      await user.clear(
        screen.getByLabelText(
          "Email"
        )
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      expect(
        screen.getByText(
          "Please enter your full name."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Please enter your email."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Please enter your phone number."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Please enter your address."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Please enter your city."
        )
      ).toBeInTheDocument()

      expect(
        mockedSaveOrder
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "shows an error for an invalid email",
    async () => {

      const user =
        userEvent.setup()

      renderCheckout()

      await user.clear(
        screen.getByLabelText(
          "Email"
        )
      )

      await user.type(
        screen.getByLabelText(
          "Email"
        ),
        "invalid-email"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      expect(
        screen.getByText(
          "Please enter a valid email."
        )
      ).toBeInTheDocument()

      expect(
        mockedSaveOrder
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "clears the validation error when the user changes a field",
    async () => {

      const user =
        userEvent.setup()

      renderCheckout()

      await user.clear(
        screen.getByLabelText(
          "Full name"
        )
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      expect(
        screen.getByText(
          "Please enter your full name."
        )
      ).toBeInTheDocument()

      await user.type(
        screen.getByLabelText(
          "Full name"
        ),
        "John Doe"
      )

      expect(
        screen.queryByText(
          "Please enter your full name."
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "redirects to login when there is no authenticated user",
    async () => {

      const user =
        userEvent.setup()

      mockedUseAuth.mockReturnValue({
        ...defaultAuth,
        user: null,
        isLoading: false,
      })

      renderCheckout()

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/login",
        {
          replace: true,
        }
      )
    }
  )

  it(
    "shows insufficient stock warning",
    async () => {

      const user =
        userEvent.setup()

      mockedUseCart.mockReturnValue({
        ...defaultCart,

        items: [
          {
            product: {
              ...mockProduct,
              stock: 1,
            },
            quantity: 2,
          },
        ],
      })

      renderCheckout()

      await user.type(
        screen.getByLabelText(
          "Phone"
        ),
        "123456789"
      )

      await user.type(
        screen.getByLabelText(
          "Address"
        ),
        "Main Street 123"
      )

      await user.type(
        screen.getByLabelText(
          "City"
        ),
        "Buenos Aires"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      expect(
        mockedSwalFire
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          title:
            "Insufficient stock",
          icon:
            "warning",
        })
      )

      expect(
        mockedSaveOrder
      ).not.toHaveBeenCalled()
    }
  )

  it(
    "does not place the order when confirmation is cancelled",
    async () => {

      const user =
        userEvent.setup()

      mockedSwalFire.mockResolvedValueOnce({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      } as never)

      renderCheckout()

      await user.type(
        screen.getByLabelText(
          "Phone"
        ),
        "123456789"
      )

      await user.type(
        screen.getByLabelText(
          "Address"
        ),
        "Main Street 123"
      )

      await user.type(
        screen.getByLabelText(
          "City"
        ),
        "Buenos Aires"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      expect(
        mockedSwalFire
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          title:
            "Place order?",
        })
      )

      expect(
        mockedSaveOrder
      ).not.toHaveBeenCalled()

      expect(
        defaultCart.clearCart
      ).not.toHaveBeenCalled()

      expect(
        mockedNavigate
      ).not.toHaveBeenCalledWith(
        "/order-confirmation",
        expect.anything()
      )
    }
  )

  it(
    "places the order successfully",
    async () => {

      const user =
        userEvent.setup()

      renderCheckout()

      await user.type(
        screen.getByLabelText(
          "Phone"
        ),
        "123456789"
      )

      await user.type(
        screen.getByLabelText(
          "Address"
        ),
        "Main Street 123"
      )

      await user.type(
        screen.getByLabelText(
          "City"
        ),
        "Buenos Aires"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedSaveOrder
        ).toHaveBeenCalledTimes(1)

      })

      expect(
        mockedSaveOrder
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          total: 1998,

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

          items: mockItems,
        })
      )

      expect(
        defaultCart.clearCart
      ).toHaveBeenCalledTimes(1)

      expect(
        localStorage.getItem(
          "lastOrderId"
        )
      ).toBeTruthy()

      expect(
        mockedSwalFire
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          title:
            "Order placed!",
          icon:
            "success",
        })
      )

      await waitFor(() => {

        expect(
          mockedNavigate
        ).toHaveBeenCalledWith(
          "/order-confirmation",
          {
            replace: true,
          }
        )

      })
    }
  )

  it(
    "redirects to cart when the cart is empty",
    () => {

      mockedUseCart.mockReturnValue({
        ...defaultCart,
        items: [],
      })

      renderCheckout()

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/cart",
        {
          replace: true,
        }
      )
    }
  )

  it(
    "does not show checkout content when the cart is empty",
    () => {

      mockedUseCart.mockReturnValue({
        ...defaultCart,
        items: [],
      })

      renderCheckout()

      expect(
        screen.queryByRole(
          "heading",
          {
            name: "Checkout",
          }
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "handles order storage errors",
    async () => {

      const user =
        userEvent.setup()

      mockedSaveOrder.mockImplementation(
        () => {
          throw new Error(
            "Storage error"
          )
        }
      )

      renderCheckout()

      await user.type(
        screen.getByLabelText(
          "Phone"
        ),
        "123456789"
      )

      await user.type(
        screen.getByLabelText(
          "Address"
        ),
        "Main Street 123"
      )

      await user.type(
        screen.getByLabelText(
          "City"
        ),
        "Buenos Aires"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Place order",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedSwalFire
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            title:
              "Something went wrong",

            icon:
              "error",
          })
        )

      })

      expect(
        mockedNavigate
      ).not.toHaveBeenCalledWith(
        "/order-confirmation",
        expect.anything()
      )
    }
  )
})