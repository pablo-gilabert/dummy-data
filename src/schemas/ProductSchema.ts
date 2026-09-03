import {
  z,
} from "zod"

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),

  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }),

  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),

  reviews: z.array(
    z.object({
      rating: z.number(),
      comment: z.string(),
      date: z.string(),
      reviewerName: z.string(),
      reviewerEmail: z.string(),
    }),
  ),

  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),

  meta: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    barcode: z.string(),
    qrCode: z.string(),
  }),

  images: z.array(z.string()),
  thumbnail: z.string(),
})