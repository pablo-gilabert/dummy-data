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

import CartItem from "./CartItem"

import {
  useCart,
} from "../../store/useCart"

vi.mock(
  "../../store/useCart",
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

import Swal from "sweetalert2"

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
  price: 999,
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

const mockCartItem = {
  product: mockProduct,
  quantity: 2,
}

describe(
  "CartItem",
  () => {

    beforeEach(() => {

      vi.clearAllMocks()

      mockedUseCart
        .mockReturnValue({
          items: [],
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

    const renderCartItem = () => {

      return render(

        <MemoryRouter>

          <CartItem
            item={mockCartItem}
          />

        </MemoryRouter>
      )
    }

    it(
      "renders the product information",
      () => {

        renderCartItem()

        expect(
          screen.getByText(
            "Test product"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "$ 999.00"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "renders the product image",
      () => {

        renderCartItem()

        expect(
          screen.getByRole(
            "img",
            {
              name: "Test product",
            }
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "renders the current quantity",
      () => {

        renderCartItem()

        expect(
          screen.getByText(
            "2"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "calls removeItem when the decrease button is clicked",
      async () => {

        const user =
          userEvent.setup()

        const removeItem =
          vi.fn()

        mockedUseCart
          .mockReturnValue({
            items: [],
            addItem: vi.fn(),
            removeItem,
            clearItem: vi.fn(),
            clearCart: vi.fn(),
          })

        renderCartItem()

        const decreaseButton =
          screen.getByRole(
            "button",
            {
              name:
                "Decrease quantity of Test product",
            }
          )

        await user.click(
          decreaseButton
        )

        expect(
          removeItem
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          removeItem
        ).toHaveBeenCalledWith(
          1
        )

      }
    )

    it(
      "calls addItem when the increase button is clicked",
      async () => {

        const user =
          userEvent.setup()

        const addItem =
          vi.fn()

        mockedUseCart
          .mockReturnValue({
            items: [],
            addItem,
            removeItem: vi.fn(),
            clearItem: vi.fn(),
            clearCart: vi.fn(),
          })

        renderCartItem()

        const increaseButton =
          screen.getByRole(
            "button",
            {
              name:
                "Increase quantity of Test product",
            }
          )

        await user.click(
          increaseButton
        )

        expect(
          addItem
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          addItem
        ).toHaveBeenCalledWith(
          mockProduct
        )

      }
    )

    it(
      "opens the remove confirmation",
      async () => {

        const user =
          userEvent.setup()

        renderCartItem()

        const removeButton =
          screen.getByRole(
            "button",
            {
              name: "Remove",
            }
          )

        await user.click(
          removeButton
        )

        expect(
          mockedSwalFire
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            title:
              "Remove product?",
            text:
              '"Test product" will be removed from your cart.',
            icon:
              "warning",
            showCancelButton:
              true,
            confirmButtonText:
              "Remove",
            cancelButtonText:
              "Cancel",
          })
        )

      }
    )

    it(
      "clears the item when removal is confirmed",
      async () => {

        const user =
          userEvent.setup()

        const clearItem =
          vi.fn()

        mockedUseCart
          .mockReturnValue({
            items: [],
            addItem: vi.fn(),
            removeItem: vi.fn(),
            clearItem,
            clearCart: vi.fn(),
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

        renderCartItem()

        const removeButton =
          screen.getByRole(
            "button",
            {
              name: "Remove",
            }
          )

        await user.click(
          removeButton
        )

        expect(
          clearItem
        ).toHaveBeenCalledTimes(
          1
        )

        expect(
          clearItem
        ).toHaveBeenCalledWith(
          1
        )

        expect(
          mockedSwalFire
        ).toHaveBeenCalledTimes(
          2
        )

      }
    )

  }
)