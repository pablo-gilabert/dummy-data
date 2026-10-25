import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ThemeToggle from "./ThemeToggle"

describe("ThemeToggle", () => {
    beforeEach(() => {
        localStorage.removeItem("dummy-data-theme")
        document.documentElement.dataset.theme = "light"
        document.documentElement.style.colorScheme = "light"
    })

    afterEach(() => {
        localStorage.removeItem("dummy-data-theme")
        document.documentElement.dataset.theme = "light"
        document.documentElement.style.colorScheme = "light"
    })

    it("switches modes and persists the selected mode", async () => {
        const user = userEvent.setup()
        render(<ThemeToggle />)

        await user.click(screen.getByRole("button", { name: "Switch to dark mode" }))
        expect(document.documentElement.dataset.theme).toBe("dark")
        expect(localStorage.getItem("dummy-data-theme")).toBe("dark")

        await user.click(screen.getByRole("button", { name: "Switch to light mode" }))
        expect(document.documentElement.dataset.theme).toBe("light")
        expect(localStorage.getItem("dummy-data-theme")).toBe("light")
    })

    it("reflects a theme applied before React initializes", () => {
        document.documentElement.dataset.theme = "dark"
        render(<ThemeToggle />)
        expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument()
    })
})
