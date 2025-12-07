import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn } from "storybook/test"
import ToggleSwitch from "."

const meta = {
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
    textOff: "Option 1",
    textOn: "Option 2",
  },
  play: async ({ args, userEvent, canvas }) => {
    const sw = canvas.getByRole("switch", {
      name: "Switch between Option 1 and Option 2",
    })

    await userEvent.click(sw)

    await expect(sw).toBeChecked()
    await expect(args.onChange).toHaveBeenCalledWith(true)

    await userEvent.keyboard(" ")

    await expect(sw).not.toBeChecked()
    await expect(args.onChange).toHaveBeenCalledWith(false)
  },
}
