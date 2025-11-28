import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ToggleSwitch from "./index"

describe("ToggleSwitch", () => {
  it("renders with correct accessible name and initial state", () => {
    render(<ToggleSwitch textOff="Off" textOn="On" />)

    const sw = screen.getByRole("switch", {
      name: "Switch between Off and On",
    })

    expect(sw).toHaveAttribute("aria-checked", "false")
  })

  it("clicking toggles the switch and calls onChange", async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<ToggleSwitch textOff="Off" textOn="On" onChange={handle} />)

    const sw = screen.getByRole("switch", {
      name: "Switch between Off and On",
    })

    await user.click(sw)

    expect(sw).toHaveAttribute("aria-checked", "true")
    expect(handle).toHaveBeenCalledTimes(1)
    expect(handle).toHaveBeenCalledWith(true)
  })

  it("space key toggles the switch", async () => {
    const user = userEvent.setup()
    render(<ToggleSwitch textOff="No" textOn="Yes" />)

    const sw = screen.getByRole("switch", {
      name: "Switch between No and Yes",
    })

    sw.focus()
    expect(document.activeElement).toBe(sw)

    await user.keyboard(" ")

    expect(sw).toHaveAttribute("aria-checked", "true")
  })
})
