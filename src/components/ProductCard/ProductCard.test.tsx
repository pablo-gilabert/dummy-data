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
} from "react-router-dom"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import ProductCard from "./ProductCard"

import type {
  Product,
} from "../../types/Product"

const mockProduct: Product = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 7.17,
  rating: 4.94,
  stock: 5,
  tags: [
    "beauty",
    "mascara",
  ],
  brand: "Essence",
  sku: "BEA-ESS-MAS-001",
  weight: 2,
  dimensions: {
    width: 23.17,
    height: 14.43,
    depth: 28.01,
  },
  warrantyInformation:
    "1 month warranty",
  shippingInformation:
    "Ships in 1 month",
  availabilityStatus:
    "In Stock",
  reviews: [],
  returnPolicy:
    "30 days return policy",
  minimumOrderQuantity: 24,
  meta: {
    createdAt:
      "2025-04-30T09:41:02.053Z",
    updatedAt:
      "2025-04-30T09:41:02.053Z",
    barcode:
      "9164035109868",
    qrCode:
      "https://example.com/qr-code",
  },
  thumbnail:
    "https://example.com/thumbnail.jpg",
  images: [
    "https://example.com/image.jpg",
  ],
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderProductCard = (
  initialEntry = "/products"
) => {

  const queryClient =
    createTestQueryClient()

  return {
    queryClient,

    ...render(

      <QueryClientProvider
        client={queryClient}
      >

        <MemoryRouter
          initialEntries={[
            initialEntry,
          ]}
        >

          <ProductCard
            product={mockProduct}
          />

        </MemoryRouter>

      </QueryClientProvider>
    ),
  }
}

describe("ProductCard", () => {

  it(
    "renders the product information",
    () => {

      renderProductCard()

      expect(
        screen.getByText(
          "Essence Mascara Lash Princess"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Beauty"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "4.94"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "$ 9.99"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "See details..."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "img",
          {
            name:
              "Essence Mascara Lash Princess",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "links to the product details page",
    () => {

      renderProductCard()

      const link =
        screen.getByRole(
          "link"
        )

      expect(link).toHaveAttribute(
        "href",
        "/products/1"
      )
    }
  )

  it(
    "passes the current location as navigation state",
    () => {

      renderProductCard(
        "/products?search=phone&page=2"
      )

      const link =
        screen.getByRole(
          "link"
        )

      expect(link).toHaveAttribute(
        "href",
        "/products/1"
      )
    }
  )

  it(
    "prefetches the product details on mouse enter",
    async () => {

      const user =
        userEvent.setup()

      const {
        queryClient,
      } = renderProductCard()

      const prefetchQuery =
        vi.spyOn(
          queryClient,
          "prefetchQuery"
        )

      const link =
        screen.getByRole(
          "link"
        )

      await user.hover(
        link
      )

      expect(
        prefetchQuery
      ).toHaveBeenCalledTimes(1)

      expect(
        prefetchQuery
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: [
            "products",
            "detail",
            1,
          ],
        })
      )
    }
  )
})