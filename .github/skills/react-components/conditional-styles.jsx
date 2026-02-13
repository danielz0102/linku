export function Good({ foo }) {
  return (
    <div
      data-foo={foo}
      className="p-4 border rounded bg-blue-100 data-foo:text-red-500"
    >
      Hello World
    </div>
  );
}

export function Bad({ foo }) {
  return (
    <div
      data-foo={foo}
      className={`p-4 border rounded ${foo === "bar" ? "bg-red-100" : "bg-blue-100"}`}
    >
      Hello World
    </div>
  );
}
