import {
  z,
} from "zod"

export const ProductSortSchema =
  z.enum([
    "",
    "price-asc",
    "price-desc",
    "rating-desc",
    "rating-asc",
    "title-asc",
    "title-desc",
  ])