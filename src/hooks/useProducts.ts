import {
  useQuery,
} from "@tanstack/react-query"

import type {
  ProductSort,
} from "../services/products"

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


export const useProducts = ({
  search,
  category,
  sort,
  page,
  limit,
}: UseProductsParams) => {

  const productsQuery =
    useQuery(
      productQueries.list(
        search,
        category,
        sort,
        page,
        limit
      )
    )


  const categoriesQuery =
    useQuery(
      productQueries.categories()
    )


  return {

    productsQuery,

    categoriesQuery,

  }

}