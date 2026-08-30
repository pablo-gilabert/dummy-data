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
} from "react-router-dom"

import CartSummary from "./CartSummary"

import {
  useCart,
} from "../../CartContext/useCart"

import Swal from "sweetalert2"

vi.mock(
  "../../CartContext/useCart",
  () => ({
    useCart: vi.fn(),
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

const mockedSwalFire =
  vi.mocked(Swal.fire)

const mockProduct = {
  id: 1,
  title: "Test product",
  description:
    "Test product description",
  category: "laptops",
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
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
    "1 year warranty",

  shippingInformation:
    "Ships in 3 days",

  availabilityStatus:
    "In Stock",

  reviews: [],

  returnPolicy:
    "30 days return policy",

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

const mockItems = [
  {
    product: mockProduct,
    quantity: 2,
  },
]

const renderCartSummary = () => {

  return render(

    <MemoryRouter>

      <CartSummary />

    </MemoryRouter>
  )
}

describe(
  "CartSummary",
  () => {

    beforeEach(() => {

      vi.clearAllMocks()

      mockedUseCart
        .mockReturnValue({
          items: mockItems,
          addItem: vi.fn(),
          removeItem: vi.fn(),
          clearItem: vi.fn(),
          clearCart: vi.fn(),
        })

      mockedSwalFire
        .mockResolvedValue({
          isConfirmed: false,
          isDenied: false,
          isDismissed: true,
          value: undefined,
        })
    })

    it(
      "renders the order summary",
      () => {

        renderCartSummary()

        expect(
          screen.getByText(
            "Order summary"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Subtotal"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Shipping"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Total"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Free"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "calculates the subtotal correctly",
      () => {

        renderCartSummary()

        expect(
          screen.getAllByText(
            "$ 200.00"
          )
        ).toHaveLength(2)

      }
    )

    it(
      "enables checkout when the cart has items",
      () => {

        renderCartSummary()

        expect(
          screen.getByRole(
            "button",
            {
              name: "Checkout",
            }
          )
        ).toBeEnabled()

      }
    )

    it(
      "navigates to checkout",
      async () => {

        const user =
          userEvent.setup()

        render(

          <MemoryRouter
            initialEntries={[
              "/cart",
            ]}
          >

            <CartSummary />

          </MemoryRouter>
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Checkout",
            }
          )
        )

        expect(
          screen.getByRole(
            "button",
            {
              name: "Checkout",
            }
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "opens the clear cart confirmation",
      async () => {

        const user =
          userEvent.setup()

        renderCartSummary()

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Clear cart",
            }
          )
        )

        expect(
          mockedSwalFire
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            title:
              "Clear cart?",

            text:
              "All products will be removed from your cart.",

            icon:
              "warning",

            showCancelButton:
              true,

            confirmButtonText:
              "Clear cart",

            cancelButtonText:
              "Cancel",
          })
        )

      }
    )

    it(
      "clears the cart when removal is confirmed",
      async () => {

        const user =
          userEvent.setup()

        const clearCart =
          vi.fn()

        mockedUseCart
          .mockReturnValue({
            items: mockItems,
            addItem: vi.fn(),
            removeItem: vi.fn(),
            clearItem: vi.fn(),
            clearCart,
          })

        mockedSwalFire
          .mockResolvedValueOnce({
            isConfirmed: true,
            isDenied: false,
            isDismissed: false,
            value: undefined,
          })

          .mockResolvedValueOnce({
            isConfirmed: true,
            isDenied: false,
            isDismissed: false,
            value: undefined,
          })

        renderCartSummary()

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Clear cart",
            }
          )
        )

        expect(
          clearCart
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          mockedSwalFire
        ).toHaveBeenCalledTimes(
          2
        )

      }
    )

    it(
      "disables checkout and clear cart when the cart is empty",
      () => {

        mockedUseCart
          .mockReturnValue({
            items: [],
            addItem: vi.fn(),
            removeItem: vi.fn(),
            clearItem: vi.fn(),
            clearCart: vi.fn(),
          })

        renderCartSummary()

        expect(
          screen.getByRole(
            "button",
            {
              name: "Checkout",
            }
          )
        ).toBeDisabled()

        expect(
          screen.getByRole(
            "button",
            {
              name: "Clear cart",
            }
          )
        ).toBeDisabled()

      }
    )

    it(
      "does not open the clear confirmation when the cart is empty",
      () => {

        mockedUseCart
          .mockReturnValue({
            items: [],
            addItem: vi.fn(),
            removeItem: vi.fn(),
            clearItem: vi.fn(),
            clearCart: vi.fn(),
          })

        renderCartSummary()

        const clearButton =
          screen.getByRole(
            "button",
            {
              name: "Clear cart",
            }
          )

        expect(
          clearButton
        ).toBeDisabled()

        expect(
          mockedSwalFire
        ).not.toHaveBeenCalled()

      }
    )

  }
)