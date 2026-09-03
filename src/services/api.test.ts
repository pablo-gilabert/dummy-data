import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  z,
} from "zod"

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

      const TestResponseSchema =
        z.object({
          id: z.number(),
          title: z.string(),
        })

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
        await api(
          "/products/1",
          TestResponseSchema
        )

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

      const TestResponseSchema =
        z.object({
          success: z.boolean(),
        })

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
        TestResponseSchema,
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

      const TestResponseSchema =
        z.object({
          message: z.string(),
        })

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
        api(
          "/products/999",
          TestResponseSchema
        )
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

      const TestResponseSchema =
        z.object({
          id: z.number(),
        })

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
        api(
          "/products",
          TestResponseSchema
        )
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

      const TestResponseSchema =
        z.object({
          id: z.number(),
        })

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
        api(
          "/products",
          TestResponseSchema
        )
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
    "throws ApiError when the response does not match the schema",
    async () => {

      const TestResponseSchema =
        z.object({
          id: z.number(),
          title: z.string(),
        })

      vi
        .spyOn(
          globalThis,
          "fetch"
        )
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              id: "invalid",
              title: "Test product",
            }),
            {
              status: 200,
              statusText: "OK",
            }
          )
        )

      await expect(
        api(
          "/products/1",
          TestResponseSchema
        )
      ).rejects.toEqual(
        expect.objectContaining({
          name: "ApiError",
          message:
            "The server returned data with an invalid format.",
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
