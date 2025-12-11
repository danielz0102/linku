import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn } from "storybook/test"
import Button from "./index"
import { Google } from "~/components/icons/Google"

const meta = {
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
  play: async ({ args, userEvent, canvas }) => {
    await userEvent.click(canvas.getByRole("button"))
    await expect(args.onClick).toHaveBeenCalled()
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
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /loading/i })
    await expect(button).toBeVisible()
    await expect(button).toBeDisabled()
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
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Log In" })
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
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

/**
 * Secondary button variant with transparent background and white border
 */
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
}

/**
 * Button with icon and text
 */
export const WithIcon: Story = {
  args: {
    variant: "secondary",
    children: (
      <>
        <Google />
        Sign in with Google
      </>
    ),
  },
}
