import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "./authStorage"

import {
  apiClient,
} from "./apiClient"

vi.mock(
  "./authStorage",
  () => ({
    clearStoredUser:
      vi.fn(),

    getStoredUser:
      vi.fn(),

    setStoredUser:
      vi.fn(),
  }),
)

const mockedGetStoredUser =
  vi.mocked(getStoredUser)

const mockedSetStoredUser =
  vi.mocked(setStoredUser)

const mockedClearStoredUser =
  vi.mocked(clearStoredUser)

const createResponse = (
  data: unknown,
  ok = true,
  status = 200,
): Response => {
  return {
    ok,
    status,
    json:
      async () => data,
  } as Response
}

const mockUser = {
  id: 1,
  username: "emilys",
  email: "emily.johnson@x.dummyjson.com",
  firstName: "Emily",
  lastName: "Johnson",
  gender: "female",
  image:
    "https://dummyjson.com/icon/emilys/128",
  accessToken: "access-token",
  refreshToken: "refresh-token",
}

describe("apiClient", () => {

  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal(
      "fetch",
      vi.fn(),
    )

    mockedGetStoredUser.mockReturnValue(
      mockUser,
    )
  })

  describe("unauthenticated requests", () => {

    it(
      "makes the request without an authorization header",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse({
            success: true,
          }),
        )

        await apiClient(
          "https://dummyjson.com/products",
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledWith(
          "https://dummyjson.com/products",
          {
            headers: expect.any(Headers),
          },
        )

        const request =
          fetchMock.mock.calls[0]?.[1]

        const headers =
          request?.headers as Headers

        expect(
          headers.get(
            "Authorization",
          ),
        ).toBeNull()

        expect(
          headers.get(
            "Content-Type",
          ),
        ).toBe(
          "application/json",
        )
      },
    )

    it(
      "passes request options to fetch",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse({
            success: true,
          }),
        )

        await apiClient(
          "https://dummyjson.com/products",
          {
            method: "POST",
            body: JSON.stringify({
              name: "Test",
            }),
          },
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledWith(
          "https://dummyjson.com/products",
          {
            method: "POST",
            body: JSON.stringify({
              name: "Test",
            }),
            headers: expect.any(Headers),
          },
        )
      },
    )
  })

  describe("authenticated requests", () => {

    it(
      "adds the stored access token to the authorization header",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse({
            id: 1,
          }),
        )

        await apiClient(
          "https://dummyjson.com/auth/me",
          {
            authenticated: true,
          },
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          1,
        )

        const request =
          fetchMock.mock.calls[0]?.[1]

        const headers =
          request?.headers as Headers

        expect(
          headers.get(
            "Authorization",
          ),
        ).toBe(
          "Bearer access-token",
        )
      },
    )

    it(
      "throws when authentication is required but no user is stored",
      async () => {

        mockedGetStoredUser.mockReturnValue(
          null,
        )

        const fetchMock =
          vi.mocked(fetch)

        await expect(
          apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          ),
        ).rejects.toThrow(
          "Authentication required.",
        )

        expect(
          fetchMock,
        ).not.toHaveBeenCalled()
      },
    )

    it(
      "returns the response when it is not a 401",
      async () => {

        const response =
          createResponse(
            {
              id: 1,
            },
            true,
            200,
          )

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          response,
        )

        const result =
          await apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        expect(
          result,
        ).toBe(
          response,
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          1,
        )
      },
    )
  })

  describe("token refresh", () => {

    it(
      "refreshes the token after a 401 and retries the request",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        let storedUser = mockUser

        mockedGetStoredUser.mockImplementation(
          () => storedUser,
        )

        mockedSetStoredUser.mockImplementation(
          (user) => {
            storedUser = user
          },
        )

        fetchMock
          .mockResolvedValueOnce(
            createResponse(
              {
                message:
                  "Unauthorized",
              },
              false,
              401,
            ),
          )
          .mockResolvedValueOnce(
            createResponse({
              accessToken:
                "new-access-token",
              refreshToken:
                "new-refresh-token",
            }),
          )
          .mockResolvedValueOnce(
            createResponse({
              id: 1,
            }),
          )

        const result =
          await apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          3,
        )

        expect(
          fetchMock.mock.calls[1]?.[0],
        ).toBe(
          "https://dummyjson.com/auth/refresh",
        )

        expect(
          mockedSetStoredUser,
        ).toHaveBeenCalledWith({
          ...mockUser,
          accessToken:
            "new-access-token",
          refreshToken:
            "new-refresh-token",
        })

        const retryRequest =
          fetchMock.mock.calls[2]?.[1]

        const retryHeaders =
          retryRequest?.headers as Headers

        expect(
          retryHeaders.get(
            "Authorization",
          ),
        ).toBe(
          "Bearer new-access-token",
        )

        expect(
          result.status,
        ).toBe(200)
      },
    )

    it(
      "returns the original 401 when refresh fails",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        const unauthorizedResponse =
          createResponse(
            {
              message:
                "Unauthorized",
            },
            false,
            401,
          )

        fetchMock
          .mockResolvedValueOnce(
            unauthorizedResponse,
          )
          .mockResolvedValueOnce(
            createResponse(
              {
                message:
                  "Invalid refresh token",
              },
              false,
              401,
            ),
          )

        const result =
          await apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        expect(
          result,
        ).toBe(
          unauthorizedResponse,
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          2,
        )

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()
      },
    )

    it(
      "clears the stored user when the retry returns 401",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock
          .mockResolvedValueOnce(
            createResponse(
              {},
              false,
              401,
            ),
          )
          .mockResolvedValueOnce(
            createResponse({
              accessToken:
                "new-access-token",
              refreshToken:
                "new-refresh-token",
            }),
          )
          .mockResolvedValueOnce(
            createResponse(
              {},
              false,
              401,
            ),
          )

        const result =
          await apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        expect(
          result.status,
        ).toBe(401)

        expect(
          mockedClearStoredUser,
        ).toHaveBeenCalledTimes(
          1,
        )
      },
    )

    it(
      "does not refresh when there is no refresh token",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        mockedGetStoredUser.mockReturnValue({
          ...mockUser,
          refreshToken: "",
        })

        const unauthorizedResponse =
          createResponse(
            {},
            false,
            401,
          )

        fetchMock.mockResolvedValue(
          unauthorizedResponse,
        )

        const result =
          await apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        expect(
          result,
        ).toBe(
          unauthorizedResponse,
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          1,
        )

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()
      },
    )
  })

  describe("refresh response validation", () => {

    it(
      "does not update the stored user when the refresh response has an invalid format",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        const unauthorizedResponse =
          createResponse(
            {},
            false,
            401,
          )

        fetchMock
          .mockResolvedValueOnce(
            unauthorizedResponse,
          )
          .mockResolvedValueOnce(
            createResponse({
              accessToken: 123,
              refreshToken: true,
            }),
          )

        const result =
          await apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        expect(
          result,
        ).toBe(
          unauthorizedResponse,
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          2,
        )

        expect(
          mockedSetStoredUser,
        ).not.toHaveBeenCalled()
      },
    )

    it(
      "does not retry the original request when the refresh response is invalid",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock
          .mockResolvedValueOnce(
            createResponse(
              {},
              false,
              401,
            ),
          )
          .mockResolvedValueOnce(
            createResponse({
              accessToken:
                "valid-token",
              refreshToken:
                123,
            }),
          )

        await apiClient(
          "https://dummyjson.com/auth/me",
          {
            authenticated: true,
          },
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledTimes(
          2,
        )
      },
    )
  })

  describe("concurrent refresh", () => {

    it(
      "shares one refresh request between concurrent authenticated requests",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        let resolveRefresh:
          (
            value: Response,
          ) => void

        const refreshPromise =
          new Promise<Response>(
            (resolve) => {
              resolveRefresh =
                resolve
            },
          )

        fetchMock
          .mockResolvedValueOnce(
            createResponse(
              {},
              false,
              401,
            ),
          )
          .mockResolvedValueOnce(
            createResponse(
              {},
              false,
              401,
            ),
          )
          .mockReturnValueOnce(
            refreshPromise,
          )
          .mockResolvedValue(
            createResponse({
              id: 1,
            }),
          )

        const requestOne =
          apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        const requestTwo =
          apiClient(
            "https://dummyjson.com/auth/me",
            {
              authenticated: true,
            },
          )

        await Promise.resolve()

        resolveRefresh!(
          createResponse({
            accessToken:
              "new-access-token",
            refreshToken:
              "new-refresh-token",
          }),
        )

        await Promise.all([
          requestOne,
          requestTwo,
        ])

        const refreshCalls =
          fetchMock.mock.calls.filter(
            ([url]) =>
              url ===
              "https://dummyjson.com/auth/refresh",
          )

        expect(
          refreshCalls,
        ).toHaveLength(1)

        expect(
          mockedSetStoredUser,
        ).toHaveBeenCalledTimes(
          1,
        )
      },
    )
  })
})