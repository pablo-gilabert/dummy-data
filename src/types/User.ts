import {
  z,
} from "zod"

import {
  UserSchema,
} from "../schemas/UserSchema"

export type User = z.infer<
  typeof UserSchema
>