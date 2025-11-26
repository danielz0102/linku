import type { Meta, StoryObj } from "@storybook/react-vite"
import FormField from "./index"

const meta = {
  title: "UI/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-xl bg-neutral-900 p-8">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Simple email/username field
 */
export const EmailField: Story = {
  render: () => (
    <FormField>
      <FormField.Label>Email / Username</FormField.Label>
      <FormField.Input type="text" placeholder="Enter your email or username" />
    </FormField>
  ),
}

/**
 * Password field with visibility toggle. Click the eye icon to show/hide the password.
 */
export const PasswordField: Story = {
  render: () => (
    <FormField>
      <FormField.Label>Password</FormField.Label>
      <FormField.Input type="password" placeholder="Enter your password" />
    </FormField>
  ),
}

/**
 * Password field without the visibility toggle.
 */
export const PasswordFieldWithoutToggle: Story = {
  render: () => (
    <FormField>
      <FormField.Label>Password</FormField.Label>
      <FormField.Input
        type="password"
        placeholder="Enter your password"
        hideVisibilityToggle
      />
    </FormField>
  ),
}

/**
 * Field with an optional action link.
 */
export const FieldWithLink: Story = {
  render: () => (
    <FormField>
      <FormField.LabelRow>
        <FormField.Label>Password</FormField.Label>
        <FormField.Link href="#">Forgot Password?</FormField.Link>
      </FormField.LabelRow>
      <FormField.Input type="password" placeholder="Enter your password" />
    </FormField>
  ),
}

/**
 * Complete login form with email and password fields.
 */
export const CompleteLoginForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FormField>
        <FormField.Label>Email / Username</FormField.Label>
        <FormField.Input
          type="text"
          placeholder="Enter your email or username"
        />
      </FormField>

      <FormField>
        <FormField.LabelRow>
          <FormField.Label>Password</FormField.Label>
          <FormField.Link href="#">Forgot Password?</FormField.Link>
        </FormField.LabelRow>
        <FormField.Input type="password" placeholder="Enter your password" />
      </FormField>
    </div>
  ),
}
