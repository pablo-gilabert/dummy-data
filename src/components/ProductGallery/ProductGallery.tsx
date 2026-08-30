import { useState } from "react"

import type { Product } from "../../types/Product"

import styles from "./ProductGallery.module.css"

interface ProductGalleryProps {
  product: Product
}

const ProductGallery = ({
  product,
}: ProductGalleryProps) => {

  const images = product.images?.length
    ? product.images
    : [product.thumbnail]

  const [selectedImage, setSelectedImage] =
    useState(images[0])

  return (

    <section
      className={styles.gallery}
      aria-label="Product images"
    >

      <div className={styles.mainImageContainer}>

        <img
          className={styles.mainImage}
          src={selectedImage}
          alt={product.title}
        />

      </div>

      {images.length > 1 && (

        <div className={styles.thumbnailList}>

          {images.map(
            (image, index) => (

              <button
                className={
                  image === selectedImage
                    ? styles.thumbnailActive
                    : styles.thumbnail
                }
                key={image}
                type="button"
                onClick={() =>
                  setSelectedImage(image)
                }
                aria-label={`View product image ${index + 1}`}
                aria-pressed={
                  image === selectedImage
                }
              >

                <img
                  src={image}
                  alt=""
                />

              </button>

            )
          )}

        </div>

      )}

    </section>
  )
}

export default ProductGallery