import {
  z,
} from "zod"

import {
  ProductSchema,
} from "./ProductSchema"

export const ProductResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})