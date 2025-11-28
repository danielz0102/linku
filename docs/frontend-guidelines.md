# Frontend Guidelines

## Accessibility

* Ensure all interactive elements whose content changes dynamically are properly announced to screen readers. Use ARIA attributes like `aria-live` and `aria-atomic`.

## Testing

* Prefer `toBeVisible()` over `toBeInTheDocument()` if the element must be visible in the viewport.
* Use `toHaveAttribute()` to verify element attributes instead of directly accessing properties.
* Prefer use jest-matchers over previous gotten elements in assertions, instead of re-querying the DOM. For example, use `expect(toggle).toHaveAccessibleName("Hide password")` instead of `expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument()`.
* Do not test for specific CSS classes in component tests. Focus on behavior and accessibility instead.