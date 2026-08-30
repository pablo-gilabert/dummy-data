import {
  useNavigate,
} from "react-router-dom"

import styles from "./NotFound.module.css"

const NotFound = () => {

  const navigate = useNavigate()

  const handleBackToProducts = () => {

    navigate("/products")
  }

  return (

    <main className={styles.notFound}>

      <section className={styles.card}>

        <p className={styles.code}>
          404
        </p>

        <h1 className={styles.title}>
          Page not found
        </h1>

        <p className={styles.message}>
          The page you are looking for
          does not exist.
        </p>

        <button
          className={styles.button}
          type="button"
          onClick={handleBackToProducts}
        >
          Back to products
        </button>

      </section>

    </main>
  )
}

export default NotFound