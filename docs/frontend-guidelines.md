# Frontend Guidelines

## Accessibility

* Ensure all interactive elements whose content changes dynamically are properly announced to screen readers. Use ARIA attributes like `aria-live` and `aria-atomic`.
* Do not overuse aria attributes. Prefer native HTML attributes and elements.

## Testing

* Prefer `toBeVisible()` over `toBeInTheDocument()` if the element must be visible in the viewport.
* Use `toHaveAttribute()` to verify element attributes instead of directly accessing properties.
* Prefer use jest-matchers over previous gotten elements in assertions, instead of re-querying the DOM.

```ts
// Good
expect(toggle).toHaveAccessibleName("Hide password")
// Bad
expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument()
```

* Do not test for specific CSS classes in component tests. Focus on behavior and accessibility instead.
* Do not test if SVG icon is in the document. Test the accessible name that should be present when the icon is shown.

```ts
// Good
expect(screen.getByRole("img", { name: /search icon/i })).toBeVisible()
// Bad
expect(screen.getByTestId("search-icon")).toBeInTheDocument()
```

* Use `describe` blocks just to group related tests, not for every single component. Prefer using `test` directly for simple components to avoid unnecessary nesting.