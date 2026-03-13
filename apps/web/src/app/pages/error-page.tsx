type ErrorPageProps = {
  status?: number
  message?: string
}

export function ErrorPage({ status = 500, message = "Something went wrong." }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">{status}</h1>
      <p className="text-lg text-gray-400">{message}</p>
      <a href="/" className="link">
        Go home
      </a>
    </main>
  )
}
