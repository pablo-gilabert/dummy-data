import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  getCurrentUser,
  loginUser,
  refreshAuthToken,
} from "./auth"

import {
  apiClient,
} from "./apiClient"

vi.mock(
  "./apiClient",
  () => ({
    apiClient:
      vi.fn(),
  }),
)

const mockedApiClient =
  vi.mocked(apiClient)

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

describe("auth service", () => {

  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal(
      "fetch",
      vi.fn(),
    )
  })

  describe("loginUser", () => {

    it(
      "sends username and password",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse(
            mockUser,
          ),
        )

        await loginUser(
          "emilys",
          "emily_pass",
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledWith(
          "https://dummyjson.com/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                "emilys",
              password:
                "emily_pass",
            }),
          },
        )
      },
    )

    it(
      "returns the authenticated user",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse(
            mockUser,
          ),
        )

        const result =
          await loginUser(
            "emilys",
            "emily_pass",
          )

        expect(
          result,
        ).toEqual(
          mockUser,
        )
      },
    )

    it(
      "throws an error when login fails",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse(
            {},
            false,
            401,
          ),
        )

        await expect(
          loginUser(
            "wrong-user",
            "wrong-password",
          ),
        ).rejects.toThrow(
          "Invalid username or password.",
        )
      },
    )

    it(
      "throws when the login response has an invalid format",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse({
            id: "invalid-id",
            username: "emilys",
          }),
        )

        await expect(
          loginUser(
            "emilys",
            "emily_pass",
          ),
        ).rejects.toThrow()
      },
    )
  })

  describe("getCurrentUser", () => {

    it(
      "requests the authenticated user",
      async () => {

        mockedApiClient.mockResolvedValue(
          createResponse(
            mockUser,
          ),
        )

        await getCurrentUser()

        expect(
          mockedApiClient,
        ).toHaveBeenCalledWith(
          "https://dummyjson.com/auth/me",
          {
            authenticated: true,
          },
        )
      },
    )

    it(
      "returns the current user",
      async () => {

        mockedApiClient.mockResolvedValue(
          createResponse(
            mockUser,
          ),
        )

        const result =
          await getCurrentUser()

        expect(
          result,
        ).toEqual(
          mockUser,
        )
      },
    )

    it(
      "throws an error when the request fails",
      async () => {

        mockedApiClient.mockResolvedValue(
          createResponse(
            {},
            false,
            401,
          ),
        )

        await expect(
          getCurrentUser(),
        ).rejects.toThrow(
          "Unable to retrieve authenticated user.",
        )
      },
    )

    it(
      "throws when the current user response has an invalid format",
      async () => {

        mockedApiClient.mockResolvedValue(
          createResponse({
            id: "invalid-id",
            username: "emilys",
          }),
        )

        await expect(
          getCurrentUser(),
        ).rejects.toThrow()
      },
    )
  })

  describe("refreshAuthToken", () => {

    it(
      "sends the refresh token",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        const refreshedTokens = {
          accessToken:
            "new-access-token",
          refreshToken:
            "new-refresh-token",
        }

        fetchMock.mockResolvedValue(
          createResponse(
            refreshedTokens,
          ),
        )

        await refreshAuthToken(
          "old-refresh-token",
        )

        expect(
          fetchMock,
        ).toHaveBeenCalledWith(
          "https://dummyjson.com/auth/refresh",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              refreshToken:
                "old-refresh-token",
            }),
          },
        )
      },
    )

    it(
      "returns the refreshed tokens",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        const refreshedTokens = {
          accessToken:
            "new-access-token",
          refreshToken:
            "new-refresh-token",
        }

        fetchMock.mockResolvedValue(
          createResponse(
            refreshedTokens,
          ),
        )

        const result =
          await refreshAuthToken(
            "old-refresh-token",
          )

        expect(
          result,
        ).toEqual(
          refreshedTokens,
        )
      },
    )

    it(
      "throws an error when refresh fails",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse(
            {},
            false,
            401,
          ),
        )

        await expect(
          refreshAuthToken(
            "invalid-refresh-token",
          ),
        ).rejects.toThrow(
          "Unable to refresh authentication.",
        )
      },
    )

    it(
      "throws when the refresh response has an invalid format",
      async () => {

        const fetchMock =
          vi.mocked(fetch)

        fetchMock.mockResolvedValue(
          createResponse({
            accessToken: 123,
            refreshToken: true,
          }),
        )

        await expect(
          refreshAuthToken(
            "old-refresh-token",
          ),
        ).rejects.toThrow()
      },
    )
  })
})
