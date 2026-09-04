import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  FaCartShopping,
} from "react-icons/fa6"

import {
  IoIosMenu,
} from "react-icons/io"

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  useCart,
} from "../../store/useCart"

import {
  useAuth,
} from "../../store/useAuth"

import styles from "./Navbar.module.css"

const Navbar = () => {

  const location =
    useLocation()

  const navigate =
    useNavigate()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const navbarRef =
    useRef<HTMLElement>(null)

  const {
    items,
  } = useCart()

  const {
    user,
    logout,
  } = useAuth()

  const totalItems =
    items.reduce<number>(
      (total, item) =>
        total + item.quantity,
      0
    )

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        navbarRef.current &&
        !navbarRef.current.contains(
          event.target as Node
        )
      ) {

        setMenuOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }

  }, [])

  const handleNavigation = (
    path: string
  ) => {

    closeMenu()

    if (
      location.pathname === path
    ) {

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  const handleLogout = () => {

    closeMenu()

    logout()

    navigate(
      "/login",
      {
        replace: true,
      }
    )
  }

  return (

    <nav
      ref={navbarRef}
      className={styles.navbar}
    >

      <Link
        className={styles.title}
        to="/"
        onClick={() => {
          handleNavigation("/")
        }}
      >
        Dummy Data
      </Link>

      {user && (

        <span className={styles.user}>
          {user.firstName}
        </span>

      )}

      <Link
        className={styles.cart}
        to="/cart"
        onClick={() => {
          handleNavigation("/cart")
        }}
        aria-label={
          `Shopping cart with ${totalItems} items`
        }
      >

        <FaCartShopping />

        {totalItems > 0 && (

          <span
            className={styles.cartCount}
          >
            {totalItems}
          </span>

        )}

      </Link>

      <button
        className={styles.menu}
        type="button"
        onClick={toggleMenu}
        aria-label={
          menuOpen
            ? "Close menu"
            : "Open menu"
        }
        aria-expanded={menuOpen}
      >
        <IoIosMenu />
      </button>

      <div
        className={`${styles.dropdown} ${
          menuOpen
            ? styles.dropdownOpen
            : ""
        }`}
      >

        <NavLink
          className={styles.link}
          to="/"
          onClick={() => {
            handleNavigation("/")
          }}
        >
          Home
        </NavLink>

        <NavLink
          className={styles.link}
          to="/products"
          onClick={() => {
            handleNavigation(
              "/products"
            )
          }}
        >
          Products
        </NavLink>

        {user && (

          <NavLink
            className={styles.link}
            to="/orders"
            onClick={() => {
              handleNavigation(
                "/orders"
              )
            }}
          >
            Orders
          </NavLink>

        )}

        {user ? (

          <button
            className={styles.logout}
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        ) : (

          <NavLink
            className={styles.link}
            to="/login"
            onClick={() => {
              handleNavigation(
                "/login"
              )
            }}
          >
            Login
          </NavLink>

        )}

      </div>

    </nav>
  )
}

export default Navbar