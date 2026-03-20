import { render } from "vitest-browser-react"

import { UpdateUserForm } from "~/sections/profile/components/update-user-form"

test("submits valid update data", async () => {
  const onSubmit = vi.fn()

  const screen = await render(<UpdateUserForm onSubmit={onSubmit} />)

  await screen.getByLabelText(/first name/i).fill("John")
  await screen.getByLabelText(/last name/i).fill("Doe")
  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/bio/i).fill("Hi, I'm John")
  await screen.getByRole("button", { name: /save changes/i }).click()

  expect(onSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    bio: "Hi, I'm John",
  })
})

test("renders default values", async () => {
  const screen = await render(
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

  await expect.element(screen.getByLabelText(/first name/i)).toHaveValue("Jane")
  await expect.element(screen.getByLabelText(/last name/i)).toHaveValue("Doe")
  await expect.element(screen.getByLabelText(/username/i)).toHaveValue("janedoe")
  await expect.element(screen.getByLabelText(/bio/i)).toHaveValue("Hello there")
})

test("does not submit invalid form", async () => {
  const onSubmit = vi.fn()

  const screen = await render(<UpdateUserForm onSubmit={onSubmit} />)

  await screen.getByRole("button", { name: /save changes/i }).click()

  await expect.element(screen.getByLabelText(/first name/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/last name/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/username/i)).toBeInvalid()
  expect(onSubmit).not.toHaveBeenCalled()
})

test("truncates bio input to 200 characters", async () => {
  const screen = await render(<UpdateUserForm onSubmit={vi.fn()} />)

  const bioInput = screen.getByLabelText(/bio/i)
  await bioInput.fill("A".repeat(250))

  await expect.element(bioInput).toHaveValue("A".repeat(200))
})
