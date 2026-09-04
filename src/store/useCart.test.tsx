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
      "throws an error when used outside Redux Provider",
      () => {

        expect(() =>
          renderHook(() =>
            useCart()
          )
        ).toThrow(
          "could not find react-redux context value"
        )

      }
    )

  }
)