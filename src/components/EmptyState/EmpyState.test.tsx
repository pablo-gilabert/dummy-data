import {
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import EmptyState from "./EmptyState"

describe("EmptyState", () => {

  it(
    "renders the default title and message",
    () => {

      render(
        <EmptyState />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "No results found",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "There are no products matching your search."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders custom title and message",
    () => {

      render(
        <EmptyState
          title="No orders yet"
          message="Your completed orders will appear here."
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "No orders yet",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Your completed orders will appear here."
        )
      ).toBeInTheDocument()
    }
  )
})