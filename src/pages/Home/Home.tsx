import {
  FaArrowRight,
  FaFilter,
  FaMagnifyingGlass,
  FaSort,
} from "react-icons/fa6"

import { Link } from "react-router-dom"

import styles from "./Home.module.css"

const Home = () => {
  return (
    <main className={styles.home}>

      {/* ================================
          Hero
          ================================ */}

      <section className={styles.hero}>

        <div className={styles.heroContent}>

          <span className={styles.eyebrow}>
            DummyJSON API
          </span>

          <h1 className={styles.heroTitle}>
            Explore products.
            <br />
            Discover the data.
          </h1>

          <p className={styles.heroDescription}>
            Browse a collection of products powered by
            the DummyJSON API. Search, filter and sort
            products through a simple shopping experience.
          </p>

          <Link
            to="/products"
            className={styles.primaryButton}
          >
            Browse products

            <FaArrowRight
              aria-hidden="true"
            />
          </Link>

        </div>

        <div
          className={styles.heroVisual}
          aria-hidden="true"
        >
          <div className={styles.visualCard}>

            <div className={styles.visualHeader}>
              <span />
              <span />
              <span />
            </div>

            <div className={styles.visualContent}>

              <div className={styles.visualImage} />

              <div className={styles.visualLines}>
                <span />
                <span />
                <span />
              </div>

              <div className={styles.visualFooter}>
                <span />
                <span />
              </div>

            </div>

          </div>
        </div>

      </section>


      {/* ================================
          Features
          ================================ */}

      <section className={styles.features}>

        <div className={styles.sectionHeader}>

          <span className={styles.eyebrow}>
            What you can do
          </span>

          <h2 className={styles.sectionTitle}>
            Explore the catalog your way.
          </h2>

          <p className={styles.sectionDescription}>
            The application combines a product API with
            a responsive shopping interface.
          </p>

        </div>


        <div className={styles.featureGrid}>

          <article className={styles.featureCard}>

            <div className={styles.featureIcon}>
              <FaMagnifyingGlass
                aria-hidden="true"
              />
            </div>

            <h3 className={styles.featureTitle}>
              Search
            </h3>

            <p className={styles.featureDescription}>
              Find products quickly by searching
              through the catalog.
            </p>

          </article>


          <article className={styles.featureCard}>

            <div className={styles.featureIcon}>
              <FaFilter
                aria-hidden="true"
              />
            </div>

            <h3 className={styles.featureTitle}>
              Filter
            </h3>

            <p className={styles.featureDescription}>
              Explore products by category and narrow
              down the available results.
            </p>

          </article>


          <article className={styles.featureCard}>

            <div className={styles.featureIcon}>
              <FaSort
                aria-hidden="true"
              />
            </div>

            <h3 className={styles.featureTitle}>
              Sort
            </h3>

            <p className={styles.featureDescription}>
              Organize products by different sorting
              options to find what you need.
            </p>

          </article>

        </div>

      </section>


      {/* ================================
          Technology / CTA
          ================================ */}

      <section className={styles.cta}>

        <div className={styles.ctaContent}>

          <span className={styles.eyebrow}>
            Built with real data
          </span>

          <h2 className={styles.ctaTitle}>
            A frontend project focused on
            <span> API integration.</span>
          </h2>

          <p className={styles.ctaDescription}>
            Products, authentication, cart management,
            checkout and orders come together in one
            responsive React application.
          </p>

        </div>

        <Link
          to="/products"
          className={styles.secondaryButton}
        >
          Explore the catalog

          <FaArrowRight
            aria-hidden="true"
          />
        </Link>

      </section>

    </main>
  )
}

export default Home