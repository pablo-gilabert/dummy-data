import {
  useState,
} from "react"

import type {
  FormEvent,
} from "react"

import {
  useSearchParams,
} from "react-router-dom"

import {
  ProductSortSchema,
} from "../../schemas/ProductSortSchema"

import {
  useProducts,
} from "../../hooks/useProducts"

import ProductCard from "../../components/ProductCard/ProductCard"
import LoadingState from "../../components/LoadingState/LoadingState"
import ErrorState from "../../components/ErrorState/ErrorState"
import EmptyState from "../../components/EmptyState/EmptyState"

import {
  formatCategory,
} from "../../utils/formatCategory"

import styles from "./Products.module.css"


const PRODUCTS_PER_PAGE = 12


const createSearchParams = ({
  search,
  category,
  sort,
  page,
}: {
  search?: string
  category?: string
  sort?: string
  page: number
}) => {
  const params: Record<string, string> = {
    page: String(page),
  }

  if (search) {
    params.search = search
  }

  if (category) {
    params.category = category
  }

  if (sort) {
    params.sort = sort
  }

  return params
}


const Products = () => {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()


  const search =
    searchParams.get(
      "search",
    ) ?? ""


  const selectedCategory =
    searchParams.get(
      "category",
    ) ?? ""


  const sortParam =
    searchParams.get(
      "sort",
    ) ?? ""


  const parsedSort =
    ProductSortSchema.safeParse(
      sortParam,
    )


  const sort =
    parsedSort.success
      ? parsedSort.data
      : ""


  const currentPage =
    Number(
      searchParams.get(
        "page",
      ) ?? "1",
    )


  const page =
    currentPage > 0
      ? currentPage
      : 1


  const [
    searchInput,
    setSearchInput,
  ] = useState(
    search,
  )


  const {
    productsQuery,
    categoriesQuery,
  } = useProducts({

    search,

    category:
      selectedCategory,

    sort,

    page,

    limit:
      PRODUCTS_PER_PAGE,

  })


  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } =
    productsQuery


  const {
    data: categories,
    isLoading:
      categoriesLoading,
    isError:
      categoriesError,
  } =
    categoriesQuery


  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {

    event.preventDefault()


    const trimmedSearch =
      searchInput.trim()


    setSearchParams(
      createSearchParams({
        search:
          trimmedSearch,
        category:
          selectedCategory,
        sort,
        page: 1,
      }),
    )

  }


  const handleClear = () => {

    setSearchInput("")


    setSearchParams(
      createSearchParams({
        category:
          selectedCategory,
        sort,
        page: 1,
      }),
    )

  }


  const handleCategoryChange = (
    categorySlug: string,
  ) => {

    setSearchParams(
      createSearchParams({
        search,
        category:
          categorySlug,
        sort,
        page: 1,
      }),
    )

  }


  const handleCategoryClear = () => {

    setSearchParams(
      createSearchParams({
        search,
        sort,
        page: 1,
      }),
    )

  }


  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {

    const parsedSort =
      ProductSortSchema.safeParse(
        event.target.value,
      )


    const selectedSort =
      parsedSort.success
        ? parsedSort.data
        : ""


    setSearchParams(
      createSearchParams({
        search,
        category:
          selectedCategory,
        sort:
          selectedSort,
        page: 1,
      }),
    )

  }


  const handlePageChange = (
    newPage: number,
  ) => {

    setSearchParams(
      createSearchParams({
        search,
        category:
          selectedCategory,
        sort,
        page: newPage,
      }),
    )

  }


  if (isLoading) {

    return (
      <LoadingState
        message="Loading products..."
      />
    )

  }


  if (isError) {

    return (
      <ErrorState
        error={error}
      />
    )

  }


  if (!data) {

    return null

  }


  if (
    data.products.length === 0
  ) {

    return (
      <EmptyState
        title="No products found"
        message="Try another search or category."
      />
    )

  }


  const totalPages =
    Math.ceil(
      data.total /
      PRODUCTS_PER_PAGE,
    )


  const hasPreviousPage =
    page > 1


  const hasNextPage =
    page < totalPages


  return (

    <main
      className={
        styles.products
      }
    >

      <header
        className={
          styles.header
        }
      >

        <p
          className={
            styles.subtitle
          }
        >
          Browse our collection
          of products.
        </p>

      </header>


      <form
        className={
          styles.searchForm
        }
        onSubmit={
          handleSubmit
        }
      >

        <input
          className={
            styles.searchInput
          }
          type="search"
          value={
            searchInput
          }
          onChange={(event) => {

            setSearchInput(
              event.target.value,
            )

          }}
          placeholder="Search products..."
        />


        <button
          className={
            styles.searchButton
          }
          type="submit"
        >
          Search
        </button>


        {search && (

          <button
            className={
              styles.clearButton
            }
            type="button"
            onClick={
              handleClear
            }
          >
            Clear
          </button>

        )}

      </form>


      <section
        className={
          styles.categories
        }
      >

        <div
          className={
            styles.categoryList
          }
        >

          <button
            className={
              !selectedCategory
                ? styles.categoryActive
                : styles.category
            }
            type="button"
            onClick={
              handleCategoryClear
            }
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
                key={
                  categoryItem.slug
                }
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    categoryItem.slug,
                  )
                }
              >
                {
                  formatCategory(
                    categoryItem.name,
                  )
                }
              </button>

            )
          )}

        </div>

      </section>


      <section
        className={
          styles.toolbar
        }
      >

        <span
          className={
            styles.productCount
          }
        >
          {
            data.total
          } products
        </span>


        <div
          className={
            styles.sortWrapper
          }
        >

          <label
            className={
              styles.sortLabel
            }
            htmlFor="sort"
          >
            Sort by:
          </label>


          <select
            className={
              styles.sort
            }
            id="sort"
            value={sort}
            onChange={
              handleSortChange
            }
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


      {isFetching && (

        <p
          className={
            styles.loading
          }
        >
          Updating products...
        </p>

      )}


      <section
        className={
          styles.grid
        }
      >

        {data.products.map(
          (product) => (

            <ProductCard
              key={
                product.id
              }
              product={
                product
              }
            />

          )
        )}

      </section>


      {totalPages > 1 && (

        <nav
          className={
            styles.pagination
          }
          aria-label="Product pagination"
        >

          <button
            className={
              styles.pageButton
            }
            type="button"
            onClick={() =>
              handlePageChange(
                page - 1,
              )
            }
            disabled={
              !hasPreviousPage
            }
          >
            PREVIOUS
          </button>


          <span
            className={
              styles.pageInfo
            }
          >
            Page {page} of {totalPages}
          </span>


          <button
            className={
              styles.pageButton
            }
            type="button"
            onClick={() =>
              handlePageChange(
                page + 1,
              )
            }
            disabled={
              !hasNextPage
            }
          >
            NEXT
          </button>

        </nav>

      )}

    </main>

  )

}


export default Products