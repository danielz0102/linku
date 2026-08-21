import { Link } from "react-router"

export default function Landing() {
  return (
    <main className="flex size-full flex-col items-center gap-4 p-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-bold">Linku</h1>
        <p className="text-muted">Chat with your friends</p>
      </div>

      <Link to="/log-in" className="button">
        Login
      </Link>
    </main>
  )
}
