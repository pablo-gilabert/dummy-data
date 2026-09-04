import {
  UserSchema,
} from "../schemas/UserSchema"

import type {
  User,
} from "../types/User"

import {
  apiClient,
} from "./apiClient"

const API_URL = "https://dummyjson.com/auth"

// Authentication service functions translate UI intent into API requests.
// Token injection and refresh remain centralized in apiClient.
export const loginUser = async (
  username: string,
  password: string,
): Promise<User> => {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      "Invalid username or password.",
    )
  }

  const data: unknown =
    await response.json()

  return UserSchema.parse(data)
}

// /me verifies that the stored access token still represents a valid session.
export const getCurrentUser =
  async (): Promise<User> => {
    const response =
      await apiClient(
        `${API_URL}/me`,
        {
          authenticated: true,
        },
      )

    if (!response.ok) {
      throw new Error(
        "Unable to retrieve authenticated user.",
      )
    }

    const data: unknown =
      await response.json()

    return UserSchema.parse(data)
  }