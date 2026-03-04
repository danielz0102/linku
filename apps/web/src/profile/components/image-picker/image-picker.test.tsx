import { render, screen } from "@testing-library/react"
import { ImagePicker } from "./image-picker"

test("shows default image when provided", () => {
  render(<ImagePicker defaultImage="https://example.com/avatar.jpg" />)

  expect(screen.getByAltText(/profile preview/i)).toHaveAttribute(
    "src",
    "https://example.com/avatar.jpg"
  )
})
