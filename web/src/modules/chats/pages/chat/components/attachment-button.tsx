import { IconPhoto } from "@tabler/icons-react"
import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"

import { Dialog } from "~/shared/components/dialog"

import "./attachment-button.css"
import { validateImageFile } from "../validate-image-file"

type ImageData =
  | {
      file: File
      error?: never
    }
  | {
      file?: never
      error: string
    }
  | {
      file?: never
      error?: never
    }

export function AttachmentButton({ className }: { className?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dlgRef = useRef<HTMLDialogElement>(null)
  const [imageData, setImageData] = useState<ImageData>({})

  return (
    <div className={twMerge("attachment-button", className)}>
      <label
        className="grid cursor-pointer content-center transition-transform hover:scale-115"
        aria-label="Attach an image"
      >
        <IconPhoto strokeWidth={1.5} aria-hidden />
        <input
          ref={fileInputRef}
          name="file"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0]

            if (!file) {
              setImageData({})
              return
            }

            const { isValid, error } = validateImageFile(file)

            if (!isValid) {
              setImageData({ error })
              return
            }

            setImageData({ file })
          }}
        />
      </label>

      <ErrorTooltip onAnimationEnd={() => setImageData(({ file }) => ({ file, error: undefined }))}>
        {imageData.error}
      </ErrorTooltip>

      {imageData.file && (
        <PreviewImageButton file={imageData.file} onClick={() => dlgRef.current?.showModal()} />
      )}

      {imageData.file && <ImagePreviewModal ref={dlgRef} file={imageData.file} />}
    </div>
  )
}

type ImageErrorAlertProps = React.PropsWithChildren<{
  onAnimationEnd?: () => void
}>

function ErrorTooltip({ onAnimationEnd, children }: ImageErrorAlertProps) {
  return (
    <div
      role="alert"
      className="image-error on-top min-w-[20ch] rounded bg-red-300 px-1 py-1 text-center text-sm text-red-950 md:px-2"
      data-show={Boolean(children)}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  )
}

type PreviewImageButtonProps = {
  file: File
  onClick: () => void
}

function PreviewImageButton({ file, onClick }: PreviewImageButtonProps) {
  return (
    <button
      className="on-top cursor-pointer transition-transform hover:-translate-y-1"
      type="button"
      onClick={onClick}
      aria-label="Open image preview"
    >
      <img src={URL.createObjectURL(file)} alt="" className="max-h-32 rounded object-contain" />
    </button>
  )
}

type ImagePreviewModalProps = {
  ref: React.RefObject<HTMLDialogElement | null>
  file: File
}

function ImagePreviewModal({ file, ref }: ImagePreviewModalProps) {
  return createPortal(
    <Dialog ref={ref}>
      <img
        src={URL.createObjectURL(file)}
        alt="Preview"
        className="max-h-[80dvh] max-w-[90vw] rounded object-contain"
      />
    </Dialog>,
    document.body
  )
}
