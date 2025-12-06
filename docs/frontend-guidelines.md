# Frontend Guidelines

## Accessibility

* Ensure all interactive elements whose content changes dynamically are properly announced to canvas readers. Use ARIA attributes like `role="status"` and `role="alert"`.
* Do not overuse aria attributes. Prefer native HTML attributes and elements.

## Testing

* For component tests, use stories with `play` functions. For React custom hooks, use React Testing Library. For pure TypeScript modules, use Vitest.
* Prefer `toBeVisible()` over `toBeInTheDocument()` if the element must be visible in the viewport.
* Prefer DOM matchers over directly access to properties or querying the DOM.

```ts
// Good
expect(link).toHaveAttribute("href", "/home")
// Bad
expect(link.href).toBe("http://localhost/home")

// Good
expect(toggle).toHaveAccessibleName(/show password/i)
// Bad
expect(canvas.getByRole("button", { name: /show password/i })).toBeVisible()
```

* Do not test for specific CSS classes in component tests. Focus on behavior and accessibility instead.
* Do not test if SVG icon is in the document. Test the accessible name that should be present when the icon is shown.

```ts
// Good
expect(canvas.getByRole("img", { name: /search icon/i })).toBeVisible()
// Bad
expect(canvas.getByTestId("search-icon")).toBeInTheDocument()
```

* Use `describe` blocks just to group related tests, not for every single component. Prefer using `test` directly for simple components to avoid unnecessary nesting.