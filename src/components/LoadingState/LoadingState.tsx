import styles from "./LoadingState.module.css"

interface LoadingStateProps {
  message?: string
}

const LoadingState = ({
  message = "Loading...",
}: LoadingStateProps) => {

  return (
    <div className={styles.container}>
      <p className={styles.message}>
        {message}
      </p>
    </div>
  )
}

export default LoadingState