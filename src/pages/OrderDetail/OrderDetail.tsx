import {
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  useAuth,
} from "../../AuthContext/useAuth"

import {
  getOrders,
} from "../../services/orderStorage"

import type {
  Order,
} from "../../types/Order"

import styles from "./OrderDetail.module.css"

const OrderDetail = () => {

  const {
    orderId,
  } = useParams<{
    orderId: string
  }>()

  const navigate =
    useNavigate()

  const {
    user,
  } = useAuth()

  const [
    order,
  ] = useState<Order | null>(() => {

    if (
      !user ||
      !orderId
    ) {

      return null
    }

    const orders =
      getOrders(
        user.id
      )

    return (
      orders.find(
        (item) =>
          item.id === orderId
      ) ?? null
    )
  })

  if (!order) {

    return (

      <main
        className={
          styles.orderDetail
        }
      >

        <section
          className={
            styles.notFound
          }
        >

          <h1>
            Order not found
          </h1>

          <p>
            The order you are looking
            for does not exist.
          </p>

          <button
            className={
              styles.button
            }
            type="button"
            onClick={() =>
              navigate(
                "/orders"
              )
            }
          >
            Back to orders
          </button>

        </section>

      </main>
    )
  }

  return (

    <main
      className={
        styles.orderDetail
      }
    >

      <button
        className={
          styles.backButton
        }
        type="button"
        onClick={() =>
          navigate(
            "/orders"
          )
        }
      >
        ← Back to orders
      </button>

      <section
        className={styles.header}
      >

        <div>

          <h1
            className={
              styles.title
            }
          >
            Order #{order.id}
          </h1>

          <p
            className={
              styles.date
            }
          >
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </p>

        </div>

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

      </section>

      <section
        className={
          styles.customer
        }
      >

        <h2>
          Customer information
        </h2>

        <div
          className={
            styles.customerGrid
          }
        >

          <div>

            <span>
              Name
            </span>

            <strong>
              {order.customer.name}
            </strong>

          </div>

          <div>

            <span>
              Email
            </span>

            <strong>
              {order.customer.email}
            </strong>

          </div>

          <div>

            <span>
              Phone
            </span>

            <strong>
              {order.customer.phone}
            </strong>

          </div>

          <div>

            <span>
              Address
            </span>

            <strong>
              {order.customer.address}
            </strong>

          </div>

          <div>

            <span>
              City
            </span>

            <strong>
              {order.customer.city}
            </strong>

          </div>

        </div>

      </section>

      <section
        className={styles.items}
      >

        <h2>
          Order details
        </h2>

        <div
          className={
            styles.itemList
          }
        >

          {order.items.map(
            (item) => {

              const subtotal =
                item.product.price *
                item.quantity

              return (

                <article
                  className={
                    styles.item
                  }
                  key={
                    item.product.id
                  }
                >

                  <img
                    className={
                      styles.image
                    }
                    src={
                      item.product.thumbnail
                    }
                    alt={
                      item.product.title
                    }
                  />

                  <div
                    className={
                      styles.itemInfo
                    }
                  >

                    <h3>
                      {item.product.title}
                    </h3>

                    <p>
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                    <p>
                      $
                      {item.product.price.toFixed(
                        2
                      )}{" "}
                      each
                    </p>

                  </div>

                  <strong
                    className={
                      styles.itemSubtotal
                    }
                  >
                    $
                    {subtotal.toFixed(
                      2
                    )}
                  </strong>

                </article>

              )
            }
          )}

        </div>

      </section>

      <section
        className={
          styles.summary
        }
      >

        <div
          className={
            styles.summaryRow
          }
        >

          <span>
            Items
          </span>

          <span>
            {order.items.reduce(
              (
                total,
                item
              ) =>
                total +
                item.quantity,
              0
            )}
          </span>

        </div>

        <div
          className={
            styles.summaryTotal
          }
        >

          <span>
            Total
          </span>

          <span>
            $
            {order.total.toFixed(
              2
            )}
          </span>

        </div>

      </section>

    </main>
  )
}

export default OrderDetail