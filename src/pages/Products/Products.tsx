import { useState } from "react"
import type {
  ChangeEvent,
  FormEvent,
} from "react"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import {
  getCategories,
  getFilteredProducts,
} from "../../services/products"

import type { ProductSort } from "../../services/products"

import ProductCard from "../../components/ProductCard/ProductCard"
import LoadingState from "../../components/LoadingState/LoadingState"
import ErrorState from "../../components/ErrorState/ErrorState"
import EmptyState from "../../components/EmptyState/EmptyState"

import { formatCategory } from "../../utils/formatCategory"

import styles from "./Products.module.css"

const PRODUCTS_PER_PAGE = 12

const Products = () => {

  // URL parameters control the current search,
  // category, sorting and page.
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const search =
    searchParams.get("search") ?? ""

  const selectedCategory =
    searchParams.get("category") ?? ""

  const sort =
    (searchParams.get("sort") ?? "") as ProductSort

  const currentPage = Number(
    searchParams.get("page") ?? "1"
  )

  const page =
    currentPage > 0
      ? currentPage
      : 1

  // Calculates how many products must be skipped
  // for the current page.
  const skip =
    (page - 1) * PRODUCTS_PER_PAGE

  // Keeps the search input independent
  // from the submitted search query.
  const [
    searchInput,
    setSearchInput,
  ] = useState(search)

  // Fetches products according to the current
  // search, category, sorting and pagination.
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({

    queryKey: [
      "products",
      search,
      selectedCategory,
      sort,
      page,
    ],

    queryFn: () => (
      getFilteredProducts({
        search,
        category: selectedCategory,
        limit: PRODUCTS_PER_PAGE,
        skip,
        sort,
      })
    ),

    // Keeps the previous page visible
    // while the next page is loading.
    placeholderData: (
      previousData
    ) => previousData,
  })

  // Fetches all available product categories.
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  // Submits the search form
  // and updates the URL parameters.
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    const trimmedSearch =
      searchInput.trim()

    const params: Record<string, string> = {
      page: "1",
    }

    if (trimmedSearch) {
      params.search = trimmedSearch
    }

    if (selectedCategory) {
      params.category =
        selectedCategory
    }

    if (sort) {
      params.sort = sort
    }

    setSearchParams(params)
  }

  // Clears the current search
  // while preserving the other filters.
  const handleClear = () => {

    setSearchInput("")

    const params: Record<string, string> = {
      page: "1",
    }

    if (selectedCategory) {
      params.category =
        selectedCategory
    }

    if (sort) {
      params.sort = sort
    }

    setSearchParams(params)
  }

  // Changes the selected category
  // and resets pagination.
  const handleCategoryChange = (
    categorySlug: string
  ) => {

    const params: Record<string, string> = {
      category: categorySlug,
      page: "1",
    }

    if (search) {
      params.search = search
    }

    if (sort) {
      params.sort = sort
    }

    setSearchParams(params)
  }

  // Removes the active category filter.
  const handleCategoryClear = () => {

    const params: Record<string, string> = {
      page: "1",
    }

    if (search) {
      params.search = search
    }

    if (sort) {
      params.sort = sort
    }

    setSearchParams(params)
  }

  // Changes sorting
  // and resets pagination.
  const handleSortChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {

    const selectedSort =
      event.target.value as ProductSort

    const params: Record<string, string> = {
      page: "1",
    }

    if (search) {
      params.search = search
    }

    if (selectedCategory) {
      params.category =
        selectedCategory
    }

    if (selectedSort) {
      params.sort = selectedSort
    }

    setSearchParams(params)
  }

  // Changes the current page
  // while preserving active filters.
  const handlePageChange = (
    newPage: number
  ) => {

    const params: Record<string, string> = {
      page: String(newPage),
    }

    if (search) {
      params.search = search
    }

    if (selectedCategory) {
      params.category =
        selectedCategory
    }

    if (sort) {
      params.sort = sort
    }

    setSearchParams(params)
  }

  // Initial loading state.
  if (isLoading) {
    return (
      <LoadingState
        message="Loading products..."
      />
    )
  }

  // Error state.
  if (isError) {
    return (
      <ErrorState
        error={error}
      />
    )
  }

  // TypeScript can safely assume that
  // data exists below this point.
  if (!data) {
    return null
  }

  // Empty state.
  if (data.products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Try another search or category."
      />
    )
  }

  // Calculates the total number of pages.
  const totalPages = Math.ceil(
    data.total / PRODUCTS_PER_PAGE
  )

  const hasPreviousPage =
    page > 1

  const hasNextPage =
    page < totalPages

  return (

    <main className={styles.products}>

      {/* Page heading. */}
      <header className={styles.header}>

        <p className={styles.subtitle}>
          Browse our collection of products.
        </p>

      </header>

      {/* Search controls. */}
      <form
        className={styles.searchForm}
        onSubmit={handleSubmit}
      >

        <input
          className={styles.searchInput}
          type="search"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(
              event.target.value
            )
          }}
          placeholder="Search products..."
        />

        <button
          className={styles.searchButton}
          type="submit"
        >
          Search
        </button>

        {search && (
          <button
            className={styles.clearButton}
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        )}

      </form>

      {/* Category filter controls. */}
      <section className={styles.categories}>

        <div className={styles.categoryList}>

          <button
            className={
              !selectedCategory
                ? styles.categoryActive
                : styles.category
            }
            type="button"
            onClick={handleCategoryClear}
          >
            All
          </button>

          {categoriesLoading && (
            <p>
              Loading categories...
            </p>
          )}

          {categoriesError && (
            <p>
              Failed to load categories.
            </p>
          )}

          {categories?.map(
            (categoryItem) => (

              <button
                className={
                  categoryItem.slug ===
                  selectedCategory
                    ? styles.categoryActive
                    : styles.category
                }
                key={categoryItem.slug}
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    categoryItem.slug
                  )
                }
              >
                {formatCategory(
                  categoryItem.name
                )}
              </button>

            )
          )}

        </div>

      </section>

      {/* Sorting controls and product count. */}
      <section className={styles.toolbar}>

        <span className={styles.productCount}>
          {data.total} products
        </span>

        <div className={styles.sortWrapper}>

          <label
            className={styles.sortLabel}
            htmlFor="sort"
          >
            Sort by:
          </label>

          <select
            className={styles.sort}
            id="sort"
            value={sort}
            onChange={handleSortChange}
          >

            <option value="">
              Default
            </option>

            <option value="price-asc">
              Price: Low to High
            </option>

            <option value="price-desc">
              Price: High to Low
            </option>

            <option value="rating-desc">
              Rating: Highest
            </option>

            <option value="rating-asc">
              Rating: Lowest
            </option>

            <option value="title-asc">
              Name: A to Z
            </option>

            <option value="title-desc">
              Name: Z to A
            </option>

          </select>

        </div>

      </section>

      {/* Shows a loading indicator
          while filters or pages are updating. */}
      {isFetching && (
        <p className={styles.loading}>
          Updating products...
        </p>
      )}

      {/* Product grid. */}
      <section className={styles.grid}>

        {data.products.map(
          (product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          )
        )}

      </section>

      {/* Pagination controls. */}
      {totalPages > 1 && (

        <nav
          className={styles.pagination}
          aria-label="Product pagination"
        >

          <button
            className={styles.pageButton}
            type="button"
            onClick={() =>
              handlePageChange(page - 1)
            }
            disabled={!hasPreviousPage}
          >
            PREVIOUS
          </button>

          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>

          <button
            className={styles.pageButton}
            type="button"
            onClick={() =>
              handlePageChange(page + 1)
            }
            disabled={!hasNextPage}
          >
            NEXT
          </button>

        </nav>

      )}

    </main>
  )
}

export default Products