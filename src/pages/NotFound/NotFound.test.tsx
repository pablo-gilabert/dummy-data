import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  render,
  screen,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import {
  MemoryRouter,
} from "react-router-dom"

import NotFound from "./NotFound"

const mockedNavigate =
  vi.fn()

vi.mock(
  "react-router-dom",
  async () => {

    const actual =
      await vi.importActual<
        typeof import(
          "react-router-dom"
        )
      >(
        "react-router-dom"
      )

    return {
      ...actual,

      useNavigate: () =>
        mockedNavigate,
    }
  }
)

describe("NotFound", () => {

  beforeEach(() => {

    vi.clearAllMocks()
  })

  it(
    "renders the not found page",
    () => {

      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      )

      expect(
        screen.getByText(
          "404"
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "heading",
          {
            name:
              "Page not found",
          }
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          "The page you are looking for does not exist."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole(
          "button",
          {
            name:
              "Back to products",
          }
        )
      ).toBeInTheDocument()
    }
  )

  it(
    "navigates to products when clicking Back to products",
    async () => {

      const user =
        userEvent.setup()

      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      )

      await user.click(
        screen.getByRole(
          "button",
          {
            name:
              "Back to products",
          }
        )
      )

      expect(
        mockedNavigate
      ).toHaveBeenCalledTimes(
        1
      )

      expect(
        mockedNavigate
      ).toHaveBeenCalledWith(
        "/products"
      )
    }
  )
})