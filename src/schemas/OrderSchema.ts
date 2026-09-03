import {
  z,
} from "zod"

import {
  CartItemSchema,
} from "./CartItemSchema"

export const OrderCustomerSchema =
  z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
  })

export const OrderSchema =
  z.object({
    id: z.string(),
    userId: z.number(),
    createdAt: z.string(),
    customer:
      OrderCustomerSchema,
    items: z.array(
      CartItemSchema,
    ),
    total: z.number(),
  })