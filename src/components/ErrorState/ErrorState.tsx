import { ApiError } from "../../services/api"

import styles from "./ErrorState.module.css"

interface ErrorStateProps {
  error: Error
}

const ErrorState = ({
  error,
}: ErrorStateProps) => {

  const isApiError =
    error instanceof ApiError

  const status =
    isApiError
      ? error.status
      : null

  const getTitle = () => {

    if (status === 404) {
      return "Not found"
    }

    if (status !== null && status >= 500) {
      return "Server error"
    }

    if (status === 0) {
      return "Connection error"
    }

    return "Something went wrong"
  }

  return (
    <section className={styles.container}>

      <h2 className={styles.title}>
        {getTitle()}
      </h2>

      {status !== null && status > 0 && (
        <span className={styles.status}>
          Error {status}
        </span>
      )}

      <p className={styles.message}>
        {error.message}
      </p>

    </section>
  )
}

export default ErrorState