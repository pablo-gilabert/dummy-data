import {
  z,
} from "zod"

const API_BASE_URL = "https://dummyjson.com"

// A typed error keeps HTTP status information available to callers while
// allowing UI code to distinguish API failures from generic exceptions.
export class ApiError extends Error {
  status: number
  statusText: string

  constructor(
    message: string,
    status: number,
    statusText: string,
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.statusText = statusText
  }
}

// Generic API wrapper used by product and other public services. It centralizes
// network, HTTP, JSON parsing, and runtime schema validation.
export const api = async <T>(
  endpoint: string,
  schema: z.ZodType<T>,
  options?: RequestInit,
): Promise<T> => {
  let response: Response

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      options,
    )
  } catch {
    throw new ApiError(
      "Unable to connect to the server.",
      0,
      "Network Error",
    )
  }

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
    )
  }

  let data: unknown

  try {
    data = await response.json()
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
      response.statusText,
    )
  }

  try {
    return schema.parse(data)
  } catch {
    throw new ApiError(
      "The server returned data with an invalid format.",
      response.status,
      response.statusText,
    )
  }
}
