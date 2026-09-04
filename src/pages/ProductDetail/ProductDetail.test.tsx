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
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import ProductDetail from "./ProductDetail"

import {
  getProduct,
} from "../../services/products"

import {
  useCart,
} from "../../store/useCart"

vi.mock(
  "../../services/products",
  () => ({
    getProduct: vi.fn(),
  })
)

vi.mock(
  "../../store/useCart",
  () => ({
    useCart: vi.fn(),
  })
)

const mockedGetProduct =
  vi.mocked(getProduct)

const mockedUseCart =
  vi.mocked(useCart)

const mockProduct = {
  id: 1,

  title:
    "Test product",

  description:
    "Test product description",

  category:
    "laptops",

  price:
    999,

  discountPercentage:
    10,

  rating:
    4.5,

  stock:
    10,

  tags: [],

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

  reviews: [],

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
}

const createQueryClient = () => {

  return new QueryClient({
    defaultOptions: {
      queries: {
        retry:
          false,
      },
    },
  })
}

const renderProductDetail = (
  initialEntry:
    string = "/products/1"
) => {

  const queryClient =
    createQueryClient()

  return render(

    <QueryClientProvider
      client={
        queryClient
      }
    >

      <MemoryRouter
        initialEntries={[
          initialEntry,
        ]}
      >

        <Routes>

          <Route
            path="/products/:id"
            element={
              <ProductDetail />
            }
          />

        </Routes>

      </MemoryRouter>

    </QueryClientProvider>
  )
}

describe(
  "ProductDetail",
  () => {

    beforeEach(() => {

      vi.clearAllMocks()

      mockedGetProduct
        .mockResolvedValue(
          mockProduct
        )

      mockedUseCart
        .mockReturnValue({
          items: [],

          addItem:
            vi.fn(),

          removeItem:
            vi.fn(),

          clearItem:
            vi.fn(),

          clearCart:
            vi.fn(),
        })
    })

    it(
      "loads and displays the product",
      async () => {

        renderProductDetail()

        expect(
          await screen.findByText(
            "Test product"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Laptops"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Test product description"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "4.5"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "$ 999.00"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "In Stock"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            /10 units available/
          )
        ).toBeInTheDocument()

        expect(
          mockedGetProduct
        ).toHaveBeenCalledWith(
          1
        )
      }
    )

    it(
      "loads the product successfully only once",
      async () => {

        renderProductDetail()

        await screen.findByText(
          "Test product"
        )

        expect(
          mockedGetProduct
        ).toHaveBeenCalledWith(
          1
        )

        expect(
          mockedGetProduct
        ).toHaveBeenCalledTimes(
          1
        )
      }
    )

    it(
      "shows an error when the product cannot be loaded",
      async () => {

        mockedGetProduct
          .mockRejectedValue(
            new Error(
              "Unable to load product."
            )
          )

        renderProductDetail()

        expect(
          await screen.findByText(
            "Unable to load product."
          )
        ).toBeInTheDocument()
      }
    )

    it(
      "adds the product to the cart",
      async () => {

        const user =
          userEvent.setup()

        const addItem =
          vi.fn()

        mockedUseCart
          .mockReturnValue({
            items: [],

            addItem,

            removeItem:
              vi.fn(),

            clearItem:
              vi.fn(),

            clearCart:
              vi.fn(),
          })

        renderProductDetail()

        await screen.findByText(
          "Test product"
        )

        const addButton =
          screen.getByRole(
            "button",
            {
              name:
                /add.*cart/i,
            }
          )

        await user.click(
          addButton
        )

        expect(
          addItem
        ).toHaveBeenCalledWith(
          mockProduct
        )
      }
    )

    it(
      "navigates to the previous location when location state contains from",
      async () => {

        const user =
          userEvent.setup()

        render(

          <QueryClientProvider
            client={
              createQueryClient()
            }
          >

            <MemoryRouter
              initialEntries={[
                {
                  pathname:
                    "/products/1",

                  state: {
                    from:
                      "/products?category=laptops",
                  },
                },
              ]}
            >

              <Routes>

                <Route
                  path="/products/:id"
                  element={
                    <ProductDetail />
                  }
                />

                <Route
                  path="/products"
                  element={
                    <div>
                      Products page
                    </div>
                  }
                />

              </Routes>

            </MemoryRouter>

          </QueryClientProvider>
        )

        await screen.findByText(
          "Test product"
        )

        const backButton =
          screen.getByRole(
            "button",
            {
              name:
                /back to products/i,
            }
          )

        await user.click(
          backButton
        )

        expect(
          screen.getByText(
            "Products page"
          )
        ).toBeInTheDocument()
      }
    )

    it(
      "navigates to products when there is no previous location",
      async () => {

        const user =
          userEvent.setup()

        render(

          <QueryClientProvider
            client={
              createQueryClient()
            }
          >

            <MemoryRouter
              initialEntries={[
                "/products/1",
              ]}
            >

              <Routes>

                <Route
                  path="/products/:id"
                  element={
                    <ProductDetail />
                  }
                />

                <Route
                  path="/products"
                  element={
                    <div>
                      Products page
                    </div>
                  }
                />

              </Routes>

            </MemoryRouter>

          </QueryClientProvider>
        )

        await screen.findByText(
          "Test product"
        )

        const backButton =
          screen.getByRole(
            "button",
            {
              name:
                /back to products/i,
            }
          )

        await user.click(
          backButton
        )

        expect(
          screen.getByText(
            "Products page"
          )
        ).toBeInTheDocument()
      }
    )

    it(
      "shows an error for an invalid product id",
      () => {

        renderProductDetail(
          "/products/abc"
        )

        expect(
          screen.getByText(
            "Invalid product ID."
          )
        ).toBeInTheDocument()

        expect(
          mockedGetProduct
        ).not.toHaveBeenCalled()
      }
    )

    it(
      "shows an error when the product id is zero",
      () => {

        renderProductDetail(
          "/products/0"
        )

        expect(
          screen.getByText(
            "Invalid product ID."
          )
        ).toBeInTheDocument()

        expect(
          mockedGetProduct
        ).not.toHaveBeenCalled()
      }
    )

    it(
      "shows an error when the product id is negative",
      () => {

        renderProductDetail(
          "/products/-1"
        )

        expect(
          screen.getByText(
            "Invalid product ID."
          )
        ).toBeInTheDocument()

        expect(
          mockedGetProduct
        ).not.toHaveBeenCalled()
      }
    )

    it(
      "shows the loading state while the product is loading",
      () => {

        mockedGetProduct
          .mockReturnValue(
            new Promise(
              () => {}
            )
          )

        renderProductDetail()

        expect(
          screen.getByText(
            "Loading product..."
          )
        ).toBeInTheDocument()
      }
    )

    it(
      "shows the original price and discount",
      async () => {

        renderProductDetail()

        await screen.findByText(
          "Test product"
        )

        expect(
          screen.getByText(
            "$ 1110.00"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            /10\s*%\s*OFF/
          )
        ).toBeInTheDocument()
      }
    )
  }
)