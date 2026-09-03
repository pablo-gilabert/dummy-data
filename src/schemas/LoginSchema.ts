import {
  z,
} from "zod"

export const LoginSchema =
  z.object({
    username: z.string().trim().min(
      1,
      "Username is required.",
    ),
    password: z.string().min(
      1,
      "Password is required.",
    ),
  })

export type LoginFormData =
  z.infer<
    typeof LoginSchema
  >