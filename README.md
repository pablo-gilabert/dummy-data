# APIS — E-commerce Front-End

A modern e-commerce front-end application built with **React, TypeScript, Vite, React Router, and TanStack Query**.

The project consumes the [DummyJSON API](https://dummyjson.com/) and implements product browsing, searching, filtering, sorting, pagination, authentication, shopping cart management, checkout, and order history.

The project also includes a comprehensive unit and component test suite, code coverage, linting, TypeScript validation, production builds, and automated CI through GitHub Actions.

---

## Tech Stack

### Core

| Technology           | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| **React 19**         | UI library                                                       |
| **TypeScript 6**     | Static typing                                                    |
| **Vite 8**           | Development server and build tool                                |
| **React Router 7**   | Client-side routing                                              |
| **TanStack Query 5** | Server-state management, caching, and asynchronous data fetching |
| **React Icons**      | Icon library                                                     |
| **SweetAlert2**      | User-facing dialogs and confirmations                            |

### Testing

| Technology                      | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| **Vitest 4**                    | Unit and component testing                           |
| **Testing Library**             | Testing React components from the user's perspective |
| **@testing-library/user-event** | Simulating realistic user interactions               |
| **jest-dom**                    | Additional DOM assertions                            |
| **jsdom**                       | Browser-like test environment                        |
| **@vitest/coverage-v8**         | Test coverage reporting                              |

### Code Quality

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| **ESLint 10**      | Static analysis and code quality |
| **TypeScript**     | Compile-time type checking       |
| **GitHub Actions** | Continuous Integration           |

---

# Application Features

The application currently includes:

* Product listing
* Product search
* Category filtering
* Product sorting
* Pagination
* Product detail pages
* Product image gallery
* Product reviews
* Shopping cart
* Cart persistence through application state
* Checkout flow
* Order creation
* Order history
* Order detail pages
* User authentication
* Session validation
* Access token refresh
* Protected routes
* Public routes
* Loading states
* Error states
* Empty states
* Responsive UI
* Unit and component tests
* Test coverage
* Automated CI

---

# Project Architecture

The project follows a feature-oriented React architecture with a separation between:

* UI components
* Pages
* Application state
* Authentication
* API/service logic
* Types
* Utilities
* Tests

The high-level structure is:

```text
dummy-data/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── coverage/
│
├── src/
│   │
│   ├── AuthContext/
│   │
│   ├── CartContext/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# `src/`

The `src` directory contains the entire application source code.

The application is divided into several responsibilities rather than placing all logic inside pages or components.

---

## `src/main.tsx`

This is the application's entry point.

It creates the React root and configures the global providers used by the application.

The provider hierarchy is:

```text
StrictMode
└── BrowserRouter
    └── QueryClientProvider
        └── AuthProvider
            └── CartProvider
                └── App
```

### Responsibilities

* Initialize React
* Enable React Strict Mode
* Configure React Router
* Provide TanStack Query
* Provide authentication state
* Provide cart state
* Render the application

The TanStack Query client is configured here with global query behavior such as:

* Retry handling
* Different retry behavior for HTTP 4xx errors
* Disabling automatic refetching when the browser window regains focus

---

# `src/App.tsx`

Defines the application's route structure.

Routes include:

```text
/
├── /
├── /products
├── /products/:id
├── /cart
├── /login
│
└── Protected routes
    ├── /checkout
    ├── /order-confirmation
    ├── /orders
    └── /orders/:orderId
```

A catch-all route handles unknown URLs through the `NotFound` page.

Protected routes are wrapped by:

```text
ProtectedRoute
```

This prevents unauthenticated users from accessing authenticated application areas.

---

# `src/components/`

Reusable UI components live here.

Examples include:

```text
components/
│
├── CartItem/
├── CartSummary/
├── Checkout/
├── EmptyState/
├── ErrorState/
├── LoadingState/
├── Navbar/
├── ProductCard/
├── ProductGallery/
├── ProductReviews/
├── ProtectedRoute/
└── PublicRoute/
```

Components are designed to encapsulate individual pieces of UI functionality.

For example:

### `ProductCard`

Responsible for presenting an individual product in product listings.

### `ProductGallery`

Responsible for displaying product images and handling image selection.

### `CartItem`

Responsible for displaying and interacting with an individual cart item.

### `LoadingState`

Provides a reusable loading UI.

### `ErrorState`

Provides a reusable error UI.

### `EmptyState`

Provides a reusable empty-result UI.

This avoids duplicating common UI states throughout the application.

---

# `src/pages/`

Page-level components represent complete application screens.

```text
pages/
│
├── Home/
├── Login/
├── Products/
├── ProductDetail/
├── Cart/
├── Checkout/
├── Orders/
├── OrderDetail/
├── OrderConfirmation/
└── NotFound/
```

Pages are responsible for composing reusable components and connecting them to application state, routing, and server data.

---

# Products Page

The `Products` page is one of the main examples of TanStack Query usage.

It supports:

* Search
* Category filtering
* Sorting
* Pagination
* URL-based state

The URL represents the current product state:

```text
/products?search=phone&category=smartphones&sort=price-asc&page=2
```

This provides several benefits:

* Search/filter state survives page reloads
* URLs can be bookmarked
* Browser navigation works naturally
* Product views can be shared
* Server-state caching can use the same state as part of the query key

---

# TanStack Query

TanStack Query is used to manage **server state**.

Instead of manually managing asynchronous request state with:

```text
useEffect
useState
loading flags
error flags
manual request logic
```

the application uses `useQuery`.

For example, the Products page uses a query key containing the current product state:

```text
[
  "products",
  search,
  selectedCategory,
  sort,
  page
]
```

This means each combination represents a distinct cached query.

Conceptually:

```text
/products?page=1
        ↓
TanStack Query
        ↓
queryKey
        ↓
API request
        ↓
cached server state
        ↓
React UI
```

Product details use a separate query:

```text
[
  "product",
  productId
]
```

Categories use:

```text
[
  "categories"
]
```

This allows TanStack Query to handle:

* Request lifecycle
* Loading states
* Error states
* Caching
* Query deduplication
* Refetching
* Query identity
* Server-state synchronization

---

# Authentication

Authentication is managed through:

```text
src/AuthContext/
```

The main provider is:

```text
AuthProvider
```

It manages:

* Current authenticated user
* Authentication loading state
* Login
* Logout
* Session validation
* Token refresh

The authentication flow is approximately:

```text
Application starts
        │
        ▼
Check localStorage
        │
        ├── No stored user
        │       └── Continue unauthenticated
        │
        └── Stored user
                │
                ▼
        Validate current session
                │
          ┌─────┴─────┐
          │           │
       Success      Failure
          │           │
          │           ▼
          │      Refresh token
          │           │
          │      ┌─────┴─────┐
          │      │           │
          │   Success      Failure
          │      │           │
          ▼      ▼           ▼
       User authenticated   Logout
```

Authentication data is persisted through:

```text
src/services/authStorage.ts
```

---

# `src/services/`

The services layer contains external data access and persistence logic.

Examples:

```text
services/
│
├── api.ts
├── apiClient.ts
├── auth.ts
├── authStorage.ts
├── orderStorage.ts
└── products.ts
```

The purpose of this layer is to keep network and persistence concerns outside React components whenever possible.

---

## `services/api.ts`

Provides a generic API abstraction around `fetch`.

It handles:

* HTTP requests
* API base URL
* HTTP errors
* Network errors
* Invalid JSON responses
* Typed responses

It also exposes:

```text
ApiError
```

which allows the application to distinguish API errors from generic errors.

---

## `services/apiClient.ts`

Provides authenticated API requests.

It is responsible for attaching authentication information to requests that require it.

This keeps authentication-related HTTP behavior separate from UI components.

---

## `services/products.ts`

Contains product-related API operations.

Examples include:

```text
getProducts()
getProduct()
searchProducts()
getCategories()
getProductsByCategory()
getFilteredProducts()
```

The Products page does not need to know how URLs are constructed or how DummyJSON endpoints work.

Instead:

```text
Products page
      ↓
products service
      ↓
api layer
      ↓
DummyJSON API
```

This separation makes the UI easier to maintain and test.

---

# `src/CartContext/`

The shopping cart is application state rather than server state.

The cart architecture includes:

```text
CartProvider
useCart
cartReducer
```

A reducer is used to centralize cart state transitions.

Conceptually:

```text
User interaction
      ↓
Cart action
      ↓
cartReducer
      ↓
New cart state
      ↓
React components
```

Typical cart operations include:

* Add item
* Remove item
* Increase quantity
* Decrease quantity
* Clear cart

TanStack Query is intentionally not used for this state because the cart is local application state rather than remotely synchronized server state.

---

# `src/AuthContext/`

Authentication is also exposed through React Context.

The main public interface is:

```text
useAuth()
```

Components can access authentication state without needing to know how authentication is implemented internally.

For example:

```text
Component
    ↓
useAuth()
    ↓
AuthContext
    ↓
AuthProvider
```

---

# `src/types/`

Contains shared TypeScript domain models.

Examples include types representing:

* Products
* Users
* Categories
* Product responses
* Orders

These types provide compile-time guarantees between services and UI components.

For example:

```text
API response
     ↓
TypeScript type
     ↓
Service
     ↓
React component
```

---

# `src/utils/`

Contains small reusable functions that do not belong to a particular component or service.

For example:

```text
formatCategory()
```

Utilities keep simple transformations out of JSX and make them independently testable.

---

# Error Handling

The application provides explicit UI states for:

```text
Loading
Error
Empty
Success
```

A typical server-state flow is:

```text
Request
  │
  ├── Loading
  │
  ├── Error
  │
  ├── Empty
  │
  └── Success
```

Reusable components are used for these states:

```text
LoadingState
ErrorState
EmptyState
```

This keeps page-level implementations consistent.

---

# Testing

The project currently contains **200 tests across 27 test files**.

The test suite covers:

* Services
* Reducers
* Context providers
* Pages
* Components
* Authentication
* Cart behavior
* Product behavior
* Checkout behavior
* Error handling
* User interactions
* Routing-related behavior

Tests are written using:

```text
Vitest
Testing Library
user-event
jest-dom
jsdom
```

The goal is to test behavior from the user's perspective rather than implementation details wherever practical.

---

# Running Tests

Run the complete test suite:

```bash
npm test -- --run
```

Run a specific test file:

```bash
npx vitest run src/AuthContext/AuthProvider.test.tsx
```

Run tests in verbose mode:

```bash
npx vitest run --reporter=verbose
```

---

# Test Coverage

Coverage is generated using Vitest's V8 coverage provider.

Run:

```bash
npm run test:coverage
```

The generated coverage report is placed in:

```text
coverage/
```

The coverage directory contains an HTML representation of the current test coverage and can be opened locally to inspect coverage by file and source line.

---

# Linting

Run ESLint with:

```bash
npm run lint
```

The project uses ESLint to detect potential problems and enforce code-quality rules.

---

# Type Checking and Production Build

Run the production build:

```bash
npm run build
```

The build performs:

```text
TypeScript compilation
        ↓
Vite production build
```

The generated production files are placed in:

```text
dist/
```

---

# Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available through the local Vite development server.

---

# Preview Production Build

After building the application:

```bash
npm run build
```

the production build can be previewed with:

```bash
npm run preview
```

---

# CI — GitHub Actions

The project includes a GitHub Actions workflow:

```text
.github/
└── workflows/
    └── ci.yml
```

The workflow runs on:

* Pushes to `main`
* Pull requests targeting `main`

The CI pipeline performs:

```text
Checkout repository
        ↓
Setup Node.js 22
        ↓
npm ci
        ↓
Lint
        ↓
Tests + Coverage
        ↓
Production Build
```

The CI configuration ensures that code cannot be considered healthy merely because it works locally.

The project must also:

* Pass linting
* Pass the complete test suite
* Generate test coverage
* Successfully compile
* Successfully build for production

---

# Development Philosophy

The project is structured around several important front-end engineering principles.

### Separation of concerns

UI, server communication, application state, authentication, and utilities are kept in separate layers.

### Server state vs. client state

The application distinguishes between:

```text
Server state
    ↓
TanStack Query
```

and:

```text
Client/application state
    ↓
React Context + Reducer
```

This prevents a single state-management solution from being used for unrelated problems.

### Reusable UI

Common states and UI patterns are implemented as reusable components.

### Type safety

TypeScript is used throughout the application to make API responses, component props, state, and domain models explicit.

### Testability

Business logic and UI behavior are separated enough to allow individual pieces to be tested independently.

### URL-driven product state

Search, filtering, sorting, and pagination are represented through URL parameters, making the product browsing experience navigable and shareable.

---

# Current Project Status

The project currently has:

```text
React + TypeScript
        │
        ├── Vite
        ├── React Router
        ├── TanStack Query
        ├── React Context
        ├── Vitest
        ├── Testing Library
        ├── ESLint
        └── GitHub Actions
```

Current test status:

```text
Test Files: 27 passed
Tests:      200 passed
```

The application also successfully passes:

```bash
npm run lint
npm run build
npm run test:coverage
```

when executed in a clean project environment.

---

# Future Improvements

The project is intentionally being developed incrementally.

Potential next steps include:

* [ ] Mock Service Worker (MSW) for API mocking
* [ ] Playwright end-to-end testing
* [ ] More advanced TanStack Query mutations and cache invalidation
* [ ] Improved authentication architecture
* [ ] More comprehensive accessibility testing
* [ ] Performance optimization
* [ ] Additional CI checks
* [ ] Production deployment improvements
* [ ] Further test coverage improvements

These technologies should only be added when they solve a real problem in the application rather than being included purely to increase the number of technologies in the stack.

---

# Available npm Scripts

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Starts the Vite development server         |
| `npm run build`         | Type-checks and creates a production build |
| `npm run lint`          | Runs ESLint                                |
| `npm test`              | Starts Vitest                              |
| `npm test -- --run`     | Runs the complete test suite once          |
| `npm run test:coverage` | Runs tests and generates coverage          |
| `npm run preview`       | Previews the production build              |

---

# Project Goal

This project is being developed as a professional front-end portfolio application.

The goal is not simply to demonstrate that React can render an e-commerce interface, but to demonstrate practical front-end engineering skills including:

* Component architecture
* TypeScript
* Server-state management
* Client-state management
* API abstraction
* Authentication
* Routing
* Error handling
* Automated testing
* Code coverage
* Linting
* CI/CD practices
* Maintainable project structure

The application is intentionally evolved step by step so that each technology has a clear purpose within the architecture.
