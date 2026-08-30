import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  api,
  ApiError,
} from "./api"

describe("api", () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it(
    "returns the parsed JSON when the request is successful",
    async () => {

      const responseData = {
        id: 1,
        title: "Test product",
      }

      const fetchMock =
        vi
          .spyOn(
            globalThis,
            "fetch"
          )
          .mockResolvedValue(
            new Response(
              JSON.stringify(
                responseData
              ),
              {
                status: 200,
                statusText: "OK",
                headers: {
                  "Content-Type":
                    "application/json",
                },
              }
            )
          )

      const result =
        await api<{
          id: number
          title: string
        }>("/products/1")

      expect(
        result
      ).toEqual(
        responseData
      )

      expect(
        fetchMock
      ).toHaveBeenCalledWith(
        "https://dummyjson.com/products/1",
        undefined
      )
    }
  )

  it(
    "passes the request options to fetch",
    async () => {

      const fetchMock =
        vi
          .spyOn(
            globalThis,
            "fetch"
          )
          .mockResolvedValue(
            new Response(
              JSON.stringify({
                success: true,
              }),
              {
                status: 200,
                statusText: "OK",
              }
            )
          )

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: "Test",
        }),
      }

      await api(
        "/test",
        options
      )

      expect(
        fetchMock
      ).toHaveBeenCalledWith(
        "https://dummyjson.com/test",
        options
      )
    }
  )

  it(
    "throws ApiError when the server returns a non-ok response",
    async () => {

      vi
        .spyOn(
          globalThis,
          "fetch"
        )
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              message:
                "Product not found",
            }),
            {
              status: 404,
              statusText: "Not Found",
            }
          )
        )

      await expect(
        api("/products/999")
      ).rejects.toMatchObject({
        name: "ApiError",
        message:
          "API request failed: 404 Not Found",
        status: 404,
        statusText:
          "Not Found",
      })
    }
  )

  it(
    "throws ApiError when the network request fails",
    async () => {

      vi
        .spyOn(
          globalThis,
          "fetch"
        )
        .mockRejectedValue(
          new Error(
            "Network failure"
          )
        )

      await expect(
        api("/products")
      ).rejects.toEqual(
        expect.objectContaining({
          name: "ApiError",
          message:
            "Unable to connect to the server.",
          status: 0,
          statusText:
            "Network Error",
        })
      )
    }
  )

  it(
    "throws ApiError when the server returns invalid JSON",
    async () => {

      vi
        .spyOn(
          globalThis,
          "fetch"
        )
        .mockResolvedValue(
          new Response(
            "invalid json",
            {
              status: 200,
              statusText: "OK",
            }
          )
        )

      await expect(
        api("/products")
      ).rejects.toEqual(
        expect.objectContaining({
          name: "ApiError",
          message:
            "The server returned an invalid response.",
          status: 200,
          statusText: "OK",
        })
      )
    }
  )

  it(
    "creates an ApiError with the correct properties",
    () => {

      const error =
        new ApiError(
          "Test error",
          400,
          "Bad Request"
        )

      expect(
        error
      ).toBeInstanceOf(
        Error
      )

      expect(
        error
      ).toBeInstanceOf(
        ApiError
      )

      expect(
        error.name
      ).toBe(
        "ApiError"
      )

      expect(
        error.message
      ).toBe(
        "Test error"
      )

      expect(
        error.status
      ).toBe(
        400
      )

      expect(
        error.statusText
      ).toBe(
        "Bad Request"
      )
    }
  )
})