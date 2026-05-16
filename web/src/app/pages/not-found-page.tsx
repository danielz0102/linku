import { Link } from "react-router"

export default function NotFoundPage() {
  return (
    <main className="flex size-full flex-col items-center justify-center text-center">
      <title>Linku - Page Not Found</title>
      <h1 className="title mb-1">Page not found</h1>
      <p className="text-muted max-w-md text-balance">
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Link to="/" className="button mt-4">
        Go to Home
      </Link>
    </main>
  )
}
