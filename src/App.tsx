import {
  Route,
  Routes,
} from "react-router-dom"

import Home from "./pages/Home/Home"
import Products from "./pages/Products/Products"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Cart from "./pages/Cart/Cart"

import Navbar from "./components/Navbar/Navbar"
import Checkout from "./components/Checkout/Checkout"
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation"

import NotFound from "./pages/NotFound/NotFound"

import Orders from "./pages/Orders/Orders"
import OrderDetail from "./pages/OrderDetail/OrderDetail"

import Login from "./pages/Login/Login"

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"

function App() {

  return (

    <>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-confirmation"
            element={
              <OrderConfirmation />
            }
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/orders/:orderId"
            element={<OrderDetail />}
          />

        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </>

  )
}

export default App