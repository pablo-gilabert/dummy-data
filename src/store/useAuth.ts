import {
  useAppDispatch,
  useAppSelector,
} from "./hooks"

import {
  login as loginAction,
  logoutAction,
} from "./slices/authSlice"


export const useAuth = () => {
  const dispatch =
    useAppDispatch()


  const user =
    useAppSelector(
      (state) => state.auth.user,
    )


  const isLoading =
    useAppSelector(
      (state) => state.auth.isLoading,
    )


  const login = async (
    username: string,
    password: string,
  ) => {
    await dispatch(
      loginAction({
        username,
        password,
      }),
    ).unwrap()
  }


  const logout = () => {
    dispatch(
      logoutAction(),
    )
  }


  return {
    user,
    isLoading,
    login,
    logout,
  }
}