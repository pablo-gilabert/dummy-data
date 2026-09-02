import {
  useQuery,
} from "@tanstack/react-query"

import {
  productQueries,
} from "../queries/products"

// Product detail uses the same centralized query definition as card prefetching,
// keeping cache identity and request behavior consistent across the application.
export const useProduct = (productId: number) => {
  return useQuery(
    productQueries.detail(productId),
  )
}