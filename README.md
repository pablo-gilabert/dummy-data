# Dummy Data Store

A responsive e-commerce front-end built with React and TypeScript, using the DummyJSON API as the remote data source.

The project was built to demonstrate practical front-end engineering: API integration, server-state management, authentication, protected routes, cart state, checkout flows, persistence, testing, and CI.

## What it demonstrates

- Product browsing with pagination
- Product search and category filtering
- Multiple sorting strategies
- Product detail pages with image galleries and reviews
- TanStack Query for server-state management and caching
- Authentication with session validation and token refresh
- Protected application routes
- Per-user cart persistence and cart isolation
- Stock-aware cart quantities
- Checkout form validation and order creation
- Local order history for the demo checkout flow
- Loading, error, empty, and updating states
- Responsive UI built with CSS Modules
- Unit/component tests with Vitest and Testing Library
- End-to-end tests with Playwright
- Coverage reporting with V8
- Automated linting, tests, E2E checks, and production builds through GitHub Actions

## Tech stack

### Application

| Technology | Role |
| --- | --- |
| React 19 | UI development |
| TypeScript 6 | Static typing |
| Vite 8 | Development server and production build |
| React Router 7 | Client-side routing |
| TanStack Query 5 | Server-state management, caching, and request lifecycle |
| React Context + `useReducer` | Authentication and cart application state |
| CSS Modules | Component-scoped styling |
| React Icons | Interface icons |
| SweetAlert2 | Confirmations and user feedback |

### Quality and testing

| Tool | Role |
| --- | --- |
| Vitest | Unit and component testing |
| React Testing Library | User-focused React tests |
| `@testing-library/user-event` | Realistic interaction simulation |
| `jest-dom` | DOM assertions |
| MSW | API mocking in tests |
| Playwright | End-to-end browser testing |
| V8 coverage | Coverage reporting |
| ESLint | Static analysis |
| GitHub Actions | Continuous integration |

## Architecture

The application separates UI composition, server communication, server state, and local application state.

```text
React UI
   │
   ├── Pages
   │     └── compose reusable components
   │
   ├── Context
   │     ├── Authentication
   │     └── Cart state
   │
   ├── Hooks / Query definitions
   │     └── TanStack Query
   │
   └── Services
         ├── API client
         ├── Authentication
         ├── Products
         └── Local persistence
                    │
                    ▼
              DummyJSON API
```

### Server state vs. application state

The project intentionally distinguishes between data that belongs to the remote API and state that belongs to the browser session.

**TanStack Query** manages server state such as products and categories. Query keys are centralized so list, detail, and prefetch operations share the same cache identity.

**React Context + `useReducer`** manages application state such as the authenticated user and shopping cart. The cart is persisted in `localStorage` using a user-specific key.

This separation avoids using one state-management solution for unrelated problems.

## Authentication flow

Authentication is handled through `AuthProvider` and a dedicated API client.

```text
Login
  │
  ▼
DummyJSON authentication
  │
  ▼
Store authenticated user + tokens
  │
  ▼
Validate session on application startup
  │
  ├── valid ───────────────► continue authenticated
  │
  └── expired/401
          │
          ▼
     refresh token
          │
       ┌──┴──┐
       │     │
    success failure
       │     │
       ▼     ▼
     retry  clear session
```

Authenticated routes are protected by `ProtectedRoute`, while the authentication implementation remains isolated from page components.

## Cart persistence

The cart is local application state rather than server state.

Each authenticated user receives an independent storage key:

```text
cart_<userId>
```

This means:

- A cart survives a page reload.
- Different users do not share the same cart.
- Clearing a cart removes the persisted cart for the current user.
- Stock limits are enforced by the reducer.

## Product data flow

The product page state is represented in the URL, for example:

```text
/products?search=phone&category=smartphones&sort=price-asc&page=2
```

The flow is:

```text
URL state
   ↓
Products page
   ↓
useProducts
   ↓
productQueries
   ↓
products service
   ↓
API abstraction
   ↓
DummyJSON
```

This makes filters and pagination shareable, reload-safe, and naturally connected to TanStack Query's cache keys.

## Testing strategy

The project uses two complementary layers.

### Unit and component tests

Vitest and React Testing Library cover services, reducers, contexts, components, and pages. MSW provides deterministic API behavior for service and hook tests.

The tests focus on observable behavior rather than implementation details whenever practical.

### End-to-end tests

Playwright validates complete user flows in a real browser, including:

- Home navigation
- Product browsing and filtering
- Product details
- Login and authentication failures
- Protected routes
- Cart operations
- Cart persistence and user isolation
- Checkout
- Stock limits
- Order creation and viewing

## Running the project

### Requirements

- Node.js 22 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Run unit/component tests

```bash
npm test -- --run
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run end-to-end tests

```bash
npm run test:e2e
```

### Run linting

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Continuous integration

GitHub Actions runs the main quality checks for pushes and pull requests targeting `main`.

```text
Install dependencies
        ↓
ESLint
        ↓
Unit tests + coverage
        ↓
Playwright
        ↓
Production build
```

The goal is to keep the repository reproducible and to catch regressions before changes are considered ready.

## Project structure

```text
dummy-data/
├── .github/
│   └── workflows/
│       └── ci.yml
├── e2e/
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── home.spec.ts
│   ├── login.spec.ts
│   ├── orders.spec.ts
│   └── products.spec.ts
├── src/
│   ├── AuthContext/
│   ├── CartContext/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── queries/
│   ├── services/
│   ├── test/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## API

Product and authentication data are provided by the [DummyJSON](https://dummyjson.com/) public API.

The project keeps API-specific request construction inside the service layer so the UI does not depend directly on endpoint details.

## Engineering decisions

A few decisions were made deliberately rather than adding libraries for the sake of the stack:

- TanStack Query is used for remote/server state, not the local cart.
- React Context is sufficient for authentication and cart state at this application size.
- CSS Modules keep styles local without introducing a component library.
- The cart and orders use `localStorage` because the public API is being used as a data source, not as a real e-commerce backend.
- MSW makes API tests deterministic without coupling them to the availability of a public service.
- Playwright covers the highest-value user journeys in addition to unit/component coverage.

## Notes

This is a portfolio project designed to demonstrate front-end engineering practices around a realistic shopping workflow. It is not intended to represent production-grade payment processing, secure credential storage, or a real order backend.

## Author

**Pablo Gilabert**

Front-end developer focused on React, TypeScript, API integration, testing, and maintainable application architecture.
