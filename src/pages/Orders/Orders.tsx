import {
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  useAuth,
} from "../../store/useAuth"

import type {
  Order,
} from "../../types/Order"

import {
  getOrders,
} from "../../services/orderStorage"

import styles from "./Orders.module.css"

const Orders = () => {

  const {
    user,
  } = useAuth()

  const [
    orders,
  ] = useState<Order[]>(() => {

    if (!user) {

      return []
    }

    return getOrders(
      user.id
    )
  })

  const navigate =
    useNavigate()

  const handleViewOrder = (
    orderId: string
  ) => {

    navigate(
      `/orders/${orderId}`
    )
  }

  return (

    <main
      className={styles.orders}
    >

      <h1
        className={styles.title}
      >
        Orders
      </h1>

      {orders.length === 0 ? (

        <section
          className={styles.empty}
        >

          <h2>
            No orders yet
          </h2>

          <p>
            Your completed orders
            will appear here.
          </p>

          <button
            className={styles.button}
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
          >
            Start shopping
          </button>

        </section>

      ) : (

        <section
          className={styles.list}
        >

          {[
            ...orders,
          ]
            .reverse()
            .map((order) => {

              const totalItems =
                order.items.reduce(
                  (
                    total,
                    item
                  ) =>
                    total +
                    item.quantity,
                  0
                )

              return (

                <article
                  className={
                    styles.card
                  }
                  key={
                    order.id
                  }
                >

                  <div
                    className={
                      styles.cardHeader
                    }
                  >

                    <h2>
                      Order #
                      {order.id}
                    </h2>

                    <span>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <div
                    className={
                      styles.cardBody
                    }
                  >

                    <p>
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "items"}
                    </p>

                    <p
                      className={
                        styles.total
                      }
                    >
                      $
                      {order.total.toFixed(
                        2
                      )}
                    </p>

                  </div>

                  <button
                    className={
                      styles.viewButton
                    }
                    type="button"
                    onClick={() =>
                      handleViewOrder(
                        order.id
                      )
                    }
                  >
                    View order
                  </button>

                </article>
              )
            })}

        </section>
      )}

    </main>
  )
}

export default Orders