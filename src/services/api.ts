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
// network, HTTP, and malformed-response handling instead of repeating it in services.
export const api = async <T>(
  endpoint: string,
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

  try {
    return await response.json()
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
      response.statusText,
    )
  }
}