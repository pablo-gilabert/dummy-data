import {
  z,
} from "zod"

import {
  ProductSortSchema,
} from "../schemas/ProductSortSchema"

export type ProductSort =
  z.infer<
    typeof ProductSortSchema
  >