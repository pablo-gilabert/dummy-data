import {
  z,
} from "zod"

import {
  OrderCustomerSchema,
  OrderSchema,
} from "../schemas/OrderSchema"

export type OrderCustomer =
  z.infer<
    typeof OrderCustomerSchema
  >

export type Order =
  z.infer<
    typeof OrderSchema
  >
