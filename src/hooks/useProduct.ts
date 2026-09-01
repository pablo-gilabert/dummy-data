import {
  useQuery,
} from "@tanstack/react-query"

import {
  productQueries,
} from "../queries/products"


export const useProduct = (
  productId: number
) => {

  return useQuery(
    productQueries.detail(
      productId
    )
  )

}