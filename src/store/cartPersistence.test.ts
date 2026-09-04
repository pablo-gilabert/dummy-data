import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest"

import {
  configureStore,
} from "@reduxjs/toolkit"

import {
  addItem,
  removeItem,
  clearItem,
  clearCart,
  loadCart,
} from "./slices/cartSlice"

import {
  initializeAuth,
  login,
  logoutAction,
} from "./slices/authSlice"

import {
  cartPersistenceMiddleware,
} from "./cartPersistence"

import authReducer from "./slices/authSlice"

import cartReducer from "./slices/cartSlice"

import type {
  Product,
} from "../types/Product"

import type {
  User,
} from "../types/User"

import type {
  CartItem,
} from "../types/CartItem"

const createProduct = (
  overrides: Partial<Product> = {},
): Product => ({
  id: 1,
  title: "Test Product",
  description: "Test product description",
  category: "test-category",
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  tags: ["test"],
  brand: "Test Brand",
  sku: "TEST-001",
  weight: 1,
  dimensions: {
    width: 10,
    height: 10,
    depth: 10,
  },
  warrantyInformation: "Test warranty",
  shippingInformation: "Test shipping",
  availabilityStatus: "In Stock",
  reviews: [],
  returnPolicy: "30 days",
  minimumOrderQuantity: 1,
  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",
    updatedAt:
      "2026-01-01T00:00:00.000Z",
    barcode: "123456789",
    qrCode:
      "https://example.com/qr.png",
  },
  thumbnail:
    "https://example.com/image.jpg",
  images: [
    "https://example.com/image.jpg",
  ],
  ...overrides,
})

const createCartItem = (
  product: Product,
  quantity = 1,
): CartItem => ({
  product,
  quantity,
})

const createUser = (
  id: number,
): User =>
  ({
    id,
    accessToken: `access-token-${id}`,
    refreshToken: `refresh-token-${id}`,
  }) as User

const createStore = (
  user: User | null = null,
  items: CartItem[] = [],
) =>
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },

    middleware: (
      getDefaultMiddleware,
    ) =>
      getDefaultMiddleware().prepend(
        cartPersistenceMiddleware.middleware,
      ),

    preloadedState: {
      auth: {
        user,
        isLoading: false,
      },

      cart: {
        items,
      },
    },
  })

const getStoredCart = (
  userId: number,
): CartItem[] | null => {
  const storedCart =
    localStorage.getItem(
      `cart_${userId}`,
    )

  if (!storedCart) {
    return null
  }

  return JSON.parse(
    storedCart,
  ).items
}

const waitForListener = async () => {
  await new Promise<void>(
    (resolve) => {
      setTimeout(
        resolve,
        0,
      )
    },
  )
}

describe(
  "cartPersistenceMiddleware",
  () => {
    afterEach(() => {
      localStorage.clear()
    })

    it(
      "loads the stored cart when authentication is initialized",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const storedItems = [
          createCartItem(
            product,
            3,
          ),
        ]

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: storedItems,
          }),
        )

        const store =
          createStore()

        store.dispatch(
          initializeAuth.fulfilled(
            user,
            "request-id",
            undefined,
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual(
          storedItems,
        )
      },
    )

    it(
      "clears the in-memory cart when authentication initializes without a user",
      async () => {
        const product =
          createProduct()

        const store =
          createStore(
            null,
            [
              createCartItem(
                product,
              ),
            ],
          )

        store.dispatch(
          initializeAuth.fulfilled(
            null,
            "request-id",
            undefined,
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([])
      },
    )

    it(
      "loads the stored cart after login",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const storedItems = [
          createCartItem(
            product,
            2,
          ),
        ]

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: storedItems,
          }),
        )

        const store =
          createStore()

        store.dispatch(
          login.fulfilled(
            user,
            "request-id",
            {
              username: "test-user",
              password: "password",
            },
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual(
          storedItems,
        )
      },
    )

    it(
      "uses an empty cart when no stored cart exists after login",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const store =
          createStore(
            null,
            [
              createCartItem(
                product,
              ),
            ],
          )

        store.dispatch(
          login.fulfilled(
            user,
            "request-id",
            {
              username: "test-user",
              password: "password",
            },
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([])
      },
    )

    it(
      "clears the in-memory cart when logging out",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const items = [
          createCartItem(
            product,
            2,
          ),
        ]

        const store =
          createStore(
            user,
            items,
          )

        store.dispatch(
          logoutAction(),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([])
      },
    )

    it(
      "keeps the persisted cart when logging out",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const items = [
          createCartItem(
            product,
            2,
          ),
        ]

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items,
          }),
        )

        const store =
          createStore(
            user,
            items,
          )

        store.dispatch(
          logoutAction(),
        )

        await waitForListener()

        expect(
          getStoredCart(1),
        ).toEqual(items)
      },
    )

    it(
      "persists the cart when adding an item",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const store =
          createStore(user)

        store.dispatch(
          addItem(product),
        )

        await waitForListener()

        expect(
          getStoredCart(1),
        ).toEqual([
          createCartItem(
            product,
          ),
        ])
      },
    )

    it(
      "persists the updated quantity when removing an item",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const items = [
          createCartItem(
            product,
            3,
          ),
        ]

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items,
          }),
        )

        const store =
          createStore(
            user,
            items,
          )

        store.dispatch(
          removeItem(product.id),
        )

        await waitForListener()

        expect(
          getStoredCart(1),
        ).toEqual([
          createCartItem(
            product,
            2,
          ),
        ])
      },
    )

    it(
      "persists the cart after clearing one item",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct({
            id: 1,
          })

        const otherProduct =
          createProduct({
            id: 2,
          })

        const items = [
          createCartItem(
            product,
          ),
          createCartItem(
            otherProduct,
          ),
        ]

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items,
          }),
        )

        const store =
          createStore(
            user,
            items,
          )

        store.dispatch(
          clearItem(product.id),
        )

        await waitForListener()

        expect(
          getStoredCart(1),
        ).toEqual([
          createCartItem(
            otherProduct,
          ),
        ])
      },
    )

    it(
      "removes the persisted cart when clearing the entire cart",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const items = [
          createCartItem(
            product,
          ),
        ]

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items,
          }),
        )

        const store =
          createStore(
            user,
            items,
          )

        store.dispatch(
          clearCart(),
        )

        await waitForListener()

        expect(
          localStorage.getItem(
            "cart_1",
          ),
        ).toBeNull()
      },
    )

    it(
      "treats invalid stored cart data as an empty cart",
      async () => {
        const user =
          createUser(1)

        localStorage.setItem(
          "cart_1",
          "invalid-json",
        )

        const store =
          createStore()

        store.dispatch(
          login.fulfilled(
            user,
            "request-id",
            {
              username: "test-user",
              password: "password",
            },
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([])
      },
    )

    it(
      "treats a stored cart with invalid items as an empty cart",
      async () => {
        const user =
          createUser(1)

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [
              {
                invalid: true,
              },
            ],
          }),
        )

        const store =
          createStore()

        store.dispatch(
          login.fulfilled(
            user,
            "request-id",
            {
              username: "test-user",
              password: "password",
            },
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([])
      },
    )

    it(
      "does not persist the cart when there is no authenticated user",
      async () => {
        const product =
          createProduct()

        const store =
          createStore()

        store.dispatch(
          addItem(product),
        )

        await waitForListener()

        expect(
          localStorage.length,
        ).toBe(0)
      },
    )

    it(
      "keeps carts separated by user",
      async () => {
        const userOne =
          createUser(1)

        const userTwo =
          createUser(2)

        const productOne =
          createProduct({
            id: 1,
            title: "Product One",
          })

        const productTwo =
          createProduct({
            id: 2,
            title: "Product Two",
          })

        localStorage.setItem(
          "cart_1",
          JSON.stringify({
            items: [
              createCartItem(
                productOne,
              ),
            ],
          }),
        )

        localStorage.setItem(
          "cart_2",
          JSON.stringify({
            items: [
              createCartItem(
                productTwo,
                2,
              ),
            ],
          }),
        )

        const store =
          createStore()

        store.dispatch(
          login.fulfilled(
            userOne,
            "request-id-1",
            {
              username: "user-one",
              password: "password",
            },
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([
          createCartItem(
            productOne,
          ),
        ])

        store.dispatch(
          login.fulfilled(
            userTwo,
            "request-id-2",
            {
              username: "user-two",
              password: "password",
            },
          ),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual([
          createCartItem(
            productTwo,
            2,
          ),
        ])

        expect(
          getStoredCart(1),
        ).toEqual([
          createCartItem(
            productOne,
          ),
        ])

        expect(
          getStoredCart(2),
        ).toEqual([
          createCartItem(
            productTwo,
            2,
          ),
        ])
      },
    )

    it(
      "loads the provided cart without persisting it again",
      async () => {
        const user =
          createUser(1)

        const product =
          createProduct()

        const items = [
          createCartItem(
            product,
            2,
          ),
        ]

        const store =
          createStore(user)

        store.dispatch(
          loadCart(items),
        )

        await waitForListener()

        expect(
          store.getState().cart.items,
        ).toEqual(items)

        expect(
          localStorage.getItem(
            "cart_1",
          ),
        ).toBeNull()
      },
    )
  },
)