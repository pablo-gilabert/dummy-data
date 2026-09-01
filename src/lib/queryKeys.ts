import type {
  ProductSort,
} from "../services/products"


export const queryKeys = {

  products: {

    all: [
      "products",
    ] as const,

    list: (
      search: string,
      category: string,
      sort: ProductSort,
      page: number
    ) => [
      "products",
      "list",
      search,
      category,
      sort,
      page,
    ] as const,

    detail: (
      id: number
    ) => [
      "products",
      "detail",
      id,
    ] as const,

    categories: () => [
      "products",
      "categories",
    ] as const,

  },

}