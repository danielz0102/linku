---
name: web-testing
description: Guide for testing React applications using React Testing Library and Vitest. Use this when asked to write tests in the `web` package.
---

# Web Testing

This guide provide the conventions for writing tests for React components in this project. We use React Testing Library and Vitest for our testing framework.

## When to use this skill

Use this skill when you're asked to write tests in the `web` package.

## Running tests

To run tests, use `pnpm test`.

## Best practices

- Test the component's behavior and user interactions, not implementation details.
- Prefer `toBeVisible` over `toBeInTheDocument` for elements that should be visible to the user.
- Avoid mock Tanstack Query hooks. Instead, mock the underlying API services (they are usually in `services/` folders).
