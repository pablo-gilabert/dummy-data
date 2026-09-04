import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  configureStore,
} from "@reduxjs/toolkit"

import {
  getCurrentUser,
  loginUser,
} from "../../services/auth"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../../services/authStorage"

import authReducer, {
  initializeAuth,
  login,
  logoutAction,
} from "./authSlice"


vi.mock(
  "../../services/auth",
  () => ({
    getCurrentUser:
      vi.fn(),

    loginUser:
      vi.fn(),
  }),
)


vi.mock(
  "../../services/authStorage",
  () => ({
    clearStoredUser:
      vi.fn(),

    getStoredUser:
      vi.fn(),

    setStoredUser:
      vi.fn(),
  }),
)


const mockedGetCurrentUser =
  vi.mocked(
    getCurrentUser,
  )


const mockedLoginUser =
  vi.mocked(
    loginUser,
  )


const mockedGetStoredUser =
  vi.mocked(
    getStoredUser,
  )


const mockedSetStoredUser =
  vi.mocked(
    setStoredUser,
  )


const mockedClearStoredUser =
  vi.mocked(
    clearStoredUser,
  )


const mockUser = {
  id:
    1,

  username:
    "emilys",

  email:
    "emily@example.com",

  firstName:
    "Emily",

  lastName:
    "Johnson",

  gender:
    "female",

  image:
    "https://example.com/image.jpg",

  accessToken:
    "access-token",

  refreshToken:
    "refresh-token",
}


const createTestStore = () =>
  configureStore({
    reducer: {
      auth:
        authReducer,
    },
  })


describe(
  "authSlice",
  () => {

    beforeEach(() => {
      vi.clearAllMocks()

      mockedGetStoredUser
        .mockReturnValue(
          null,
        )
    })


    it(
      "starts in loading state when a stored user exists",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser,
          )

        let resolveValidation:
          | ((value: typeof mockUser) => void)
          | undefined

        mockedGetCurrentUser
          .mockImplementation(
            () =>
              new Promise(
                (resolve) => {
                  resolveValidation =
                    resolve
                },
              ),
          )

        const store =
          createTestStore()

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          mockUser,
        )

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(true)

        const promise =
          store.dispatch(
            initializeAuth(),
          )

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(true)

        resolveValidation?.(
          mockUser,
        )

        await promise

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)
      },
    )


    it(
      "loads and validates the stored user",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser,
          )

        mockedGetCurrentUser
          .mockResolvedValue({
            ...mockUser,
          })

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          mockUser,
        )

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedGetCurrentUser,
        ).toHaveBeenCalledTimes(
          1,
        )

        expect(
          mockedSetStoredUser,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            id:
              1,

            firstName:
              "Emily",

            accessToken:
              "access-token",

            refreshToken:
              "refresh-token",
          }),
        )
      },
    )


    it(
      "preserves the latest stored tokens when validating the session",
      async () => {

        const latestStoredUser = {
          ...mockUser,

          accessToken:
            "latest-access-token",

          refreshToken:
            "latest-refresh-token",
        }

        mockedGetStoredUser
          .mockReturnValue(
            latestStoredUser,
          )

        mockedGetCurrentUser
          .mockResolvedValue({
            ...mockUser,

            accessToken:
              "api-access-token",

            refreshToken:
              "api-refresh-token",
          })

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          mockedSetStoredUser,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            accessToken:
              "latest-access-token",

            refreshToken:
              "latest-refresh-token",
          }),
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          expect.objectContaining({
            accessToken:
              "latest-access-token",

            refreshToken:
              "latest-refresh-token",
          }),
        )
      },
    )


    it(
      "falls back to the original stored tokens when validating the session",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser,
          )

        mockedGetCurrentUser
          .mockResolvedValue({
            ...mockUser,

            accessToken:
              "api-access-token",

            refreshToken:
              "api-refresh-token",
          })

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          mockedSetStoredUser,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            accessToken:
              "access-token",

            refreshToken:
              "refresh-token",
          }),
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          expect.objectContaining({
            accessToken:
              "access-token",

            refreshToken:
              "refresh-token",
          }),
        )
      },
    )


    it(
      "does not validate a session when there is no stored user",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            null,
          )

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toBeNull()

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedGetCurrentUser,
        ).not.toHaveBeenCalled()

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()

        expect(
          mockedClearStoredUser,
        ).not.toHaveBeenCalled()
      },
    )


    it(
      "preserves the session when the current user cannot be validated",
      async () => {

        mockedGetStoredUser
          .mockReturnValue(
            mockUser,
          )

        mockedGetCurrentUser
          .mockRejectedValue(
            new Error(
              "Network error",
            ),
          )

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          mockUser,
        )

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedGetCurrentUser,
        ).toHaveBeenCalledTimes(
          1,
        )

        expect(
          mockedClearStoredUser,
        ).not.toHaveBeenCalled()

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()
      },
    )


    it(
      "clears the user when the stored session is removed during successful validation",
      async () => {

        let storedUser:
          typeof mockUser | null =
            mockUser

        mockedGetStoredUser
          .mockImplementation(
            () => storedUser,
          )

        mockedGetCurrentUser
          .mockImplementation(
            async () => {

              storedUser =
                null

              return {
                ...mockUser,
              }
            },
          )

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toBeNull()

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedGetCurrentUser,
        ).toHaveBeenCalledTimes(
          1,
        )

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()
      },
    )


    it(
      "clears the user when the stored session is removed during failed validation",
      async () => {

        let storedUser:
          typeof mockUser | null =
            mockUser

        mockedGetStoredUser
          .mockImplementation(
            () => storedUser,
          )

        mockedGetCurrentUser
          .mockImplementation(
            async () => {

              storedUser =
                null

              throw new Error(
                "Network error",
              )
            },
          )

        const store =
          createTestStore()

        await store.dispatch(
          initializeAuth(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toBeNull()

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedGetCurrentUser,
        ).toHaveBeenCalledTimes(
          1,
        )

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()

        expect(
          mockedClearStoredUser,
        ).not.toHaveBeenCalled()
      },
    )


    it(
      "logs in and stores the authenticated user",
      async () => {

        mockedLoginUser
          .mockResolvedValue(
            mockUser,
          )

        const store =
          createTestStore()

        await store.dispatch(
          login({
            username:
              "emilys",

            password:
              "emily-password",
          }),
        )

        expect(
          mockedLoginUser,
        ).toHaveBeenCalledWith(
          "emilys",
          "emily-password",
        )

        expect(
          mockedLoginUser,
        ).toHaveBeenCalledTimes(
          1,
        )

        expect(
          mockedSetStoredUser,
        ).toHaveBeenCalledWith(
          mockUser,
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          mockUser,
        )

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)
      },
    )


    it(
      "does not authenticate the user when login fails",
      async () => {

        mockedLoginUser
          .mockRejectedValue(
            new Error(
              "Invalid credentials",
            ),
          )

        const store =
          createTestStore()

        const result =
          await store.dispatch(
            login({
              username:
                "emilys",

              password:
                "wrong-password",
            }),
          )

        expect(
          result.meta.requestStatus,
        ).toBe(
          "rejected",
        )

        expect(
          store.getState()
            .auth.user,
        ).toBeNull()

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()
      },
    )


    it(
      "logs out and clears the stored user",
      async () => {

        mockedLoginUser
          .mockResolvedValue(
            mockUser,
          )

        const store =
          createTestStore()

        await store.dispatch(
          login({
            username:
              "emilys",

            password:
              "emily-password",
          }),
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          mockUser,
        )

        store.dispatch(
          logoutAction(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toBeNull()

        expect(
          store.getState()
            .auth.isLoading,
        ).toBe(false)

        expect(
          mockedClearStoredUser,
        ).toHaveBeenCalledTimes(
          1,
        )
      },
    )


    it(
      "keeps the authenticated state after a successful login and allows logout",
      async () => {

        mockedLoginUser
          .mockResolvedValue(
            mockUser,
          )

        const store =
          createTestStore()

        await store.dispatch(
          login({
            username:
              "emilys",

            password:
              "emily-password",
          }),
        )

        expect(
          store.getState()
            .auth.user,
        ).toEqual(
          mockUser,
        )

        store.dispatch(
          logoutAction(),
        )

        expect(
          store.getState()
            .auth.user,
        ).toBeNull()

        expect(
          mockedClearStoredUser,
        ).toHaveBeenCalledTimes(
          1,
        )
      },
    )
  },
)