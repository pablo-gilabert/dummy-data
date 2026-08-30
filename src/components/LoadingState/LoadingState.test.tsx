import {
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import LoadingState from "./LoadingState"

describe("LoadingState", () => {

  it(
    "renders the default loading message",
    () => {

      render(
        <LoadingState />
      )

      expect(
        screen.getByText(
          "Loading..."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "renders a custom loading message",
    () => {

      render(
        <LoadingState
          message="Loading products..."
        />
      )

      expect(
        screen.getByText(
          "Loading products..."
        )
      ).toBeInTheDocument()
    }
  )
})