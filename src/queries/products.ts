import {
  queryOptions,
} from "@tanstack/react-query"

import {
  getCategories,
  getFilteredProducts,
  getProduct,
} from "../services/products"

import type {
  ProductSort,
} from "../types/ProductSort"

import {
  queryKeys,
} from "../lib/queryKeys"

// Keeps query configuration close to the service it uses while allowing
// components and prefetching to reuse exactly the same query definitions.
export const productQueries = {
  list: (
    search: string,
    category: string,
    sort: ProductSort,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit

    return queryOptions({
      queryKey: queryKeys.products.list(
        search,
        category,
        sort,
        page,
      ),
      queryFn: () =>
        getFilteredProducts({
          search,
          category,
          limit,
          skip,
          sort,
        }),
      // Keeps the previous page visible while the next page is requested.
      placeholderData: (previousData) => previousData,
    })
  },

  detail: (productId: number) =>
    queryOptions({
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => getProduct(productId),
      // Prevents invalid product IDs from triggering API requests.
      enabled:
        Number.isInteger(productId) &&
        productId > 0,
    }),

  categories: () =>
    queryOptions({
      queryKey: queryKeys.products.categories(),
      queryFn: getCategories,
    }),
}
