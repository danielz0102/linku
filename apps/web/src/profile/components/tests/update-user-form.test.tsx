import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { UpdateUserForm } from "~/profile/components/update-user-form"

test("submits valid update data", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(<UpdateUserForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/first name/i), "John")
  await user.type(screen.getByLabelText(/last name/i), "Doe")
  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/bio/i), "Hi, I'm John")
  await user.click(screen.getByRole("button", { name: /save changes/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    bio: "Hi, I'm John",
  })
})

test("renders default values", () => {
  render(
    <UpdateUserForm
      onSubmit={vi.fn()}
      defaultValues={{
        firstName: "Jane",
        lastName: "Doe",
        username: "janedoe",
        bio: "Hello there",
      }}
    />
  )

  expect(screen.getByLabelText(/first name/i)).toHaveValue("Jane")
  expect(screen.getByLabelText(/last name/i)).toHaveValue("Doe")
  expect(screen.getByLabelText(/username/i)).toHaveValue("janedoe")
  expect(screen.getByLabelText(/bio/i)).toHaveValue("Hello there")
})

test("does not submit invalid form", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(<UpdateUserForm onSubmit={onSubmit} />)

  await user.click(screen.getByRole("button", { name: /save changes/i }))

  expect(screen.getByLabelText(/first name/i)).toBeInvalid()
  expect(screen.getByLabelText(/last name/i)).toBeInvalid()
  expect(screen.getByLabelText(/username/i)).toBeInvalid()
  expect(onSubmit).not.toHaveBeenCalled()
})

test("truncates bio input to 200 characters", async () => {
  const user = userEvent.setup()
  render(<UpdateUserForm onSubmit={vi.fn()} />)

  const bioInput = screen.getByLabelText(/bio/i)
  await user.type(bioInput, "A".repeat(250))

  expect(bioInput).toHaveValue("A".repeat(200))
})
