import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import type {
  ReactNode,
} from "react"

import {
  AuthContext,
} from "../AuthContext/authContext"

import type {
  User,
} from "../types/User"

import type {
  Product,
} from "../types/Product"

import {
  CartProvider,
} from "./CartProvider"

import {
  useCart,
} from "./useCart"

const product: Product = {
  id: 1,

  title:
    "Test Product",

  description:
    "Test description",

  category:
    "test-category",

  price: 100,

  discountPercentage: 0,

  rating: 4.5,

  stock: 10,

  tags: [],

  brand:
    "Test Brand",

  sku:
    "TEST-001",

  weight: 1,

  dimensions: {
    width: 10,
    height: 10,
    depth: 10,
  },

  warrantyInformation:
    "Test warranty",

  shippingInformation:
    "Test shipping",

  availabilityStatus:
    "In Stock",

  reviews: [],

  returnPolicy:
    "Test return policy",

  minimumOrderQuantity: 1,

  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",

    updatedAt:
      "2026-01-01T00:00:00.000Z",

    barcode:
      "123456789",

    qrCode:
      "test-qr",
  },

  images: [
    "https://example.com/image.jpg",
  ],

  thumbnail:
    "https://example.com/thumbnail.jpg",
}

const secondProduct: Product = {
  ...product,

  id: 2,

  title:
    "Second Product",

  sku:
    "TEST-002",
}

const createUser = (
  id: number
): User => ({
  id,

  username:
    `user${id}`,

  email:
    `user${id}@example.com`,

  firstName:
    `User${id}`,

  lastName:
    "Test",

  gender:
    "male",

  image:
    "https://example.com/user.jpg",

  accessToken:
    `access-token-${id}`,

  refreshToken:
    `refresh-token-${id}`,
})

interface TestCartProps {
  children?: ReactNode
}

const TestCart = ({
  children,
}: TestCartProps) => {

  const {
    items,
    addItem,
    removeItem,
    clearItem,
    clearCart,
  } = useCart()

  return (
    <div>

      <span>
        {items.length}
      </span>

      <span>
        {items
          .map(
            (item) =>
              `${item.product.id}:${item.quantity}`
          )
          .join(",")}
      </span>

      <button
        type="button"
        onClick={() =>
          addItem(product)
        }
      >
        Add
      </button>

      <button
        type="button"
        onClick={() =>
          addItem(secondProduct)
        }
      >
        Add second
      </button>

      <button
        type="button"
        onClick={() =>
          removeItem(product.id)
        }
      >
        Remove
      </button>

      <button
        type="button"
        onClick={() =>
          clearItem(product.id)
        }
      >
        Clear item
      </button>

      <button
        type="button"
        onClick={clearCart}
      >
        Clear
      </button>

      {children}

    </div>
  )
}

interface TestProviderProps {
  user: User | null
  isLoading?: boolean
}

const TestProvider = ({
  user,
  isLoading = false,
}: TestProviderProps) => {

  return (
    <AuthContext.Provider
      value={{
        user,

        isLoading,

        login:
          async () => {},

        logout:
          () => {},
      }}
    >

      <CartProvider>
        <TestCart />
      </CartProvider>

    </AuthContext.Provider>
  )
}

describe(
  "CartProvider",
  () => {

    beforeEach(() => {

      localStorage.clear()

    })

    it(
      "starts with an empty cart for a user without stored items",
      async () => {

        const user =
          createUser(1)

        render(
          <TestProvider
            user={user}
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "adds a product to the current user's cart",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        expect(
          screen.getByText(
            "1"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "1:1"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "persists the cart using the user's id",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await waitFor(() => {

          const storedCart =
            localStorage.getItem(
              "cart_1"
            )

          expect(
            storedCart
          ).not.toBeNull()

          expect(
            JSON.parse(
              storedCart ?? "{}"
            ).items
          ).toHaveLength(1)

        })

      }
    )

    it(
      "loads the existing cart for the current user",
      async () => {

        const storedCart = {
          items: [
            {
              product,
              quantity: 2,
            },
          ],
        }

        localStorage.setItem(
          "cart_1",
          JSON.stringify(
            storedCart
          )
        )

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "1"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "1:2"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "does not load another user's cart",
      async () => {

        localStorage.setItem(
          "cart_2",
          JSON.stringify({
            items: [
              {
                product,
                quantity: 2,
              },
            ],
          })
        )

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "handles invalid JSON stored in localStorage",
      async () => {

        localStorage.setItem(
          "cart_1",
          "{ invalid json"
        )

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "handles invalid cart data stored in localStorage",
      async () => {

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items:
              "not-an-array",
          })
        )

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "handles null cart data stored in localStorage",
      async () => {

        localStorage.setItem(
          "cart_1",
          JSON.stringify(null)
        )

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "does not initialize the cart while authentication is loading",
      async () => {

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [
              {
                product,
                quantity: 2,
              },
            ],
          })
        )

        const {
          rerender,
        } = render(
          <TestProvider
            user={
              createUser(1)
            }
            isLoading
          />
        )

        expect(
          screen.getByText(
            "0"
          )
        ).toBeInTheDocument()

        rerender(
          <TestProvider
            user={
              createUser(1)
            }
            isLoading={false}
          />
        )

        expect(
          await screen.findByText(
            "1"
          )
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "1:2"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "does not persist the cart while authentication is loading",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
            isLoading
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        expect(
          localStorage.getItem(
            "cart_1"
          )
        ).toBeNull()

      }
    )

    it(
      "clears the cart when there is no authenticated user",
      async () => {

        const {
          rerender,
        } = render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await screen.findByText(
          "0"
        )

        rerender(
          <TestProvider
            user={null}
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "loads the new user's cart when the authenticated user changes",
      async () => {

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [
              {
                product,
                quantity: 1,
              },
            ],
          })
        )

        localStorage.setItem(
          "cart_2",
          JSON.stringify({
            items: [
              {
                product:
                  secondProduct,

                quantity: 3,
              },
            ],
          })
        )

        const {
          rerender,
        } = render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "1:1"
          )
        ).toBeInTheDocument()

        rerender(
          <TestProvider
            user={
              createUser(2)
            }
          />
        )

        expect(
          await screen.findByText(
            "2:3"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "does not reload the cart when the same user is rendered again",
      async () => {

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [
              {
                product,
                quantity: 1,
              },
            ],
          })
        )

        const {
          rerender,
        } = render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "1:1"
          )
        ).toBeInTheDocument()

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [
              {
                product,
                quantity: 5,
              },
            ],
          })
        )

        rerender(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          screen.getByText(
            "1:1"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "removes one quantity when remove is clicked",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        expect(
          screen.getByText(
            "1:2"
          )
        ).toBeInTheDocument()

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Remove",
            }
          )
        )

        expect(
          screen.getByText(
            "1:1"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "removes the item completely when clear item is clicked",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        expect(
          screen.getByText(
            "1:1"
          )
        ).toBeInTheDocument()

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Clear item",
            }
          )
        )

        expect(
          screen.getByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "clears the current user's cart",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add second",
            }
          )
        )

        expect(
          screen.getByText(
            "2"
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

        expect(
          screen.getByText(
            "0"
          )
        ).toBeInTheDocument()

      }
    )

    it(
      "removes the user's cart from localStorage when the cart is cleared",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await waitFor(() => {

          expect(
            localStorage.getItem(
              "cart_1"
            )
          ).not.toBeNull()

        })

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
            localStorage.getItem(
              "cart_1"
            )
          ).toBeNull()

        })

      }
    )

    it(
      "keeps separate carts for different users",
      async () => {

        const user =
          userEvent.setup()

        const {
          rerender,
        } = render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await waitFor(() => {

          expect(
            localStorage.getItem(
              "cart_1"
            )
          ).not.toBeNull()

        })

        rerender(
          <TestProvider
            user={
              createUser(2)
            }
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

        expect(
          localStorage.getItem(
            "cart_2"
          )
        ).toBeNull()

      }
    )

    it(
      "does not overwrite the previous user's cart when switching users",
      async () => {

        const user =
          userEvent.setup()

        localStorage.setItem(
          "cart_2",
          JSON.stringify({
            items: [
              {
                product:
                  secondProduct,

                quantity: 2,
              },
            ],
          })
        )

        const {
          rerender,
        } = render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await waitFor(() => {

          expect(
            localStorage.getItem(
              "cart_1"
            )
          ).not.toBeNull()

        })

        rerender(
          <TestProvider
            user={
              createUser(2)
            }
          />
        )

        expect(
          await screen.findByText(
            "2:2"
          )
        ).toBeInTheDocument()

        expect(
          JSON.parse(
            localStorage.getItem(
              "cart_1"
            ) ?? "{}"
          ).items
        ).toHaveLength(1)

      }
    )

    it(
      "does not persist an empty cart loaded from localStorage",
      async () => {

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [],
          })
        )

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        expect(
          await screen.findByText(
            "0"
          )
        ).toBeInTheDocument()

        expect(
          localStorage.getItem(
            "cart_1"
          )
        ).toEqual(
          JSON.stringify({
            items: [],
          })
        )

      }
    )

    it(
      "keeps the current user's cart after adding a second product",
      async () => {

        const user =
          userEvent.setup()

        render(
          <TestProvider
            user={
              createUser(1)
            }
          />
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add",
            }
          )
        )

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Add second",
            }
          )
        )

        await waitFor(() => {

          const storedCart =
            localStorage.getItem(
              "cart_1"
            )

          expect(
            storedCart
          ).not.toBeNull()

          const parsedCart =
            JSON.parse(
              storedCart ?? "{}"
            )

          expect(
            parsedCart.items
          ).toHaveLength(2)

        })

      }
    )

  }
)