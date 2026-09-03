import {
  useEffect,
} from "react"

import {
  useForm,
} from "react-hook-form"

import {
  zodResolver,
} from "@hookform/resolvers/zod"

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

import {
  CheckoutSchema,
  type CheckoutFormData,
} from "../../schemas/CheckoutSchema"

import type {
  Order,
} from "../../types/Order"

import {
  saveOrder,
} from "../../services/orderStorage"

import styles from "./Checkout.module.css"


const Checkout = () => {

  const {
    items,
    clearCart,
  } = useCart()

  const {
    user,
  } = useAuth()

  const navigate =
    useNavigate()

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CheckoutFormData>({
    resolver:
      zodResolver(CheckoutSchema),

    defaultValues: {
      name: user
        ? `${user.firstName} ${user.lastName}`
        : "",

      email:
        user?.email ?? "",

      phone: "",
      address: "",
      city: "",
    },
  })

  useEffect(() => {

    if (items.length === 0) {

      navigate(
        "/cart",
        {
          replace: true,
        },
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
        item,
      ) =>
        sum +
        item.product.price *
        item.quantity,
      0,
    )

  const validateStock = (): boolean => {

    const invalidItem =
      items.find(
        (item) =>
          item.quantity >
          item.product.stock,
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

  const onSubmit = async (
    data: CheckoutFormData,
  ) => {

    if (!user) {

      navigate(
        "/login",
        {
          replace: true,
        },
      )

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
            data.name,

          email:
            data.email,

          phone:
            data.phone,

          address:
            data.address,

          city:
            data.city,
        },

        items: [
          ...items,
        ],

        total:
          subtotal,
      }

      saveOrder(
        order,
      )

      localStorage.setItem(
        "lastOrderId",
        order.id,
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
        },
      )

    } catch {

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
              handleSubmit(
                onSubmit,
              )
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
                type="text"
                {...register(
                  "name",
                )}
                autoComplete="name"
                aria-invalid={
                  Boolean(
                    errors.name,
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
                  {
                    errors.name.message
                  }
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
                type="email"
                {...register(
                  "email",
                )}
                autoComplete="email"
                aria-invalid={
                  Boolean(
                    errors.email,
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
                  {
                    errors.email.message
                  }
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
                type="tel"
                {...register(
                  "phone",
                )}
                autoComplete="tel"
                aria-invalid={
                  Boolean(
                    errors.phone,
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
                  {
                    errors.phone.message
                  }
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
                type="text"
                {...register(
                  "address",
                )}
                autoComplete="street-address"
                aria-invalid={
                  Boolean(
                    errors.address,
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
                  {
                    errors.address.message
                  }
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
                type="text"
                {...register(
                  "city",
                )}
                autoComplete="address-level2"
                aria-invalid={
                  Boolean(
                    errors.city,
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
                  {
                    errors.city.message
                  }
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