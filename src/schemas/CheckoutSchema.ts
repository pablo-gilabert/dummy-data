import {
  z,
} from "zod"

export const CheckoutSchema =
  z.object({
    name: z.string().trim().min(
      1,
      "Please enter your full name.",
    ),

    email: z.string().trim().min(
      1,
      "Please enter your email.",
    ).email(
      "Please enter a valid email.",
    ),

    phone: z.string().trim().min(
      1,
      "Please enter your phone number.",
    ),

    address: z.string().trim().min(
      1,
      "Please enter your address.",
    ),

    city: z.string().trim().min(
      1,
      "Please enter your city.",
    ),
  })

export type CheckoutFormData =
  z.infer<
    typeof CheckoutSchema
  >