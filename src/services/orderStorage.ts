import type {
  Order,
} from "../types/Order"

const ORDERS_KEY =
  "orders"

export const getOrders = (
  userId: number
): Order[] => {

  const storedOrders =
    localStorage.getItem(
      ORDERS_KEY
    )

  if (!storedOrders) {

    return []
  }

  try {

    const orders =
      JSON.parse(
        storedOrders
      ) as Order[]

    return orders.filter(
      (order) =>
        order.userId === userId
    )

  } catch {

    return []
  }
}

export const saveOrder = (
  order: Order
): void => {

  const orders =
    getAllOrders()

  const updatedOrders = [
    ...orders,
    order,
  ]

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(
      updatedOrders
    )
  )
}

const getAllOrders =
  (): Order[] => {

    const storedOrders =
      localStorage.getItem(
        ORDERS_KEY
      )

    if (!storedOrders) {

      return []
    }

    try {

      return JSON.parse(
        storedOrders
      ) as Order[]

    } catch {

      return []
    }
  }