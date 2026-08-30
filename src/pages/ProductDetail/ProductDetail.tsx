import { useQuery } from "@tanstack/react-query"

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"

import { getProduct } from "../../services/products"

import { useCart } from "../../CartContext/useCart"

import LoadingState from "../../components/LoadingState/LoadingState"
import ErrorState from "../../components/ErrorState/ErrorState"
import ProductGallery from "../../components/ProductGallery/ProductGallery"
import ProductReviews from "../../components/ProductReviews/ProductReviews"

import { formatCategory } from "../../utils/formatCategory"

import styles from "./ProductDetail.module.css"

const ProductDetail = () => {

  const {
    id,
  } = useParams()

  const location =
    useLocation()

  const navigate =
    useNavigate()

  const {
    addItem,
  } = useCart()

  const productId =
    Number(id)

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({

    queryKey: [
      "product",
      productId,
    ],

    queryFn: () => (
      getProduct(productId)
    ),

    enabled:
      Number.isInteger(productId) &&
      productId > 0,

  })

  const handleBack = () => {

    if (location.state?.from) {

      navigate(
        location.state.from
      )

      return
    }

    navigate(
      "/products"
    )
  }

  if (
    !id ||
    !Number.isInteger(productId) ||
    productId <= 0
  ) {

    return (
      <ErrorState
        error={
          new Error(
            "Invalid product ID."
          )
        }
      />
    )
  }

  if (isLoading) {

    return (
      <LoadingState
        message="Loading product..."
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

    return (
      <p>
        Product not found.
      </p>
    )
  }

  const originalPrice =
    data.price /
    (1 - data.discountPercentage / 100)

  return (

    <main
      className={styles.main}
    >

      <button
        className={styles.backButton}
        type="button"
        onClick={handleBack}
      >
        Back to products
      </button>

      <ProductGallery
        product={data}
      />

      <section
        className={styles.info}
      >

        <p
          className={styles.category}
        >
          {formatCategory(
            data.category
          )}
        </p>

        <h1
          className={styles.title}
        >
          {data.title}
        </h1>

        <div
          className={styles.rating}
        >

          <span>
            ★
          </span>

          <span>
            {data.rating}
          </span>

        </div>

        <div
          className={
            styles.priceContainer
          }
        >

          <span
            className={styles.price}
          >
            $ {data.price.toFixed(2)}
          </span>

          {data.discountPercentage > 0 && (

            <>

              <span
                className={
                  styles.originalPrice
                }
              >
                $ {originalPrice.toFixed(2)}
              </span>

              <span
                className={styles.discount}
              >
                {Math.round(
                  data.discountPercentage
                )}% OFF
              </span>

            </>

          )}

        </div>

        <div
          className={styles.stock}
        >

          <span>
            {data.availabilityStatus}
          </span>

          <span>
            {data.stock} units available
          </span>

        </div>

        <p
          className={
            styles.description
          }
        >
          {data.description}
        </p>

      </section>

      <button
        className={styles.buttonCart}
        type="button"
        onClick={() =>
          addItem(data)
        }
      >
        Add to cart
      </button>

      <ProductReviews
        reviews={data.reviews}
      />

    </main>
  )
}

export default ProductDetail