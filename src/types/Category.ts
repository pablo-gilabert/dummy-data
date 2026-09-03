import {
  z,
} from "zod"

import {
  CategorySchema,
} from "../schemas/CategorySchema"

export type Category = z.infer<
  typeof CategorySchema
>
