# Base Guidelines

## Development Environment

- You can run `pnpm dev` at the root of the repository to start storybook and the frontend application

## Code Style

- Do not include unnecessary comments that explain obvious code behavior
- Don't use `any` type; prefer specific types or generics
- Don't use assertions like `as HTMLInputElement` unless absolutely necessary
- Prefer `Boolean(value)` over `!!value` for clarity
- Prefer `Number(value)` over `+value` for clarity

## Import Conventions

- Use the `~/` path alias for cross-directory imports (e.g., `import cn from "~/utils/cn"`)
- Relative imports (e.g., `./index`) are acceptable for same-directory imports
- Avoid deep relative paths like `../../..`

## Testing

- Prefer `test` blocks over nested `describe` when tests are simple and don't require grouping
- Use `it` for individual test cases within `describe` blocks
