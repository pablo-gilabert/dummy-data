import styles from "./EmptyState.module.css"

interface EmptyStateProps {
  title?: string
  message?: string
}

const EmptyState = ({
  title = "No results found",
  message = "There are no products matching your search.",
}: EmptyStateProps) => {

  return (
    <section className={styles.container}>

      <h2 className={styles.title}>
        {title}
      </h2>

      <p className={styles.message}>
        {message}
      </p>

    </section>
  )
}

export default EmptyState