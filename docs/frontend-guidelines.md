# Frontend Guidelines

## Accessibility

- Ensure all interactive elements whose content changes dynamically are properly announced to canvas readers. Use ARIA attributes like `role="status"` and `role="alert"`.
- Do not overuse aria attributes. Prefer native HTML attributes and elements.

## Testing

- Prefer `toBeVisible()` over `toBeInTheDocument()` if the element must be visible in the viewport.
- Prefer DOM matchers over directly access to properties or querying the DOM.

```ts
// Good
expect(toggle).toHaveAccessibleName(/show password/i)
// Bad
expect(getByRole("button", { name: /show password/i })).toBeVisible()
```

- Do not test for specific CSS classes in component tests. Focus on behavior and accessibility instead.
- Do not test if SVG icons are in the document. Test the accessible name that should be present when the icon is shown.

```ts
expect(getByRole("img", { name: /search icon/i })).toBeVisible()
```

- Use `describe` blocks just to group related tests, not for every single component. Prefer using `test` directly for simple components to avoid unnecessary nesting.