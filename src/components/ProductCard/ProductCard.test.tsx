import {
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import {
  MemoryRouter,
} from "react-router-dom"

import ProductCard from "./ProductCard"

import type {
  Product,
} from "../../types/Product"

const mockProduct: Product = {
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
    barcode: "123456789",
    qrCode: "test-qr-code",
  },
  thumbnail:
    "https://example.com/laptop.jpg",
  images: [
    "https://example.com/laptop.jpg",
  ],
}

describe("ProductCard", () => {

  it(
    "renders the product information",
    () => {

      render(
        <MemoryRouter>
          <ProductCard
            product={mockProduct}
          />
        </MemoryRouter>
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Laptops",
            level: 1,
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Test product",
            level: 2,
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "4.5"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "$ 999"
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
            name: "Test product",
          }
        )
      ).toHaveAttribute(
        "src",
        mockProduct.thumbnail
      )
    }
  )

  it(
    "links to the product details page",
    () => {

      render(
        <MemoryRouter
          initialEntries={[
            "/products?category=laptops&page=2",
          ]}
        >
          <ProductCard
            product={mockProduct}
          />
        </MemoryRouter>
      )

      const link =
        screen.getByRole(
          "link"
        )

      expect(
        link
      ).toHaveAttribute(
        "href",
        "/products/1"
      )
    }
  )

  it(
    "passes the current location as navigation state",
    () => {

      render(
        <MemoryRouter
          initialEntries={[
            "/products?category=laptops&page=2",
          ]}
        >
          <ProductCard
            product={mockProduct}
          />
        </MemoryRouter>
      )

      const link =
        screen.getByRole(
          "link"
        )

      expect(
        link
      ).toHaveAttribute(
        "href",
        "/products/1"
      )
    }
  )
})