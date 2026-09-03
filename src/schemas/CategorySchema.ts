import {
  z,
} from "zod"

export const CategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
})