import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"

import type {
  User,
} from "../types/User"

import {
  clearStoredUser,
  getAccessToken,
  getStoredUser,
  setStoredUser,
} from "./authStorage"

const createUser = (): User => ({
  id: 1,
  username: "testuser",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  gender: "male",
  image: "https://example.com/image.jpg",
  accessToken: "access-token",
  refreshToken: "refresh-token",
})

describe("authStorage", () => {

  beforeEach(() => {
    localStorage.clear()
  })

  it("returns null when there is no stored user", () => {

    expect(
      getStoredUser()
    ).toBeNull()
  })

  it("stores and retrieves a user", () => {

    const user =
      createUser()

    setStoredUser(user)

    expect(
      getStoredUser()
    ).toEqual(user)
  })

  it("returns the stored access token", () => {

    const user =
      createUser()

    setStoredUser(user)

    expect(
      getAccessToken()
    ).toBe("access-token")
  })

  it("returns null when there is no access token", () => {

    expect(
      getAccessToken()
    ).toBeNull()
  })

  it("clears the stored user", () => {

    const user =
      createUser()

    setStoredUser(user)

    clearStoredUser()

    expect(
      getStoredUser()
    ).toBeNull()

    expect(
      getAccessToken()
    ).toBeNull()
  })

  it("removes corrupted user data", () => {

    localStorage.setItem(
      "user",
      "{invalid json"
    )

    expect(
      getStoredUser()
    ).toBeNull()

    expect(
      localStorage.getItem("user")
    ).toBeNull()
  })

})