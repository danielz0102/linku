import { IconPhoto } from "@tabler/icons-react"
import { useRef } from "react"
import { createPortal } from "react-dom"
import type { UseFormRegisterReturn } from "react-hook-form"

import { Dialog } from "~/shared/components/dialog"

import "./attachment-button.css"

type AttachmentButtonProps = React.PropsWithChildren<{
  className?: string
}> &
  UseFormRegisterReturn

export function AttachmentButton({ className, children, ...rest }: AttachmentButtonProps) {
  return (
    <div className={`attachment-button ${className}`}>
      <label className="group grid cursor-pointer content-center" aria-label="Attach an image">
        <IconPhoto
          strokeWidth={1.5}
          aria-hidden
          className="transition-transform group-hover:scale-115"
        />
        <input type="file" accept="image/*" className="sr-only" {...rest} />
      </label>

      {children}
    </div>
  )
}

AttachmentButton.ErrorTooltip = ({ children }: React.PropsWithChildren) => {
  return (
    <div
      role="alert"
      className="image-error on-top min-w-[20ch] rounded bg-red-300 px-1 py-1 text-center text-sm text-red-950 md:px-2"
      data-show={Boolean(children)}
    >
      {children}
    </div>
  )
}

type PreviewImageButtonProps = {
  file?: File
}

AttachmentButton.PreviewImageButton = ({ file }: PreviewImageButtonProps) => {
  const dlgRef = useRef<HTMLDialogElement>(null)

  return (
    <div role="status">
      {file && (
        <>
          <button
            className="on-top cursor-pointer transition-transform hover:-translate-y-1"
            type="button"
            onClick={() => dlgRef.current?.showModal()}
            aria-label="Open image preview"
          >
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="max-h-32 rounded object-contain"
            />
          </button>
          {createPortal(
            <Dialog ref={dlgRef}>
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="max-h-[80dvh] max-w-[90vw] rounded object-contain"
              />
            </Dialog>,
            document.body
          )}
        </>
      )}
    </div>
  )
}
