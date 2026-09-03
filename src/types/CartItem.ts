import {
  z,
} from "zod"

import {
  CartItemSchema,
} from "../schemas/CartItemSchema"

export type CartItem =
  z.infer<
    typeof CartItemSchema
  >
