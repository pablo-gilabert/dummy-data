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

import Cart from "./Cart"

import {
  useCart,
} from "../../store/useCart"

import type { Product } from "../../types/Product"

vi.mock(
  "../../store/useCart",
  () => ({
    useCart: vi.fn(),
  })
)

vi.mock(
  "../../components/CartItem/CartItem",
  () => ({
    default: ({
      item,
    }: {
      item: {
        product: Product
      }
    }) => (
      <div>
        Cart item: {item.product.title}
      </div>
    ),
  })
)

vi.mock(
  "../../components/CartSummary/CartSummary",
  () => ({
    default: () => (
      <div>
        Cart summary
      </div>
    ),
  })
)

const mockedUseCart =
  vi.mocked(useCart)

const mockProduct: Product = {
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

const mockProductTwo: Product = {
  ...mockProduct,
  id: 2,
  title: "Phone",
  category: "smartphones",
  price: 599,
  sku: "PHONE-001",
  thumbnail:
    "https://example.com/phone.jpg",
  images: [
    "https://example.com/phone.jpg",
  ],
}

const defaultCart = {
  items: [],
  addItem: vi.fn(),
  removeItem: vi.fn(),
  clearItem: vi.fn(),
  clearCart: vi.fn(),
}

describe("Cart", () => {

  it(
    "renders the cart title",
    () => {

      mockedUseCart.mockReturnValue(
        defaultCart
      )

      render(
        <Cart />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Cart",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows the empty message when the cart is empty",
    () => {

      mockedUseCart.mockReturnValue({
        ...defaultCart,
        items: [],
      })

      render(
        <Cart />
      )

      expect(
        screen.getByText(
          "Your cart is empty."
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "Cart summary"
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "renders cart items when the cart has products",
    () => {

      mockedUseCart.mockReturnValue({
        ...defaultCart,
        items: [
          {
            product:
              mockProduct,
            quantity: 2,
          },
          {
            product:
              mockProductTwo,
            quantity: 1,
          },
        ],
      })

      render(
        <Cart />
      )

      expect(
        screen.getByText(
          "Cart item: Laptop"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Cart item: Phone"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders the cart summary when the cart has products",
    () => {

      mockedUseCart.mockReturnValue({
        ...defaultCart,
        items: [
          {
            product:
              mockProduct,
            quantity: 2,
          },
        ],
      })

      render(
        <Cart />
      )

      expect(
        screen.getByText(
          "Cart summary"
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          "Your cart is empty."
        )
      ).not.toBeInTheDocument()
    }
  )

  it(
    "renders one cart item for each product",
    () => {

      mockedUseCart.mockReturnValue({
        ...defaultCart,
        items: [
          {
            product:
              mockProduct,
            quantity: 2,
          },
          {
            product:
              mockProductTwo,
            quantity: 1,
          },
        ],
      })

      render(
        <Cart />
      )

      expect(
        screen.getAllByText(
          /Cart item:/
        )
      ).toHaveLength(2)
    }
  )
})