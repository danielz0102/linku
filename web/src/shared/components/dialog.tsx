import { IconX } from "@tabler/icons-react"
import { createPortal } from "react-dom"

type DialogProps = React.PropsWithChildren<{
  ref: React.RefObject<HTMLDialogElement | null>
  /**
   * If true, the dialog will be rendered in place.
   * If false, the dialog will be rendered in the body element.
   */
  inline?: boolean
}>

export function Dialog({ ref, inline = false, children }: DialogProps) {
  const jsx = (
    <dialog
      ref={ref}
      className="bg-surface absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl px-12 py-6"
    >
      <div className="size-full space-y-4">
        <button
          className="absolute top-4 right-4 cursor-pointer transition-transform duration-300 hover:rotate-90"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          type="button"
        >
          <IconX size={16} aria-hidden />
        </button>
        {children}
      </div>
    </dialog>
  )

  if (inline) return jsx

  return createPortal(jsx, document.body)
}
