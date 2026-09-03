import {
  useForm,
} from "react-hook-form"

import {
  zodResolver,
} from "@hookform/resolvers/zod"

import {
  useNavigate,
} from "react-router-dom"

import {
  useAuth,
} from "../../AuthContext/useAuth"

import {
  LoginSchema,
  type LoginFormData,
} from "../../schemas/LoginSchema"

import styles from "./Login.module.css"


const Login = () => {

  const navigate =
    useNavigate()

  const {
    login,
  } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver:
      zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (
    data: LoginFormData,
  ) => {

    try {

      await login(
        data.username,
        data.password,
      )

      navigate("/products")

    } catch (error) {

      setError(
        "root",
        {
          message:
            error instanceof Error
              ? error.message
              : "Unable to log in.",
        },
      )
    }
  }

  return (
    <main
      className={styles.login}
    >

      <section
        className={styles.card}
      >

        <h1
          className={styles.title}
        >
          Login
        </h1>

        <p
          className={styles.message}
        >
          Sign in to continue.
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit(
            onSubmit,
          )}
        >

          <div
            className={styles.field}
          >

            <label
              htmlFor="username"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              {...register(
                "username",
              )}
              autoComplete="username"
              disabled={isSubmitting}
            />

            {errors.username && (
              <p
                className={styles.error}
                role="alert"
              >
                {
                  errors.username
                    .message
                }
              </p>
            )}

          </div>

          <div
            className={styles.field}
          >

            <label
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              {...register(
                "password",
              )}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            {errors.password && (
              <p
                className={styles.error}
                role="alert"
              >
                {
                  errors.password
                    .message
                }
              </p>
            )}

          </div>

          {errors.root && (
            <p
              className={styles.error}
              role="alert"
            >
              {
                errors.root.message
              }
            </p>
          )}

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>

      </section>

    </main>
  )
}

export default Login