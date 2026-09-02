import {
  describe,
  expect,
  it,
} from "vitest"

import {
  renderHook,
} from "@testing-library/react"

import {
  useCart,
} from "./useCart"


describe(
  "useCart",
  () => {

    it(
      "throws an error when used outside CartProvider",
      () => {

        expect(() =>
          renderHook(() =>
            useCart()
          )
        ).toThrow(
          "useCart must be used inside CartProvider"
        )

      }
    )

  }
)