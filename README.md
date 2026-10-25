# Dummy Data Store

A responsive e-commerce frontend built with **React, TypeScript, and the [DummyJSON API](https://dummyjson.com/)**. The application demonstrates product discovery, authenticated shopping flows, a stock-aware cart, client-side checkout, and order history, with a focus on maintainable architecture and automated testing.

> **Portfolio demonstration:** Products and authentication use DummyJSON. Checkout does **not** process real payments or submit purchases to a production commerce backend; demo orders are saved locally in the browser.

## Features

### Storefront

- Product catalogue with search, category filters, sorting, and pagination.
- Shareable product-list state through URL search parameters.
- Product details with an image gallery, stock information, ratings, and reviews.
- Loading, error, empty, and background-fetching states.
- Responsive layouts built with CSS Modules.
- **Light and dark modes**, with a persistent preference stored in `localStorage`.

### Authentication and shopping

- Sign-in using DummyJSON's authentication endpoint.
- Session initialization, current-user validation, refresh-token handling, and protected routes.
- Cart managed by Redux Toolkit, with stock-aware quantity limits.
- Per-user cart persistence in `localStorage` using `cart_<userId>` keys.
- Checkout with React Hook Form and Zod validation.
- SweetAlert2 confirmations and user feedback.
- Locally saved demo orders, order confirmation, order history, and order detail pages.

### Quality

- TypeScript types and Zod schemas for runtime API-response validation.
- ESLint checks and component/unit tests using Vitest and React Testing Library.
- End-to-end tests with Playwright (Chromium).
- V8 coverage reporting and GitHub Actions CI.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React 19 | Component-based user interface |
| TypeScript 6 | Type safety |
| Vite 8 | Development and production builds |
| React Router 7 | Client-side routes and URL-driven filters |
| Redux Toolkit / React Redux | Authentication and shopping-cart state |
| TanStack Query 5 | Remote data fetching, cache, and loading states |
| React Hook Form | Checkout form state |
| Zod | Runtime schemas and form validation |
| SweetAlert2 | Confirmations, alerts, and feedback |
| React Icons | Interface icons |
| CSS Modules | Component-scoped responsive styles |
| Vitest / React Testing Library | Unit and component tests |
| Playwright | Browser-based E2E tests |
| ESLint / GitHub Actions | Static checks and continuous integration |

## Architecture

The application separates remote data, business logic, and browser-local state:

```text
src/
├── components/       # Reusable UI, route protection, theme toggle
├── hooks/            # Product/query hooks
├── lib/              # Query client and query keys
├── pages/            # Home, catalogue, detail, cart, login, checkout, orders
├── queries/          # Reusable TanStack Query definitions
├── schemas/          # Zod validation contracts
├── services/         # DummyJSON requests, authentication, local storage
├── store/            # Redux Toolkit store, slices, typed hooks, persistence
├── styles/           # Application theme tokens and dark-mode overrides
├── test/             # Shared test setup
├── types/            # Application domain types
├── utils/            # Presentation helpers
├── App.tsx            # Route definitions
├── main.tsx           # Application providers and initialization
└── index.css          # Global styles and original color variables
```

**Remote product state** is loaded through the services/query layer and cached using TanStack Query. Search, category, sorting, and pagination state are represented in the URL (for example, `/products?search=phone&category=smartphones&sort=price-asc&page=2`).

**Application state** lives in Redux Toolkit. The `auth` slice handles session state, while the `cart` slice enforces item quantities against product stock. A listener middleware persists and restores each user's cart.

**Demo orders** are stored separately in browser `localStorage` and associated with the current user. No server-side order database is used.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Storefront landing page | Public |
| `/products` | Product catalogue, filters, search, sorting, pagination | Public |
| `/products/:id` | Product information, gallery, reviews | Public |
| `/cart` | Shopping cart | Public |
| `/login` | DummyJSON sign-in | Public |
| `/checkout` | Demo checkout | Authenticated |
| `/order-confirmation` | Confirmation after checkout | Authenticated |
| `/orders` | Local order history | Authenticated |
| `/orders/:orderId` | Individual order details | Authenticated |
| Any other path | 404 page | Public |

## Authentication and local persistence

Authentication uses `https://dummyjson.com/auth`. The application keeps the authenticated user and tokens in browser storage, validates the session when the app starts, and attempts a token refresh following an unauthorized authenticated request.

| Storage key | Purpose |
| --- | --- |
| `user` | Demo authenticated user and tokens |
| `cart_<userId>` | Cart associated with a specific signed-in user |
| `orders` | Locally created demo orders |
| `lastOrderId` | Last submitted demo order for the confirmation flow |
| `dummy-data-theme` | Selected display mode: `light` or `dark` |

Browser storage is **not a secure credential store**. This authentication and checkout setup is appropriate for a technical demonstration, not for handling real customer credentials or payments.

## Light and dark mode

Use the floating sun/moon button at the bottom-right of the interface to switch between themes. The original light appearance is the default. The selected theme persists across reloads in `localStorage` and is applied before React renders to minimize flashes of the wrong theme. Theme support is presentation-only; it does not change authentication, product data, cart logic, or checkout behavior.

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm
- Internet access for the DummyJSON API

### Install and run

```bash
npm install
npm run dev
```

Use the URL printed by Vite to open the application. To try authenticated flows, use a valid demo user from the [DummyJSON authentication documentation](https://dummyjson.com/docs/auth).

### Commands

```bash
npm run lint             # ESLint
npm test -- --run         # Unit/component tests once
npm run test:coverage    # Unit/component tests and V8 coverage
npx playwright install chromium
npm run test:e2e         # Playwright browser tests
npm run build            # Type-check and production build
npm run preview          # Preview the production build
```

Playwright's configuration starts the Vite development server for E2E runs. The E2E scenarios depend on demo API data being available and consistent.

## Testing and CI

- **Unit/component tests:** Vitest, React Testing Library, and user-event cover UI, Redux state, services, validation, and page behavior.
- **E2E tests:** Playwright exercises browsing, authentication, cart, checkout, and order-management flows in Chromium.
- **CI:** `.github/workflows/ci.yml` runs `npm ci`, ESLint, Vitest coverage, Playwright, and the production build on pushes and pull requests targeting `main`.

The project has no custom backend and does not collect or process real payments. Availability of remote products and authentication depends on the public DummyJSON service.

## Repository layout

```text
dummy-data/
├── .github/workflows/ci.yml
├── e2e/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── queries/
│   ├── schemas/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── test/
│   ├── types/
│   └── utils/
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Author

**Pablo Gilabert** — Software developer.

This repository is a portfolio demonstration of front-end engineering, state management, API integration, validation, responsive UI, and automated testing.
