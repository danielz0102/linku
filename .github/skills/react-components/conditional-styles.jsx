export function Good({ foo }) {
  return (
    <div data-foo={foo} className="rounded border bg-blue-100 p-4 data-foo:text-red-500">
      Hello World
    </div>
  )
}

export function Bad({ foo }) {
  return (
    <div
      data-foo={foo}
      className={`rounded border p-4 ${foo === "bar" ? "bg-red-100" : "bg-blue-100"}`}
    >
      Hello World
    </div>
  )
}
