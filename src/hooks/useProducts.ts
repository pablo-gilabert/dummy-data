import {
  useQuery,
} from "@tanstack/react-query"

import type {
  ProductSort,
} from "../types/ProductSort"

import {
  productQueries,
} from "../queries/products"

interface UseProductsParams {
  search: string
  category: string
  sort: ProductSort
  page: number
  limit: number
}

// Exposes product list and category server state to the page without coupling
// the page to TanStack Query's query-key and query-function details.
export const useProducts = ({
  search,
  category,
  sort,
  page,
  limit,
}: UseProductsParams) => {
  const productsQuery = useQuery(
    productQueries.list(
      search,
      category,
      sort,
      page,
      limit,
    ),
  )

  const categoriesQuery = useQuery(
    productQueries.categories(),
  )

  return {
    productsQuery,
    categoriesQuery,
  }
}
