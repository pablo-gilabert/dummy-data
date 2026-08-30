import {
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import ProductReviews from "./ProductReviews"

import type { Product } from "../../types/Product"

const mockReviews: Product["reviews"] = [
  {
    rating: 5,
    comment: "Excellent product!",
    date: "2025-01-15T00:00:00.000Z",
    reviewerName: "John Doe",
    reviewerEmail: "john@example.com",
  },
  {
    rating: 4,
    comment: "Very good quality.",
    date: "2025-02-20T00:00:00.000Z",
    reviewerName: "Jane Smith",
    reviewerEmail: "jane@example.com",
  },
]

describe("ProductReviews", () => {

  it(
    "renders nothing when reviews are empty",
    () => {

      const { container } =
        render(
          <ProductReviews
            reviews={[]}
          />
        )

      expect(
        container.firstChild
      ).toBeNull()
    }
  )

  it(
    "renders the reviews heading",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Reviews",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders reviewer names",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      expect(
        screen.getByText(
          "John Doe"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Jane Smith"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders review ratings",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      expect(
        screen.getByText("5")
      ).toBeInTheDocument()

      expect(
        screen.getByText("4")
      ).toBeInTheDocument()
    }
  )

  it(
    "renders review comments",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      expect(
        screen.getByText(
          "Excellent product!"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Very good quality."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders review dates",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      const dates =
        screen.getAllByRole(
          "time"
        )

      expect(
        dates
      ).toHaveLength(2)

      expect(
        dates[0]
      ).toBeInTheDocument()

      expect(
        dates[1]
      ).toBeInTheDocument()
    }
  )

  it(
    "renders the correct number of reviews",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      expect(
        screen.getAllByRole(
          "article"
        )
      ).toHaveLength(2)
    }
  )

  it(
    "renders a star icon for each review",
    () => {

      const { container } =
        render(
          <ProductReviews
            reviews={mockReviews}
          />
        )

      expect(
        container.querySelectorAll(
          "svg"
        )
      ).toHaveLength(2)
    }
  )

  it(
    "sets the correct dateTime attribute",
    () => {

      render(
        <ProductReviews
          reviews={mockReviews}
        />
      )

      const dates =
        screen.getAllByRole(
          "time"
        )

      expect(
        dates[0]
      ).toHaveAttribute(
        "dateTime",
        "2025-01-15T00:00:00.000Z"
      )

      expect(
        dates[1]
      ).toHaveAttribute(
        "dateTime",
        "2025-02-20T00:00:00.000Z"
      )
    }
  )
})