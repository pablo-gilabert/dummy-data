const API_BASE_URL = "https://dummyjson.com"

export class ApiError extends Error {

  status: number
  statusText: string

  constructor(
    message: string,
    status: number,
    statusText: string
  ) {

    super(message)

    this.name = "ApiError"
    this.status = status
    this.statusText = statusText
  }
}

export const api = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {

  let response: Response

  try {

    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      options
    )

  } catch {

    throw new ApiError(
      "Unable to connect to the server.",
      0,
      "Network Error"
    )
  }

  if (!response.ok) {

    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText
    )
  }

  try {

    return await response.json()

  } catch {

    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
      response.statusText
    )
  }
}