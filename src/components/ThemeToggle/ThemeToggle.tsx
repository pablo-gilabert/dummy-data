import { useState } from "react"
import { FiMoon, FiSun } from "react-icons/fi"

import styles from "./ThemeToggle.module.css"

type Theme = "light" | "dark"

const STORAGE_KEY = "dummy-data-theme"

// Update presentation preferences without touching the shopping application state.
const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(() =>
        document.documentElement.dataset.theme === "dark" ? "dark" : "light"
    )

    const toggleTheme = () => {
        const nextTheme: Theme = theme === "dark" ? "light" : "dark"

        document.documentElement.dataset.theme = nextTheme
        document.documentElement.style.colorScheme = nextTheme

        try {
            localStorage.setItem(STORAGE_KEY, nextTheme)
        } catch {
            // The theme still works if browser storage is unavailable.
        }

        setTheme(nextTheme)
    }

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
    )
}

export default ThemeToggle
