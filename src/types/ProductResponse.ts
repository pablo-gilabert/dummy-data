import type { Product } from "./Product"

export interface ProductResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}