import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"

import type {
  Order,
} from "../types/Order"

import {
  getOrders,
  saveOrder,
} from "./orderStorage"

const createOrder = (
  id: string,
  userId: number
): Order => ({
  id,
  userId,
  createdAt:
    "2026-01-01T00:00:00.000Z",
  customer: {
    name: "Test User",
    email: "test@example.com",
    phone: "123456789",
    address: "Test Address",
    city: "Test City",
  },
  items: [],
  total: 100,
})

describe("orderStorage", () => {

  beforeEach(() => {
    localStorage.clear()
  })

  it("returns an empty array when there are no orders", () => {

    expect(
      getOrders(1)
    ).toEqual([])
  })

  it("saves and retrieves an order", () => {

    const order =
      createOrder(
        "order-1",
        1
      )

    saveOrder(order)

    expect(
      getOrders(1)
    ).toEqual([
      order,
    ])
  })

  it("returns only orders belonging to the requested user", () => {

    const userOneOrder =
      createOrder(
        "order-1",
        1
      )

    const userTwoOrder =
      createOrder(
        "order-2",
        2
      )

    saveOrder(userOneOrder)
    saveOrder(userTwoOrder)

    expect(
      getOrders(1)
    ).toEqual([
      userOneOrder,
    ])

    expect(
      getOrders(2)
    ).toEqual([
      userTwoOrder,
    ])
  })

  it("keeps multiple orders for the same user", () => {

    const firstOrder =
      createOrder(
        "order-1",
        1
      )

    const secondOrder =
      createOrder(
        "order-2",
        1
      )

    saveOrder(firstOrder)
    saveOrder(secondOrder)

    expect(
      getOrders(1)
    ).toEqual([
      firstOrder,
      secondOrder,
    ])
  })

  it("returns an empty array when stored orders are invalid", () => {

    localStorage.setItem(
      "orders",
      "{invalid json"
    )

    expect(
      getOrders(1)
    ).toEqual([])
  })

  it("returns an empty array when stored orders are not an array", () => {

    localStorage.setItem(
      "orders",
      JSON.stringify({
        invalid: true,
      })
    )

    expect(
      getOrders(1)
    ).toEqual([])
  })

  it("starts with a new order when stored orders are invalid", () => {

    localStorage.setItem(
      "orders",
      "{invalid json"
    )

    const order =
      createOrder(
        "order-1",
        1
      )

    saveOrder(order)

    expect(
      getOrders(1)
    ).toEqual([
      order,
    ])
  })

  it("saves a new order alongside existing orders", () => {

    const firstOrder =
      createOrder(
        "order-1",
        1
      )

    const secondOrder =
      createOrder(
        "order-2",
        2
      )

    saveOrder(firstOrder)
    saveOrder(secondOrder)

    expect(
      getOrders(1)
    ).toEqual([
      firstOrder,
    ])

    expect(
      getOrders(2)
    ).toEqual([
      secondOrder,
    ])

    expect(
      JSON.parse(
        localStorage.getItem(
          "orders"
        ) ?? "[]"
      )
    ).toEqual([
      firstOrder,
      secondOrder,
    ])
  })

})