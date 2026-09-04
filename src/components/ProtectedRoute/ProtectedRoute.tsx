import {
  Navigate,
  Outlet,
} from "react-router-dom"

import {
  useAuth,
} from "../../store/useAuth"

const ProtectedRoute = () => {
  const {
    user,
    isLoading,
  } = useAuth()

  // Authentication initialization must finish before deciding whether to redirect.
  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Outlet renders whichever authenticated child route matched the URL.
  return <Outlet />
}

export default ProtectedRoute