import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit"

import type {
  User,
} from "../../types/User"

import {
  getCurrentUser,
  loginUser,
} from "../../services/auth"

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../../services/authStorage"


interface LoginCredentials {
  username: string
  password: string
}


interface AuthState {
  user: User | null
  isLoading: boolean
}


const getInitialState =
  (): AuthState => {
    const storedUser =
      getStoredUser()

    return {
      user: storedUser,
      isLoading:
        storedUser !== null,
    }
  }


export const initializeAuth =
  createAsyncThunk<
    User | null
  >(
    "auth/initializeAuth",
    async () => {
      const storedUser =
        getStoredUser()

      if (!storedUser) {
        return null
      }

      try {
        const currentUser =
          await getCurrentUser()

        const latestStoredUser =
          getStoredUser()

        if (!latestStoredUser) {
          return null
        }

        const authenticatedUser: User = {
          ...currentUser,
          accessToken:
            latestStoredUser.accessToken,
          refreshToken:
            latestStoredUser.refreshToken,
        }

        setStoredUser(
          authenticatedUser,
        )

        return authenticatedUser
      } catch {
        // A transient network failure should not destroy
        // a valid local session.
        const latestStoredUser =
          getStoredUser()

        if (!latestStoredUser) {
          return null
        }

        return latestStoredUser
      }
    },
  )


export const login =
  createAsyncThunk<
    User,
    LoginCredentials,
    {
      rejectValue: string
    }
  >(
    "auth/login",
    async (
      {
        username,
        password,
      },
      {
        rejectWithValue,
      },
    ) => {
      try {
        const authenticatedUser =
          await loginUser(
            username,
            password,
          )

        setStoredUser(
          authenticatedUser,
        )

        return authenticatedUser
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : "Unable to log in.",
        )
      }
    },
  )


const authSlice = createSlice({
  name: "auth",

  initialState:
    getInitialState,

  reducers: {
    logout: (state) => {
      clearStoredUser()

      state.user = null
      state.isLoading = false
    },
  },

  extraReducers: (
    builder,
  ) => {
    builder
      .addCase(
        initializeAuth.pending,
        (state) => {
          state.isLoading = true
        },
      )

      .addCase(
        initializeAuth.fulfilled,
        (
          state,
          action,
        ) => {
          state.user =
            action.payload
          state.isLoading =
            false
        },
      )

      .addCase(
        initializeAuth.rejected,
        (state) => {
          state.isLoading =
            false
        },
      )

      .addCase(
        login.pending,
        (state) => {
          state.isLoading = true
        },
      )

      .addCase(
        login.fulfilled,
        (
          state,
          action,
        ) => {
          state.user =
            action.payload
          state.isLoading =
            false
        },
      )

      .addCase(
        login.rejected,
        (state) => {
          state.isLoading =
            false
        },
      )
  },
})

export const {logout: logoutAction} = authSlice.actions

export default authSlice.reducer