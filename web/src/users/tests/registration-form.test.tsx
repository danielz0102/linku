import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { RegistrationForm } from "~/users/components/registration-form"

test("has all form fields", () => {
  renderWithQueryClient(<RegistrationForm />)

  expect(screen.getByLabelText(/first name/i)).toBeVisible()
  expect(screen.getByLabelText(/last name/i)).toBeVisible()
  expect(screen.getByLabelText(/username/i)).toBeVisible()
  expect(screen.getByLabelText(/email address/i)).toBeVisible()
  expect(screen.getByLabelText(/^password$/i)).toBeVisible()
  expect(screen.getByLabelText(/confirm password/i)).toBeVisible()
  expect(screen.getByRole("button", { name: /create account/i })).toBeVisible()
})

function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}
