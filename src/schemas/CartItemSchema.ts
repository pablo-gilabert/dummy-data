import {
  z,
} from "zod"

import {
  ProductSchema,
} from "./ProductSchema"

export const CartItemSchema =
  z.object({
    product: ProductSchema,
    quantity: z.number(),
  })