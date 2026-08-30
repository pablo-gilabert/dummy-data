import type { Product } from "../../types/Product"

import { FaStar } from "react-icons/fa6"

import {
  Link,
  useLocation,
} from "react-router-dom"

import { formatCategory } from "../../utils/formatCategory"

import styles from "./ProductCard.module.css"

interface ProductCardProps {
  product: Product
}

const ProductCard = ({
  product,
}: ProductCardProps) => {

  const location = useLocation()

  const currentLocation =
    location.pathname +
    location.search

  return (

    <Link
      to={`/products/${product.id}`}
      state={{
        from: currentLocation,
      }}
    >

      <article className={styles.card}>

        <img
          className={styles.image}
          src={product.thumbnail}
          alt={product.title}
        />

        <div className={styles.background}>

          <h1 className={styles.category}>
            {formatCategory(
              product.category
            )}
          </h1>

          <h2 className={styles.title}>
            {product.title}
          </h2>

          <p className={styles.rating}>

            <FaStar
              className={styles.ratingIcon}
            />

            {product.rating}

          </p>

          <p className={styles.price}>
            $ {product.price}
          </p>

          <p className={styles.details}>
            See details...
          </p>

        </div>

      </article>

    </Link>
  )
}

export default ProductCard