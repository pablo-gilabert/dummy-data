import {
  useState,
} from "react"

import type {
  FormEvent,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  useAuth,
} from "../../AuthContext/useAuth"

import styles from "./Login.module.css"

const Login = () => {

  const navigate = useNavigate()

  const {
    login,
  } = useAuth()

  const [
    username,
    setUsername,
  ] = useState("")

  const [
    password,
    setPassword,
  ] = useState("")

  const [
    error,
    setError,
  ] = useState("")

  const [
    isLoading,
    setIsLoading,
  ] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError("")

    if (!username.trim()) {

      setError(
        "Username is required."
      )

      return
    }

    if (!password) {

      setError(
        "Password is required."
      )

      return
    }

    setIsLoading(true)

    try {

      await login(
        username.trim(),
        password
      )

      navigate("/products")

    } catch (error) {

      if (error instanceof Error) {

        setError(error.message)

      } else {

        setError(
          "Unable to log in."
        )
      }

    } finally {

      setIsLoading(false)
    }
  }

  return (

    <main className={styles.login}>

      <section className={styles.card}>

        <h1 className={styles.title}>
          Login
        </h1>

        <p className={styles.message}>
          Sign in to continue.
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          <div className={styles.field}>

            <label
              htmlFor="username"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              autoComplete="username"
              disabled={isLoading}
            />

          </div>

          <div className={styles.field}>

            <label
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              disabled={isLoading}
            />

          </div>

          {error && (

            <p
              className={styles.error}
              role="alert"
            >
              {error}
            </p>

          )}

          <button
            className={styles.button}
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>

      </section>

    </main>
  )
}

export default Login