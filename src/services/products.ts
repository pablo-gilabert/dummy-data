import type { Category } from "../types/Category"
import type { Product } from "../types/Product"
import type { ProductResponse } from "../types/ProductResponse"

import { api } from "./api"

export type ProductSort =
  | ""
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc"
  | "title-asc"
  | "title-desc"

interface FetchProductsParams {
  limit: number
  skip: number
  sort?: ProductSort
}

const getSortParams = (sort: ProductSort) => {

  switch (sort) {

    case "price-asc":
      return {
        sortBy: "price",
        order: "asc",
      }

    case "price-desc":
      return {
        sortBy: "price",
        order: "desc",
      }

    case "rating-desc":
      return {
        sortBy: "rating",
        order: "desc",
      }

    case "rating-asc":
      return {
        sortBy: "rating",
        order: "asc",
      }

    case "title-asc":
      return {
        sortBy: "title",
        order: "asc",
      }

    case "title-desc":
      return {
        sortBy: "title",
        order: "desc",
      }

    default:
      return {}
  }
}

export const getProducts = async ({
  limit,
  skip,
  sort = "",
}: FetchProductsParams): Promise<ProductResponse> => {

  const sortParams = getSortParams(sort)

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  })

  if (sortParams.sortBy) {
    params.set(
      "sortBy",
      sortParams.sortBy
    )
  }

  if (sortParams.order) {
    params.set(
      "order",
      sortParams.order
    )
  }

  return api<ProductResponse>(
    `/products?${params.toString()}`
  )
}

export const getProduct = async (
  id: number
): Promise<Product> => {

  return api<Product>(
    `/products/${id}`
  )
}

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  sort: ProductSort = ""
): Promise<ProductResponse> => {

  const sortParams = getSortParams(sort)

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    skip: String(skip),
  })

  if (sortParams.sortBy) {
    params.set(
      "sortBy",
      sortParams.sortBy
    )
  }

  if (sortParams.order) {
    params.set(
      "order",
      sortParams.order
    )
  }

  return api<ProductResponse>(
    `/products/search?${params.toString()}`
  )
}

export const getCategories = async (): Promise<Category[]> => {

  return api<Category[]>(
    "/products/categories"
  )
}

export const getProductsByCategory = async (
  category: string,
  limit: number,
  skip: number,
  sort: ProductSort = ""
): Promise<ProductResponse> => {

  const sortParams = getSortParams(sort)

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  })

  if (sortParams.sortBy) {
    params.set(
      "sortBy",
      sortParams.sortBy
    )
  }

  if (sortParams.order) {
    params.set(
      "order",
      sortParams.order
    )
  }

  return api<ProductResponse>(
    `/products/category/${encodeURIComponent(category)}?${params.toString()}`
  )
}

interface GetFilteredProductsParams {
  search?: string
  category?: string
  limit: number
  skip: number
  sort?: ProductSort
}

export const getFilteredProducts = async ({
  search = "",
  category = "",
  limit,
  skip,
  sort = "",
}: GetFilteredProductsParams): Promise<ProductResponse> => {

  const sortParams = getSortParams(sort)

  /*
   * When there is a search query, DummyJSON provides
   * the search endpoint. We request all matching products
   * so we can apply the category filter before pagination.
   */
  if (search) {

    const searchParams = new URLSearchParams({
      q: search,
      limit: "0",
    })

    const searchResponse = await api<ProductResponse>(
      `/products/search?${searchParams.toString()}`
    )

    let products = searchResponse.products

    /*
     * DummyJSON does not provide a combined
     * search + category endpoint, so the category
     * filter is applied on the client.
     */
    if (category) {

      products = products.filter(
        (product) =>
          product.category === category
      )
    }

    /*
     * Apply sorting after filtering so the
     * sorting is global across the results.
     */
    if (sortParams.sortBy && sortParams.order) {

      products = [...products].sort(
        (a, b) => {

          const field =
            sortParams.sortBy as keyof Product

          const valueA = a[field]
          const valueB = b[field]

          if (
            typeof valueA === "number" &&
            typeof valueB === "number"
          ) {
            return sortParams.order === "asc"
              ? valueA - valueB
              : valueB - valueA
          }

          if (
            typeof valueA === "string" &&
            typeof valueB === "string"
          ) {
            return sortParams.order === "asc"
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA)
          }

          return 0
        }
      )
    }

    const total = products.length

    const paginatedProducts =
      products.slice(
        skip,
        skip + limit
      )

    return {
      products: paginatedProducts,
      total,
      skip,
      limit,
    }
  }

  /*
   * Without a search query, use the category
   * endpoint when a category is selected.
   */
  if (category) {

    return getProductsByCategory(
      category,
      limit,
      skip,
      sort
    )
  }

  /*
   * Without search or category, use the
   * regular products endpoint.
   */
  return getProducts({
    limit,
    skip,
    sort,
  })
}