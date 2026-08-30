import {
  api,
} from "./api"

import type { User } from "../types/User"

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export const login = async (
  credentials: LoginCredentials
): Promise<User> => {

  return api<LoginResponse>(
    "/auth/login",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(
        credentials
      ),
    }
  )
}