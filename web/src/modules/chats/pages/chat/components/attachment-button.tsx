import { IconPhoto } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
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

type ErrorTooltipProps = {
  trigger: symbol
  children?: string
}

AttachmentButton.ErrorTooltip = ({ trigger, children }: ErrorTooltipProps) => {
  const [isVisible, setIsVisible] = useState(Boolean(children))

  useEffect(() => {
    setIsVisible(Boolean(children))
  }, [trigger, children])

  return (
    <div
      role="alert"
      className="image-error on-top min-w-[20ch] rounded bg-red-300 px-1 py-1 text-center text-sm text-red-950 md:px-2"
      data-show={isVisible}
      onAnimationEnd={() => setIsVisible(false)}
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
  const url = file ? URL.createObjectURL(file) : undefined

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return (
    <div role="status">
      {url && (
        <>
          <button
            className="on-top cursor-pointer transition-transform hover:-translate-y-1"
            type="button"
            onClick={() => dlgRef.current?.showModal()}
            aria-label="Open image preview"
          >
            <img src={url} alt="" className="max-h-32 rounded object-contain" />
          </button>
          <Dialog ref={dlgRef}>
            <img
              src={url}
              alt="Preview"
              className="max-h-[80dvh] max-w-[90vw] rounded object-contain"
            />
          </Dialog>
        </>
      )}
    </div>
  )
}
