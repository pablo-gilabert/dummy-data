import {
  Navigate,
  Outlet,
} from "react-router-dom"

import {
  useAuth,
} from "../../store/useAuth"

const PublicRoute = () => {
  const {
    user,
  } = useAuth()

  // Authenticated users should not return to the login screen.
  if (user) {
    return (
      <Navigate
        to="/products"
        replace
      />
    )
  }

  return <Outlet />
}

export default PublicRoute