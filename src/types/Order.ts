import type { CartItem } from "./CartItem"

export interface OrderCustomer {

  name: string

  email: string

  phone: string

  address: string

  city: string
}

export interface Order {

  id: string

  userId: number

  createdAt: string

  customer: OrderCustomer

  items: CartItem[]

  total: number
}