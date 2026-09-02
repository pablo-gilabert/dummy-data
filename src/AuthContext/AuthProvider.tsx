import {
  useEffect,
  useRef,
  useState,
} from "react"

import type {
  ReactNode,
} from "react"

import {
  useMutation,
} from "@tanstack/react-query"

import type {
  User,
} from "../types/User"

import {
  getCurrentUser,
  loginUser,
} from "../services/auth"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../services/authStorage"

import {
  AuthContext,
} from "./authContext"

interface AuthProviderProps {
  children: ReactNode
}

interface LoginCredentials {
  username: string
  password: string
}

const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [
    user,
    setUser,
  ] = useState<User | null>(() =>
    getStoredUser()
  )

  const [
    isInitializing,
    setIsInitializing,
  ] = useState(
    () => getStoredUser() !== null
  )

  const hasLoggedInRef =
    useRef(false)

  const loginMutation =
    useMutation({
      mutationFn: ({
        username,
        password,
      }: LoginCredentials) =>
        loginUser(
          username,
          password
        ),

      onSuccess: (
        authenticatedUser
      ) => {
        hasLoggedInRef.current = true

        setStoredUser(
          authenticatedUser
        )

        setUser(
          authenticatedUser
        )

        setIsInitializing(false)
      },
    })

  useEffect(() => {
    let isActive = true

    const validateSession =
      async () => {
        if (hasLoggedInRef.current) {
          return
        }

        const storedUser =
          getStoredUser()

        if (!storedUser) {
          return
        }

        try {
          const currentUser =
            await getCurrentUser()

          if (!isActive) {
            return
          }

          const latestStoredUser =
            getStoredUser()

          if (!latestStoredUser) {
            setUser(null)
            return
          }

          const authenticatedUser:
            User = {
              ...currentUser,
              accessToken:
                latestStoredUser.accessToken,
              refreshToken:
                latestStoredUser.refreshToken,
            }

          setStoredUser(
            authenticatedUser
          )

          setUser(
            authenticatedUser
          )
        } catch {
          if (!isActive) {
            return
          }

          /*
           * Do not log the user out because of a
           * network error, aborted request, or reload.
           *
           * If the stored session still exists, keep
           * the current authenticated state.
           */
          const latestStoredUser =
            getStoredUser()

          if (!latestStoredUser) {
            setUser(null)
          }
        } finally {
          if (isActive) {
            setIsInitializing(false)
          }
        }
      }

    void validateSession()

    return () => {
      isActive = false
    }
  }, [])

  const login = async (
    username: string,
    password: string
  ) => {
    await loginMutation.mutateAsync({
      username,
      password,
    })
  }

  const logout = () => {
    clearStoredUser()

    setUser(null)

    hasLoggedInRef.current = false

    loginMutation.reset()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider