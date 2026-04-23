import { IconPhoto } from "@tabler/icons-react"
import { twMerge } from "tailwind-merge"

type AttachmentButtonProps = {
  className?: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AttachmentButton({ className, onFileChange }: AttachmentButtonProps) {

  return (
    <div className={twMerge("attachment-button", className)}>
      <label
        className="grid cursor-pointer content-center transition-transform hover:scale-115"
        aria-label="Attach an image"
      >
        <IconPhoto strokeWidth={1.5} aria-hidden />
        <input
          name="file"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onFileChange}
        />
      </label>
    </div>
  )
}
