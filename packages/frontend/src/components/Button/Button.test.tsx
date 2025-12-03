import { expect, vi, test } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Button from "./index"

test("renders with children text", () => {
  render(<Button>Log In</Button>)

  const button = screen.getByRole("button", { name: "Log In" })

  expect(button).toBeVisible()
})

test("calls onClick when clicked", async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  const button = screen.getByRole("button", { name: "Click me" })
  await user.click(button)

  expect(handleClick).toHaveBeenCalledTimes(1)
})

test("supports type prop", () => {
  const { rerender } = render(<Button type="submit">Submit</Button>)

  let button = screen.getByRole("button", { name: "Submit" })
  expect(button).toHaveAttribute("type", "submit")

  rerender(<Button type="button">Click</Button>)

  button = screen.getByRole("button", { name: "Click" })
  expect(button).toHaveAttribute("type", "button")

  rerender(<Button type="reset">Reset</Button>)

  button = screen.getByRole("button", { name: "Reset" })
  expect(button).toHaveAttribute("type", "reset")
})

test("shows feedback when loading", () => {
  render(<Button isLoading>Click</Button>)

  const button = screen.getByRole("button", { name: /loading/i })

  expect(button).toBeVisible()
})

test("is disabled when isLoading is true", () => {
  render(<Button isLoading>Loading</Button>)
  expect(screen.getByRole("button")).toBeDisabled()
})

test("does not call onClick when loading", async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(
    <Button isLoading onClick={handleClick}>
      Loading
    </Button>
  )

  const button = screen.getByRole("button")
  await user.click(button)

  expect(handleClick).not.toHaveBeenCalled()
})

test("is disabled when disabled prop is true", () => {
  render(<Button disabled>Disabled</Button>)

  const button = screen.getByRole("button", { name: "Disabled" })

  expect(button).toBeDisabled()
})

test("accepts and applies custom className", () => {
  render(<Button className="w-full">Custom</Button>)

  const button = screen.getByRole("button", { name: "Custom" })

  expect(button).toHaveClass("w-full")
})

test("supports keyboard interaction with Enter", async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Press Enter</Button>)

  const button = screen.getByRole("button", { name: "Press Enter" })

  button.focus()
  expect(document.activeElement).toBe(button)

  await user.keyboard("{Enter}")

  expect(handleClick).toHaveBeenCalledTimes(1)
})

test("supports keyboard interaction with Space", async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Press Space</Button>)

  const button = screen.getByRole("button", { name: "Press Space" })

  button.focus()

  await user.keyboard(" ")

  expect(handleClick).toHaveBeenCalledTimes(1)
})
