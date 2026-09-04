import {
  UserSchema,
} from "../schemas/UserSchema"

import type {
  User,
} from "../types/User"

const USER_KEY = "user"

// Authentication state is persisted locally so a page reload can restore
// the current session before the application validates it with the API.

export const getStoredUser = (): User | null => {
  const storedUser =
    localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    const data: unknown =
      JSON.parse(storedUser)

    return UserSchema.parse(data)
  } catch {
    // Invalid persisted data should never prevent the application from loading.
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const setStoredUser = (
  user: User,
): void => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  )
}

export const clearStoredUser =
  (): void => {
    localStorage.removeItem(
      USER_KEY,
    )
  }