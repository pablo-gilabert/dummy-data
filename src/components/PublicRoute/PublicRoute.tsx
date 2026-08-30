import {
  Navigate,
  Outlet,
} from "react-router-dom"

import {
  useAuth,
} from "../../AuthContext/useAuth"

const PublicRoute = () => {

  const {
    user,
  } = useAuth()

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