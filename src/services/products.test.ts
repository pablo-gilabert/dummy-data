import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  api,
} from "./api"

import {
  getCategories,
  getFilteredProducts,
  getProduct,
  getProducts,
  getProductsByCategory,
} from "./products"

import {
  CategorySchema,
} from "../schemas/CategorySchema"

import {
  ProductSchema,
} from "../schemas/ProductSchema"

import {
  ProductResponseSchema,
} from "../schemas/ProductResponseSchema"

import type {
  Product,
} from "../types/Product"

import type {
  ProductResponse,
} from "../types/ProductResponse"


vi.mock(
  "./api",
  () => ({
    api: vi.fn(),
  }),
)


const mockedApi =
  vi.mocked(api)


const createProduct = (
  overrides:
    Partial<Product> = {},
): Product => {
  return {
    id:
      1,

    title:
      "Test product",

    description:
      "Test product description",

    category:
      "laptops",

    price:
      100,

    discountPercentage:
      10,

    rating:
      4.5,

    stock:
      10,

    tags:
      [],

    brand:
      "Test brand",

    sku:
      "TEST-001",

    weight:
      1,

    dimensions: {
      width:
        10,

      height:
        10,

      depth:
        10,
    },

    warrantyInformation:
      "1 year warranty",

    shippingInformation:
      "Ships in 3 days",

    availabilityStatus:
      "In Stock",

    reviews:
      [],

    returnPolicy:
      "30 days return policy",

    minimumOrderQuantity:
      1,

    meta: {
      createdAt:
        "2026-01-01T00:00:00.000Z",

      updatedAt:
        "2026-01-01T00:00:00.000Z",

      barcode:
        "123456789",

      qrCode:
        "test-qr-code",
    },

    thumbnail:
      "https://example.com/product.jpg",

    images: [
      "https://example.com/product.jpg",
    ],

    ...overrides,
  }
}


const createProductResponse = (
  products:
    Product[] = [],
): ProductResponse => {
  return {
    products,

    total:
      products.length,

    skip:
      0,

    limit:
      products.length,
  }
}


describe(
  "products services",
  () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })


    describe(
      "getProducts",
      () => {
        it(
          "requests products with limit and skip",
          async () => {
            const response =
              createProductResponse()

            mockedApi.mockResolvedValue(
              response,
            )

            await getProducts({
              limit:
                10,

              skip:
                20,
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products?limit=10&skip=20",
              ProductResponseSchema,
            )
          },
        )


        it(
          "adds ascending price sorting parameters",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getProducts({
              limit:
                10,

              skip:
                0,

              sort:
                "price-asc",
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products?limit=10&skip=0&sortBy=price&order=asc",
              ProductResponseSchema,
            )
          },
        )


        it(
          "adds descending rating sorting parameters",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getProducts({
              limit:
                10,

              skip:
                0,

              sort:
                "rating-desc",
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products?limit=10&skip=0&sortBy=rating&order=desc",
              ProductResponseSchema,
            )
          },
        )
      },
    )


    describe(
      "getProduct",
      () => {
        it(
          "requests a product by id",
          async () => {
            const product =
              createProduct({
                id:
                  42,
              })

            mockedApi.mockResolvedValue(
              product,
            )

            const result =
              await getProduct(
                42,
              )

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/42",
              ProductSchema,
            )

            expect(
              result,
            ).toEqual(
              product,
            )
          },
        )
      },
    )


    describe(
      "getCategories",
      () => {
        it(
          "requests product categories",
          async () => {
            const categories = [
              {
                slug:
                  "laptops",

                name:
                  "Laptops",

                url:
                  "https://dummyjson.com/products/category/laptops",
              },
            ]

            mockedApi.mockResolvedValue(
              categories,
            )

            const result =
              await getCategories()

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/categories",
              CategorySchema.array(),
            )

            expect(
              result,
            ).toEqual(
              categories,
            )
          },
        )
      },
    )


    describe(
      "getProductsByCategory",
      () => {
        it(
          "requests products by category",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getProductsByCategory(
              "laptops",
              10,
              20,
            )

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/category/laptops?limit=10&skip=20",
              ProductResponseSchema,
            )
          },
        )


        it(
          "encodes the category",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getProductsByCategory(
              "mobile phones",
              10,
              0,
            )

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/category/mobile%20phones?limit=10&skip=0",
              ProductResponseSchema,
            )
          },
        )
      },
    )


    describe(
      "getFilteredProducts",
      () => {
        it(
          "uses the regular products endpoint without filters",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getFilteredProducts({
              limit:
                10,

              skip:
                20,
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products?limit=10&skip=20",
              ProductResponseSchema,
            )
          },
        )


        it(
          "uses the category endpoint when only a category is selected",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getFilteredProducts({
              category:
                "laptops",

              limit:
                10,

              skip:
                0,
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/category/laptops?limit=10&skip=0",
              ProductResponseSchema,
            )
          },
        )


        it(
          "uses the search endpoint when only a search query is provided",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getFilteredProducts({
              search:
                "laptop",

              limit:
                10,

              skip:
                0,
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/search?q=laptop&limit=0",
              ProductResponseSchema,
            )
          },
        )


        it(
          "applies search sorting locally instead of sending sort parameters to the API",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                price:
                  300,
              }),

              createProduct({
                id:
                  2,

                price:
                  100,
              }),

              createProduct({
                id:
                  3,

                price:
                  200,
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "product",

                limit:
                  10,

                skip:
                  0,

                sort:
                  "price-desc",
              })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/search?q=product&limit=0",
              ProductResponseSchema,
            )

            expect(
              result.products.map(
                (product) =>
                  product.price,
              ),
            ).toEqual([
              300,
              200,
              100,
            ])
          },
        )


        it(
          "passes sorting parameters to the category endpoint",
          async () => {
            mockedApi.mockResolvedValue(
              createProductResponse(),
            )

            await getFilteredProducts({
              category:
                "laptops",

              limit:
                10,

              skip:
                0,

              sort:
                "price-desc",
            })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/category/laptops?limit=10&skip=0&sortBy=price&order=desc",
              ProductResponseSchema,
            )
          },
        )


        it(
          "propagates API errors",
          async () => {
            const error =
              new Error(
                "Failed to fetch products",
              )

            mockedApi.mockRejectedValue(
              error,
            )

            await expect(
              getFilteredProducts({
                limit:
                  10,

                skip:
                  0,
              }),
            ).rejects.toThrow(
              "Failed to fetch products",
            )
          },
        )


        it(
          "loads all search results before applying category filtering and pagination",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                title:
                  "Laptop",

                category:
                  "laptops",
              }),

              createProduct({
                id:
                  2,

                title:
                  "Phone",

                category:
                  "smartphones",
              }),

              createProduct({
                id:
                  3,

                title:
                  "Laptop Pro",

                category:
                  "laptops",
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "laptop",

                category:
                  "laptops",

                limit:
                  1,

                skip:
                  1,
              })

            expect(
              mockedApi,
            ).toHaveBeenCalledWith(
              "/products/search?q=laptop&limit=0",
              ProductResponseSchema,
            )

            expect(
              result.products,
            ).toHaveLength(
              1,
            )

            expect(
              result.products[0].id,
            ).toBe(
              3,
            )

            expect(
              result.total,
            ).toBe(
              2,
            )

            expect(
              result.skip,
            ).toBe(
              1,
            )

            expect(
              result.limit,
            ).toBe(
              1,
            )
          },
        )


        it(
          "sorts searched products by price ascending",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                price:
                  300,
              }),

              createProduct({
                id:
                  2,

                price:
                  100,
              }),

              createProduct({
                id:
                  3,

                price:
                  200,
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "product",

                limit:
                  10,

                skip:
                  0,

                sort:
                  "price-asc",
              })

            expect(
              result.products.map(
                (product) =>
                  product.price,
              ),
            ).toEqual([
              100,
              200,
              300,
            ])
          },
        )


        it(
          "sorts searched products by rating descending",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                rating:
                  3,
              }),

              createProduct({
                id:
                  2,

                rating:
                  5,
              }),

              createProduct({
                id:
                  3,

                rating:
                  4,
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "product",

                limit:
                  10,

                skip:
                  0,

                sort:
                  "rating-desc",
              })

            expect(
              result.products.map(
                (product) =>
                  product.rating,
              ),
            ).toEqual([
              5,
              4,
              3,
            ])
          },
        )


        it(
          "sorts searched products by title ascending",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                title:
                  "Zebra",
              }),

              createProduct({
                id:
                  2,

                title:
                  "Apple",
              }),

              createProduct({
                id:
                  3,

                title:
                  "Laptop",
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "product",

                limit:
                  10,

                skip:
                  0,

                sort:
                  "title-asc",
              })

            expect(
              result.products.map(
                (product) =>
                  product.title,
              ),
            ).toEqual([
              "Apple",
              "Laptop",
              "Zebra",
            ])
          },
        )


        it(
          "sorts searched products by title descending",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                title:
                  "Apple",
              }),

              createProduct({
                id:
                  2,

                title:
                  "Zebra",
              }),

              createProduct({
                id:
                  3,

                title:
                  "Laptop",
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "product",

                limit:
                  10,

                skip:
                  0,

                sort:
                  "title-desc",
              })

            expect(
              result.products.map(
                (product) =>
                  product.title,
              ),
            ).toEqual([
              "Zebra",
              "Laptop",
              "Apple",
            ])
          },
        )


        it(
          "preserves pagination after filtering and sorting",
          async () => {
            const products = [
              createProduct({
                id:
                  1,

                price:
                  500,
              }),

              createProduct({
                id:
                  2,

                price:
                  100,
              }),

              createProduct({
                id:
                  3,

                price:
                  300,
              }),

              createProduct({
                id:
                  4,

                price:
                  200,
              }),
            ]

            mockedApi.mockResolvedValue(
              createProductResponse(
                products,
              ),
            )

            const result =
              await getFilteredProducts({
                search:
                  "product",

                limit:
                  2,

                skip:
                  1,

                sort:
                  "price-asc",
              })

            expect(
              result.products.map(
                (product) =>
                  product.price,
              ),
            ).toEqual([
              200,
              300,
            ])

            expect(
              result.total,
            ).toBe(
              4,
            )
          },
        )
      },
    )
  },
)