import {
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import ProductGallery from "./ProductGallery"

import type { Product } from "../../types/Product"

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
    "https://example.com/laptop-thumbnail.jpg",
  images: [
    "https://example.com/laptop-1.jpg",
    "https://example.com/laptop-2.jpg",
    "https://example.com/laptop-3.jpg",
  ],
} satisfies Product

describe(
  "ProductGallery",
  () => {

    it(
      "renders the main product image",
      () => {

        render(
          <ProductGallery
            product={mockProduct}
          />
        )

        const mainImage =
          screen.getByRole(
            "img",
            {
              name: "Laptop",
            }
          )

        expect(
          mainImage
        ).toHaveAttribute(
          "src",
          "https://example.com/laptop-1.jpg"
        )

        expect(
          mainImage
        ).toHaveAttribute(
          "alt",
          "Laptop"
        )
      }
    )

    it(
      "renders thumbnails when the product has multiple images",
      () => {

        render(
          <ProductGallery
            product={mockProduct}
          />
        )

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "View product image 1",
            }
          )
        ).toBeInTheDocument()

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "View product image 2",
            }
          )
        ).toBeInTheDocument()

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "View product image 3",
            }
          )
        ).toBeInTheDocument()
      }
    )

    it(
      "marks the first image as selected initially",
      () => {

        render(
          <ProductGallery
            product={mockProduct}
          />
        )

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "View product image 1",
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "true"
        )

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "View product image 2",
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "false"
        )
      }
    )

    it(
      "changes the main image when a thumbnail is clicked",
      async () => {

        const user =
          userEvent.setup()

        render(
          <ProductGallery
            product={mockProduct}
          />
        )

        const secondThumbnail =
          screen.getByRole(
            "button",
            {
              name:
                "View product image 2",
            }
          )

        await user.click(
          secondThumbnail
        )

        const mainImage =
          screen.getByRole(
            "img",
            {
              name: "Laptop",
            }
          )

        expect(
          mainImage
        ).toHaveAttribute(
          "src",
          "https://example.com/laptop-2.jpg"
        )

        expect(
          secondThumbnail
        ).toHaveAttribute(
          "aria-pressed",
          "true"
        )

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "View product image 1",
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "false"
        )
      }
    )

    it(
      "uses the thumbnail when the product has no images",
      () => {

        const productWithoutImages = {
          ...mockProduct,
          images: [],
        }

        render(
          <ProductGallery
            product={
              productWithoutImages
            }
          />
        )

        const mainImage =
          screen.getByRole(
            "img",
            {
              name: "Laptop",
            }
          )

        expect(
          mainImage
        ).toHaveAttribute(
          "src",
          "https://example.com/laptop-thumbnail.jpg"
        )

        expect(
          screen.queryByRole(
            "button"
          )
        ).not.toBeInTheDocument()
      }
    )

    it(
      "does not render thumbnails when there is only one image",
      () => {

        const productWithOneImage = {
          ...mockProduct,
          images: [
            "https://example.com/only-image.jpg",
          ],
        }

        render(
          <ProductGallery
            product={
              productWithOneImage
            }
          />
        )

        expect(
          screen.queryByRole(
            "button"
          )
        ).not.toBeInTheDocument()

        expect(
          screen.getByRole(
            "img",
            {
              name: "Laptop",
            }
          )
        ).toHaveAttribute(
          "src",
          "https://example.com/only-image.jpg"
        )
      }
    )
  }
)