import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  useAuth,
} from "../../store/useAuth"

import {
  getOrders,
} from "../../services/orderStorage"

import type {
  Order,
} from "../../types/Order"

import styles from "./OrderConfirmation.module.css"

const OrderConfirmation = () => {

  const navigate =
    useNavigate()

  const {
    user,
  } = useAuth()

  const [
    order,
  ] = useState<Order | null>(() => {

    if (!user) {

      return null
    }

    const lastOrderId =
      localStorage.getItem(
        "lastOrderId"
      )

    if (!lastOrderId) {

      return null
    }

    const orders =
      getOrders(
        user.id
      )

    return (
      orders.find(
        (item) =>
          item.id === lastOrderId
      ) ?? null
    )
  })

  useEffect(() => {

    if (!order) {

      navigate(
        "/orders",
        {
          replace: true,
        }
      )
    }

  }, [
    order,
    navigate,
  ])

  if (!order) {

    return null
  }

  return (

    <main
      className={
        styles.confirmation
      }
    >

      <section
        className={styles.card}
      >

        <div
          className={styles.icon}
        >
          ✓
        </div>

        <h1
          className={styles.title}
        >
          Order placed successfully!
        </h1>

        <p
          className={styles.message}
        >
          Thank you for your purchase,
          {` ${order.customer.name}`}.
        </p>

        <div
          className={
            styles.orderInfo
          }
        >

          <div
            className={styles.row}
          >

            <span>
              Order ID
            </span>

            <span>
              {order.id}
            </span>

          </div>

          <div
            className={styles.row}
          >

            <span>
              Date
            </span>

            <span>
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </span>

          </div>

        </div>

        <div
          className={
            styles.products
          }
        >

          <h2>
            Your order
          </h2>

          {order.items.map(
            (item) => (

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
                    Quantity: {
                      item.quantity
                    }
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

            )
          )}

        </div>

        <div
          className={styles.total}
        >

          <span>
            Total
          </span>

          <strong>
            $ {order.total.toFixed(2)}
          </strong>

        </div>

        <button
          className={
            styles.productsButton
          }
          type="button"
          onClick={() => {
            navigate(
              "/products"
            )
          }}
        >
          Continue shopping
        </button>

      </section>

    </main>
  )
}

export default OrderConfirmation