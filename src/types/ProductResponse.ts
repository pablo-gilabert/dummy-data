import {
  z,
} from "zod"

import {
  ProductResponseSchema,
} from "../schemas/ProductResponseSchema"

export type ProductResponse = z.infer<
  typeof ProductResponseSchema
>
