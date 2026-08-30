import {
  useEffect,
  useState,
} from "react"

import type {
  ChangeEvent,
  FormEvent,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import Swal from "sweetalert2"

import {
  useCart,
} from "../../CartContext/useCart"

import {
  useAuth,
} from "../../AuthContext/useAuth"

import type {
  Order,
} from "../../types/Order"

import {
  saveOrder,
} from "../../services/orderStorage"

import styles from "./Checkout.module.css"

interface CheckoutForm {
  name: string
  email: string
  phone: string
  address: string
  city: string
}

interface CheckoutErrors {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
}

const Checkout = () => {

  const {
    items,
    clearCart,
  } = useCart()

  const {
    user,
  } = useAuth()

  const navigate = useNavigate()

  const [
    form,
    setForm,
  ] = useState<CheckoutForm>(() => ({
    name: user
      ? `${user.firstName} ${user.lastName}`
      : "",
    email:
      user?.email ?? "",
    phone: "",
    address: "",
    city: "",
  }))

  const [
    errors,
    setErrors,
  ] = useState<CheckoutErrors>({})

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  useEffect(() => {

    if (items.length === 0) {

      navigate(
        "/cart",
        {
          replace: true,
        }
      )
    }

  }, [
    items.length,
    navigate,
  ])

  if (items.length === 0) {
    return null
  }

  const subtotal =
    items.reduce<number>(
      (
        sum,
        item
      ) =>
        sum +
        item.product.price *
        item.quantity,
      0
    )

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }))
  }

  const validateForm = (): boolean => {

    const newErrors: CheckoutErrors = {}

    if (!form.name.trim()) {

      newErrors.name =
        "Please enter your full name."
    }

    if (!form.email.trim()) {

      newErrors.email =
        "Please enter your email."

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {

      newErrors.email =
        "Please enter a valid email."
    }

    if (!form.phone.trim()) {

      newErrors.phone =
        "Please enter your phone number."
    }

    if (!form.address.trim()) {

      newErrors.address =
        "Please enter your address."
    }

    if (!form.city.trim()) {

      newErrors.city =
        "Please enter your city."
    }

    setErrors(
      newErrors
    )

    return (
      Object.keys(
        newErrors
      ).length === 0
    )
  }

  const validateStock = (): boolean => {

    const invalidItem =
      items.find(
        (item) =>
          item.quantity >
          item.product.stock
      )

    if (!invalidItem) {
      return true
    }

    void Swal.fire({
      title:
        "Insufficient stock",

      text:
        `There is not enough stock for ` +
        `"${invalidItem.product.title}". ` +
        `Available: ${invalidItem.product.stock}.`,

      icon:
        "warning",

      confirmButtonText:
        "OK",

      confirmButtonColor:
        "#2a9d8f",
    })

    return false
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!user) {

      navigate(
        "/login",
        {
          replace: true,
        }
      )

      return
    }

    if (!validateForm()) {
      return
    }

    if (!validateStock()) {
      return
    }

    const result =
      await Swal.fire({

        title:
          "Place order?",

        text:
          "Please confirm that you want to place this order.",

        icon:
          "question",

        showCancelButton:
          true,

        confirmButtonText:
          "Place order",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#2a9d8f",

        cancelButtonColor:
          "#6c757d",

        reverseButtons:
          true,
      })

    if (!result.isConfirmed) {
      return
    }

    setIsSubmitting(true)

    try {

      const order: Order = {

        id:
          crypto.randomUUID(),

        userId:
          user.id,

        createdAt:
          new Date().toISOString(),

        customer: {

          name:
            form.name.trim(),

          email:
            form.email.trim(),

          phone:
            form.phone.trim(),

          address:
            form.address.trim(),

          city:
            form.city.trim(),
        },

        items: [
          ...items,
        ],

        total:
          subtotal,
      }

      saveOrder(
        order
      )

      localStorage.setItem(
        "lastOrderId",
        order.id
      )

      clearCart()

      await Swal.fire({

        title:
          "Order placed!",

        text:
          "Your order has been successfully placed.",

        icon:
          "success",

        confirmButtonText:
          "Continue",

        confirmButtonColor:
          "#2a9d8f",
      })

      navigate(
        "/order-confirmation",
        {
          replace: true,
        }
      )

    } catch {

      setIsSubmitting(false)

      await Swal.fire({

        title:
          "Something went wrong",

        text:
          "The order could not be completed. Please try again.",

        icon:
          "error",

        confirmButtonText:
          "OK",

        confirmButtonColor:
          "#2a9d8f",
      })
    }
  }

  return (

    <main
      className={styles.checkout}
    >

      <h1
        className={styles.title}
      >
        Checkout
      </h1>

      <div
        className={styles.layout}
      >

        <section
          className={
            styles.formSection
          }
        >

          <h2>
            Customer information
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
            noValidate
          >

            <div
              className={styles.field}
            >

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={
                  handleChange
                }
                aria-invalid={
                  Boolean(
                    errors.name
                  )
                }
                aria-describedby={
                  errors.name
                    ? "name-error"
                    : undefined
                }
                disabled={
                  isSubmitting
                }
              />

              {errors.name && (

                <span
                  id="name-error"
                  className={
                    styles.error
                  }
                >
                  {errors.name}
                </span>

              )}

            </div>

            <div
              className={styles.field}
            >

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={
                  handleChange
                }
                aria-invalid={
                  Boolean(
                    errors.email
                  )
                }
                aria-describedby={
                  errors.email
                    ? "email-error"
                    : undefined
                }
                disabled={
                  isSubmitting
                }
              />

              {errors.email && (

                <span
                  id="email-error"
                  className={
                    styles.error
                  }
                >
                  {errors.email}
                </span>

              )}

            </div>

            <div
              className={styles.field}
            >

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={
                  handleChange
                }
                aria-invalid={
                  Boolean(
                    errors.phone
                  )
                }
                aria-describedby={
                  errors.phone
                    ? "phone-error"
                    : undefined
                }
                disabled={
                  isSubmitting
                }
              />

              {errors.phone && (

                <span
                  id="phone-error"
                  className={
                    styles.error
                  }
                >
                  {errors.phone}
                </span>

              )}

            </div>

            <div
              className={styles.field}
            >

              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={
                  handleChange
                }
                aria-invalid={
                  Boolean(
                    errors.address
                  )
                }
                aria-describedby={
                  errors.address
                    ? "address-error"
                    : undefined
                }
                disabled={
                  isSubmitting
                }
              />

              {errors.address && (

                <span
                  id="address-error"
                  className={
                    styles.error
                  }
                >
                  {errors.address}
                </span>

              )}

            </div>

            <div
              className={styles.field}
            >

              <label htmlFor="city">
                City
              </label>

              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={form.city}
                onChange={
                  handleChange
                }
                aria-invalid={
                  Boolean(
                    errors.city
                  )
                }
                aria-describedby={
                  errors.city
                    ? "city-error"
                    : undefined
                }
                disabled={
                  isSubmitting
                }
              />

              {errors.city && (

                <span
                  id="city-error"
                  className={
                    styles.error
                  }
                >
                  {errors.city}
                </span>

              )}

            </div>

            <button
              className={
                styles.submitButton
              }
              type="submit"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Processing..."
                : "Place order"}
            </button>

          </form>

        </section>

        <aside
          className={
            styles.orderSummary
          }
        >

          <h2>
            Order summary
          </h2>

          <div
            className={
              styles.products
            }
          >

            {items.map((item) => (

              <div
                className={
                  styles.product
                }
                key={
                  item.product.id
                }
              >

                <div>

                  <h3>
                    {item.product.title}
                  </h3>

                  <span>
                    Quantity:{" "}
                    {item.quantity}
                  </span>

                </div>

                <span>
                  $
                  {(
                    item.product.price *
                    item.quantity
                  ).toFixed(2)}
                </span>

              </div>

            ))}

          </div>

          <div
            className={styles.total}
          >

            <span>
              Total
            </span>

            <strong>
              $ {subtotal.toFixed(2)}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  )
}

export default Checkout