import type { PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

interface ToggleSwitchProps {
  textOn: string
  textOff: string
  onChange?: (checked: boolean) => void
}

export default function ToggleSwitch({
  textOn,
  textOff,
  onChange,
}: ToggleSwitchProps) {
  return (
    <label className="relative flex w-full cursor-pointer items-center overflow-hidden rounded-full bg-neutral-800">
      <input
        type="checkbox"
        className="peer sr-only"
        onChange={(e) => {
          onChange?.(e.target.checked)
        }}
      />
      <Slider />
      <OptionText className="text-white peer-checked:text-neutral-300">
        {textOn}
      </OptionText>
      <OptionText className="text-neutral-300 peer-checked:text-white">
        {textOff}
      </OptionText>
    </label>
  )
}

function Slider() {
  return (
    <div className="group absolute top-0 left-0 size-full p-1">
      <div className="h-full w-1/2 rounded-full bg-indigo-600 transition-transform group-peer-checked:translate-x-full"></div>
    </div>
  )
}

interface OptionTextProps extends PropsWithChildren {
  className?: string
}

function OptionText({ children, className }: OptionTextProps) {
  return (
    <span
      className={twMerge(
        "z-10 flex-1 px-6 py-3 text-center select-none",
        className
      )}
    >
      {children}
    </span>
  )
}
