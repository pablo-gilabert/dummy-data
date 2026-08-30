import {
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import ErrorState from "./ErrorState"

import {
  ApiError,
} from "../../services/api"

describe("ErrorState", () => {

  it(
    "renders a not found error",
    () => {

      const error =
        new ApiError(
          "Product not found",
          404,
          "Not Found"
        )

      render(
        <ErrorState
          error={error}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Not found",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Error 404"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Product not found"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders a server error for status 500",
    () => {

      const error =
        new ApiError(
          "Internal server error",
          500,
          "Internal Server Error"
        )

      render(
        <ErrorState
          error={error}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Server error",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Error 500"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Internal server error"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders a server error for status greater than 500",
    () => {

      const error =
        new ApiError(
          "Service unavailable",
          503,
          "Service Unavailable"
        )

      render(
        <ErrorState
          error={error}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Server error",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Error 503"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Service unavailable"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders a connection error for status 0",
    () => {

      const error =
        new ApiError(
          "Unable to connect to the server",
          0,
          "Network Error"
        )

      render(
        <ErrorState
          error={error}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Connection error",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          /Error 0/
        )
      ).not.toBeInTheDocument()

      expect(
        screen.getByText(
          "Unable to connect to the server"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders a generic message for a regular Error",
    () => {

      const error =
        new Error(
          "Unexpected error"
        )

      render(
        <ErrorState
          error={error}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Something went wrong",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText(
          /Error \d+/
        )
      ).not.toBeInTheDocument()

      expect(
        screen.getByText(
          "Unexpected error"
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders a generic message for an ApiError with a non-special status",
    () => {

      const error =
        new ApiError(
          "Bad request",
          400,
          "Bad Request"
        )

      render(
        <ErrorState
          error={error}
        />
      )

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Something went wrong",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Error 400"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Bad request"
        )
      ).toBeInTheDocument()
    }
  )
})