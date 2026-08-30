import type {
  User,
} from "../types/User"

const USER_KEY = "user"

export const getStoredUser = (): User | null => {

  const storedUser =
    localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {

    return JSON.parse(
      storedUser
    ) as User

  } catch {

    localStorage.removeItem(
      USER_KEY
    )

    return null
  }
}

export const getAccessToken = (): string | null => {

  const user =
    getStoredUser()

  return user?.accessToken ?? null
}

export const setStoredUser = (
  user: User
): void => {

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  )
}

export const clearStoredUser = (): void => {

  localStorage.removeItem(
    USER_KEY
  )
}