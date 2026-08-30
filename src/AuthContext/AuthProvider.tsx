import {
  useEffect,
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
  refreshAuthToken,
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
    isLoading,
    setIsLoading,
  ] = useState(true)

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

        setStoredUser(
          authenticatedUser
        )

        setUser(
          authenticatedUser
        )
      },

    })

  useEffect(() => {

    const validateSession =
      async () => {

        const storedUser =
          getStoredUser()

        if (!storedUser) {

          setIsLoading(false)

          return
        }

        try {

          const currentUser =
            await getCurrentUser()

          const authenticatedUser:
            User = {

            ...currentUser,

            accessToken:
              storedUser.accessToken,

            refreshToken:
              storedUser.refreshToken,
          }

          setStoredUser(
            authenticatedUser
          )

          setUser(
            authenticatedUser
          )

        } catch {

          try {

            const refreshedTokens =
              await refreshAuthToken(
                storedUser.refreshToken
              )

            const refreshedUser:
              User = {

              ...storedUser,

              accessToken:
                refreshedTokens.accessToken,

              refreshToken:
                refreshedTokens.refreshToken,
            }

            setStoredUser(
              refreshedUser
            )

            setUser(
              refreshedUser
            )

          } catch {

            clearStoredUser()

            setUser(null)
          }

        } finally {

          setIsLoading(false)
        }
      }

    void validateSession()

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

    loginMutation.reset()
  }

  return (

    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export default AuthProvider