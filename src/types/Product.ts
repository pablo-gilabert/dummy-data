import {
  z,
} from "zod"

import {
  ProductSchema,
} from "../schemas/ProductSchema"

export type Product = z.infer<
  typeof ProductSchema
>
