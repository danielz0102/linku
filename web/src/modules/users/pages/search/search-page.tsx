import { SearchBox } from "./search-box"

export default function SearchPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="title">Search Users</h1>
        <p className="text-muted">Find people by their name or username.</p>
      </header>

      <section className="space-y-4">
        <SearchBox />
      </section>
    </main>
  )
}
