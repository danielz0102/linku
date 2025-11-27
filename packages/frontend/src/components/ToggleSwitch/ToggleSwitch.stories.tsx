import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import ToggleSwitch from "."

const meta = {
  title: "UI/ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    layout: "centered",
  },
  args: { onChange: fn() },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-2xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleSwitch>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Normal toggle switch button
 */
export const Default: Story = {
  args: {
    textOn: "Option 1",
    textOff: "Option 2",
  },
}
