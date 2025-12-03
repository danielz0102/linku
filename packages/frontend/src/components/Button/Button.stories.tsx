import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import Button from "./index"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: { onClick: fn() },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-neutral-900 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default button with primary styling
 */
export const Default: Story = {
  args: {
    children: "Log In",
  },
}

/**
 * Button in loading state with spinner
 */
export const Loading: Story = {
  args: {
    children: "Log In",
    isLoading: true,
  },
}

/**
 * Disabled button that cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    children: "Log In",
    disabled: true,
  },
}

/**
 * Submit button type for use in forms
 */
export const SubmitButton: Story = {
  render: () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        alert("Form submitted!")
      }}
    >
      <Button type="submit">Submit Form</Button>
    </form>
  ),
}

/**
 * Button with custom className for full width
 */
export const CustomClassName: Story = {
  args: {
    children: "Full Width Button",
    className: "w-full",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-xl bg-neutral-900 p-8">
        <Story />
      </div>
    ),
  ],
}
