import {
  renderHook,
} from "@testing-library/react"

import {
  Provider,
} from "react-redux"

import {
  configureStore,
} from "@reduxjs/toolkit"

import {
  describe,
  expect,
  it,
} from "vitest"

import {
  useAuth,
} from "./useAuth"

import authReducer from "./slices/authSlice"


const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  })


const createWrapper = () => {
  const store =
    createTestStore()

  return ({
    children,
  }: {
    children: React.ReactNode
  }) => (
    <Provider store={store}>
      {children}
    </Provider>
  )
}


describe("useAuth", () => {
  it(
    "throws an error when used outside Redux Provider",
    () => {
      expect(() =>
        renderHook(() =>
          useAuth()
        )
      ).toThrow(
        /could not find react-redux context value/i,
      )
    },
  )


  it(
    "returns the default authentication state",
    () => {
      const {
        result,
      } = renderHook(
        () => useAuth(),
        {
          wrapper:
            createWrapper(),
        },
      )

      expect(
        result.current.user,
      ).toBeNull()

      expect(
        result.current.isLoading,
      ).toBe(false)

      expect(
        result.current.login,
      ).toBeTypeOf("function")

      expect(
        result.current.logout,
      ).toBeTypeOf("function")
    },
  )
})