import { FaStar } from "react-icons/fa6"

import type { Product } from "../../types/Product"

import styles from "./ProductReviews.module.css"

interface ProductReviewsProps {
  reviews: Product["reviews"]
}

const ProductReviews = ({
  reviews,
}: ProductReviewsProps) => {

  if (!reviews || reviews.length === 0) {
    return null
  }

  return (

    <section
      className={styles.reviews}
      aria-labelledby="reviews-title"
    >

      <h2
        className={styles.title}
        id="reviews-title"
      >
        Reviews
      </h2>

      <div className={styles.list}>

        {reviews.map((review, index) => (

          <article
            className={styles.review}
            key={`${review.reviewerName}-${index}`}
          >

            <div className={styles.header}>

              <span className={styles.name}>
                {review.reviewerName}
              </span>

              <span className={styles.rating}>

                <FaStar
                  className={styles.ratingIcon}
                />

                {review.rating}

              </span>

            </div>

            <p className={styles.comment}>
              {review.comment}
            </p>

            <time
              className={styles.date}
              dateTime={review.date}
            >
              {new Date(
                review.date
              ).toLocaleDateString()}
            </time>

          </article>

        ))}

      </div>

    </section>
  )
}

export default ProductReviews