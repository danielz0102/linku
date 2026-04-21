import type { FallbackProps } from "react-error-boundary"

export default function UnexpectedErrorPage(_: FallbackProps) {
  return (
    <main className="flex size-full flex-col items-center justify-center p-6 text-center">
      <h1 className="title mb-1">Something went wrong</h1>
      <p className="text-muted max-w-md text-balance">
        We hit an unexpected error. Please go back to the home page.
      </p>

      <a href="/" className="button mt-4">
        Go to Home
      </a>
    </main>
  )
}
