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
  render: (args) => (
    <div className="w-2xs">
      <ToggleSwitch {...args} />
    </div>
  ),
} satisfies Meta<typeof ToggleSwitch>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    textOn: "Option 1",
    textOff: "Option 2",
  },
}
