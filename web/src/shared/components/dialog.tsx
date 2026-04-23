import { IconX } from "@tabler/icons-react"

type DialogProps = React.PropsWithChildren<{
  ref: React.RefObject<HTMLDialogElement | null>
}>

export function Dialog({ ref, children }: DialogProps) {
  return (
    <dialog
      ref={ref}
      className="bg-surface absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl px-12 py-6"
    >
      <div className="size-full space-y-4">
        <button
          className="absolute top-4 right-4 cursor-pointer transition-transform duration-300 hover:rotate-90"
          onClick={() => ref.current?.close()}
          aria-label="Close"
        >
          <IconX size={16} aria-hidden />
        </button>
        {children}
      </div>
    </dialog>
  )
}
