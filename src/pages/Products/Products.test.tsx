import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import {
  MemoryRouter,
} from "react-router-dom"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import Products from "./Products"

import {
  ApiError,
} from "../../services/api"

vi.mock(
  "../../services/products",
  () => ({
    getCategories: vi.fn(),
    getFilteredProducts: vi.fn(),
  })
)

import {
  getCategories,
  getFilteredProducts,
} from "../../services/products"

const mockedGetCategories =
  vi.mocked(getCategories)

const mockedGetFilteredProducts =
  vi.mocked(getFilteredProducts)

const mockProduct = {
  id: 1,
  title: "Test product",
  description:
    "Test description",
  category: "laptops",
  price: 999,
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  tags: [],
  brand: "Test brand",
  sku: "TEST-001",
  weight: 1,

  dimensions: {
    width: 10,
    height: 10,
    depth: 10,
  },

  warrantyInformation:
    "1 year warranty",

  shippingInformation:
    "Ships in 3 days",

  availabilityStatus:
    "In Stock",

  reviews: [],

  returnPolicy:
    "30 days return policy",

  minimumOrderQuantity: 1,

  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",

    updatedAt:
      "2026-01-01T00:00:00.000Z",

    barcode: "123456789",

    qrCode:
      "test-qr-code",
  },

  thumbnail:
    "https://example.com/product.jpg",

  images: [
    "https://example.com/product.jpg",
  ],
}

const mockCategories = [
  {
    slug: "laptops",
    name: "Laptops",
    url:
      "https://example.com/laptops",
  },
]

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderProducts = (
  initialEntry = "/products"
) => {

  const queryClient =
    createQueryClient()

  return render(
    <QueryClientProvider
      client={queryClient}
    >
      <MemoryRouter
        initialEntries={[
          initialEntry,
        ]}
      >
        <Products />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const waitForProductsToLoad =
  async () => {

    expect(
      await screen.findByText(
        "Test product"
      )
    ).toBeInTheDocument()
  }

describe("Products", () => {

  beforeEach(() => {

    vi.clearAllMocks()

    mockedGetFilteredProducts
      .mockResolvedValue({
        products: [
          mockProduct,
        ],

        total: 1,

        skip: 0,

        limit: 12,
      })

    mockedGetCategories
      .mockResolvedValue(
        mockCategories
      )
  })

  it(
    "renders the products",
    async () => {

      renderProducts()

      await waitForProductsToLoad()

      expect(
        screen.getByText(
          "1 products"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Laptops",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows the search input",
    async () => {

      renderProducts()

      await waitForProductsToLoad()

      expect(
        screen.getByRole(
          "searchbox"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Search",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows the sorting control",
    async () => {

      renderProducts()

      await waitForProductsToLoad()

      const sortSelect =
        screen.getByLabelText(
          "Sort by:"
        )

      expect(
        sortSelect
      ).toBeInTheDocument()

      expect(
        sortSelect
      ).toHaveValue("")
    }
  )

  it(
    "searches products using the submitted search",
    async () => {

      const user =
        userEvent.setup()

      renderProducts()

      await waitForProductsToLoad()

      const searchInput =
        screen.getByRole(
          "searchbox"
        )

      await user.type(
        searchInput,
        "laptop"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Search",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "",
          limit: 12,
          skip: 0,
          sort: "",
        })

      })
    }
  )

  it(
    "submits search while preserving category and sort",
    async () => {

      const user =
        userEvent.setup()

      renderProducts(
        "/products?category=laptops&sort=price-desc&page=3"
      )

      await waitForProductsToLoad()

      const searchInput =
        screen.getByRole(
          "searchbox"
        )

      await user.type(
        searchInput,
        "laptop"
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Search",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "laptops",
          limit: 12,
          skip: 0,
          sort: "price-desc",
        })

      })
    }
  )

  it(
    "filters products by category",
    async () => {

      const user =
        userEvent.setup()

      renderProducts(
        "/products?search=laptop&page=3"
      )

      await waitForProductsToLoad()

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Laptops",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "laptops",
          limit: 12,
          skip: 0,
          sort: "",
        })

      })
    }
  )

  it(
    "changes category while preserving search and sort",
    async () => {

      const user =
        userEvent.setup()

      mockedGetCategories
        .mockResolvedValue([
          {
            slug: "laptops",
            name: "Laptops",
            url:
              "https://example.com/laptops",
          },

          {
            slug: "smartphones",
            name: "Smartphones",
            url:
              "https://example.com/smartphones",
          },
        ])

      renderProducts(
        "/products?search=laptop&sort=rating-desc&page=3"
      )

      await waitForProductsToLoad()

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Smartphones",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "smartphones",
          limit: 12,
          skip: 0,
          sort: "rating-desc",
        })

      })
    }
  )

  it(
    "sorts products by price ascending",
    async () => {

      const user =
        userEvent.setup()

      renderProducts(
        "/products?search=laptop&category=laptops&page=3"
      )

      await waitForProductsToLoad()

      const sortSelect =
        screen.getByLabelText(
          "Sort by:"
        )

      await user.selectOptions(
        sortSelect,
        "price-asc"
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "laptops",
          limit: 12,
          skip: 0,
          sort: "price-asc",
        })

      })
    }
  )

  it(
    "changes sort while preserving search and category",
    async () => {

      const user =
        userEvent.setup()

      renderProducts(
        "/products?search=laptop&category=laptops&page=2"
      )

      await waitForProductsToLoad()

      const sortSelect =
        screen.getByLabelText(
          "Sort by:"
        )

      await user.selectOptions(
        sortSelect,
        "title-desc"
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "laptops",
          limit: 12,
          skip: 0,
          sort: "title-desc",
        })

      })
    }
  )

  it(
    "clears the search while preserving category and sort",
    async () => {

      const user =
        userEvent.setup()

      renderProducts(
        "/products?search=laptop&category=laptops&sort=price-asc&page=3"
      )

      await waitForProductsToLoad()

      expect(
        screen.getByRole(
          "button",
          {
            name: "Clear",
          }
        )
      ).toBeInTheDocument()

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "Clear",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "",
          category: "laptops",
          limit: 12,
          skip: 0,
          sort: "price-asc",
        })

      })
    }
  )

  it(
    "clears the category while preserving search and sort",
    async () => {

      const user =
        userEvent.setup()

      renderProducts(
        "/products?search=laptop&category=laptops&sort=price-desc&page=3"
      )

      await waitForProductsToLoad()

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "All",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "",
          limit: 12,
          skip: 0,
          sort: "price-desc",
        })

      })
    }
  )

  it(
    "moves to the next page",
    async () => {

      const user =
        userEvent.setup()

      mockedGetFilteredProducts
        .mockResolvedValue({
          products: [
            mockProduct,
          ],

          total: 24,

          skip: 0,

          limit: 12,
        })

      renderProducts()

      await waitForProductsToLoad()

      const nextButton =
        screen.getByRole(
          "button",
          {
            name: "NEXT",
          }
        )

      expect(
        nextButton
      ).toBeEnabled()

      await user.click(
        nextButton
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "",
          category: "",
          limit: 12,
          skip: 12,
          sort: "",
        })

      })
    }
  )

  it(
    "changes page while preserving search, category and sort",
    async () => {

      const user =
        userEvent.setup()

      mockedGetFilteredProducts
        .mockResolvedValue({
          products: [
            mockProduct,
          ],

          total: 36,

          skip: 0,

          limit: 12,
        })

      renderProducts(
        "/products?search=laptop&category=laptops&sort=price-asc&page=1"
      )

      await waitForProductsToLoad()

      await user.click(
        screen.getByRole(
          "button",
          {
            name: "NEXT",
          }
        )
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "laptop",
          category: "laptops",
          limit: 12,
          skip: 12,
          sort: "price-asc",
        })

      })
    }
  )

  it(
    "moves to the previous page",
    async () => {

      const user =
        userEvent.setup()

      mockedGetFilteredProducts
        .mockResolvedValue({
          products: [
            mockProduct,
          ],

          total: 24,

          skip: 12,

          limit: 12,
        })

      renderProducts(
        "/products?page=2"
      )

      await waitForProductsToLoad()

      const previousButton =
        screen.getByRole(
          "button",
          {
            name: "PREVIOUS",
          }
        )

      expect(
        previousButton
      ).toBeEnabled()

      await user.click(
        previousButton
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "",
          category: "",
          limit: 12,
          skip: 0,
          sort: "",
        })

      })
    }
  )

  it(
    "disables previous page on the first page",
    async () => {

      mockedGetFilteredProducts
        .mockResolvedValue({
          products: [
            mockProduct,
          ],

          total: 24,

          skip: 0,

          limit: 12,
        })

      renderProducts()

      await waitForProductsToLoad()

      expect(
        screen.getByRole(
          "button",
          {
            name: "PREVIOUS",
          }
        )
      ).toBeDisabled()
    }
  )

  it(
    "disables next page on the last page",
    async () => {

      mockedGetFilteredProducts
        .mockResolvedValue({
          products: [
            mockProduct,
          ],

          total: 24,

          skip: 12,

          limit: 12,
        })

      renderProducts(
        "/products?page=2"
      )

      await waitForProductsToLoad()

      expect(
        screen.getByRole(
          "button",
          {
            name: "NEXT",
          }
        )
      ).toBeDisabled()
    }
  )

  it(
    "uses page 1 when the URL contains an invalid page",
    async () => {

      renderProducts(
        "/products?page=0"
      )

      await waitForProductsToLoad()

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "",
          category: "",
          limit: 12,
          skip: 0,
          sort: "",
        })

      })

    }
  )

  it(
    "shows the loading state while products are loading",
    async () => {

      let resolveRequest:
        (
          value: {
            products: typeof mockProduct[]
            total: number
            skip: number
            limit: number
          }
        ) => void

      const request =
        new Promise(
          (resolve) => {

            resolveRequest =
              resolve

          }
        )

      mockedGetFilteredProducts
        .mockReturnValue(
          request as ReturnType<
            typeof getFilteredProducts
          >
        )

      renderProducts()

      expect(
        screen.getByText(
          "Loading products..."
        )
      ).toBeInTheDocument()

      resolveRequest!({
        products: [
          mockProduct,
        ],

        total: 1,

        skip: 0,

        limit: 12,
      })

      await waitForProductsToLoad()
    }
  )

  it(
    "shows the error state when products fail to load",
    async () => {

      mockedGetFilteredProducts
        .mockRejectedValue(
          new ApiError(
            "Unable to load products.",
            500,
            "Internal Server Error"
          )
        )

      renderProducts()

      expect(
        await screen.findByText(
          "Server error"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Error 500"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Unable to load products."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows the empty state when no products are found",
    async () => {

      mockedGetFilteredProducts
        .mockResolvedValue({
          products: [],
          total: 0,
          skip: 0,
          limit: 12,
        })

      renderProducts()

      expect(
        await screen.findByText(
          "No products found"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "Try another search or category."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "shows the category loading state",
    async () => {

      let resolveCategories:
        (
          value: typeof mockCategories
        ) => void

      const categoriesRequest =
        new Promise(
          (resolve) => {

            resolveCategories =
              resolve

          }
        )

      mockedGetCategories
        .mockReturnValue(
          categoriesRequest as ReturnType<
            typeof getCategories
          >
        )

      renderProducts()

      await waitForProductsToLoad()

      expect(
        screen.getByText(
          "Loading categories..."
        )
      ).toBeInTheDocument()

      resolveCategories!(
        mockCategories
      )

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "Laptops",
            }
          )
        ).toBeInTheDocument()

      })
    }
  )

  it(
    "shows the category error state",
    async () => {

      mockedGetCategories
        .mockRejectedValue(
          new Error(
            "Unable to load categories."
          )
        )

      renderProducts()

      await waitForProductsToLoad()

      expect(
        await screen.findByText(
          "Failed to load categories."
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "sorts products by rating descending",
    async () => {

      const user =
        userEvent.setup()

      renderProducts()

      await waitForProductsToLoad()

      const sortSelect =
        screen.getByLabelText(
          "Sort by:"
        )

      await user.selectOptions(
        sortSelect,
        "rating-desc"
      )

      await waitFor(() => {

        expect(
          mockedGetFilteredProducts
        ).toHaveBeenLastCalledWith({
          search: "",
          category: "",
          limit: 12,
          skip: 0,
          sort: "rating-desc",
        })

      })
    }
  )
})