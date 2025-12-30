import { render } from "@testing-library/react"

function Component() {
  return <h1>Hello World</h1>
}

test("renders correctly", () => {
  const { getByText } = render(<Component />)
  expect(getByText("Hello World")).toBeVisible()
})
