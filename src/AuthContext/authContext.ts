import {
  createContext,
} from "react"

import type {
  User,
} from "../types/User"

interface AuthContextValue {
  user: User | null

  isLoading: boolean

  login: (
    username: string,
    password: string
  ) => Promise<void>

  logout: () => void
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  )