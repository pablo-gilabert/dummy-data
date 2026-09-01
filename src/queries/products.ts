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
} from "../services/products"

import {
  queryKeys,
} from "../lib/queryKeys"


export const productQueries = {

  list: (
    search: string,
    category: string,
    sort: ProductSort,
    page: number,
    limit: number
  ) => {

    const skip =
      (page - 1) * limit

    return queryOptions({

      queryKey:
        queryKeys.products.list(
          search,
          category,
          sort,
          page
        ),

      queryFn: () =>
        getFilteredProducts({
          search,
          category,
          limit,
          skip,
          sort,
        }),

      placeholderData:
        (
          previousData
        ) => previousData,

    })
  },


  detail: (
    productId: number
  ) =>
    queryOptions({

      queryKey:
        queryKeys.products.detail(
          productId
        ),

      queryFn: () =>
        getProduct(productId),

      enabled:
        Number.isInteger(productId) &&
        productId > 0,

    }),


  categories:
    () =>
      queryOptions({

        queryKey:
          queryKeys.products.categories(),

        queryFn:
          getCategories,

      }),

}