interface SignUpFormProps {
  onSubmit: (data: {
    firstName: string
    lastName: string
    username: string
    password: string
    confirmPassword: string
  }) => void
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const firstName = formData.get("first-name") as string
        const lastName = formData.get("last-name") as string
        const username = formData.get("username") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirm-password") as string
        onSubmit({ firstName, lastName, username, password, confirmPassword })
      }}
    >
      <div className="form-field mb-2">
        <label htmlFor="first-name">First name</label>
        <input id="first-name" type="text" name="first-name" placeholder="John" className="input" />
      </div>
      <div className="form-field mb-2">
        <label htmlFor="last-name">Last name</label>
        <input id="last-name" type="text" name="last-name" placeholder="Doe" className="input" />
      </div>
      <div className="form-field mb-2">
        <label htmlFor="email">Username</label>
        <input
          id="email"
          type="username"
          name="username"
          placeholder="john_doe"
          className="input"
        />
      </div>
      <div className="form-field mb-2">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          className="input"
        />
      </div>
      <div className="form-field">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          name="confirm-password"
          placeholder="••••••••"
          className="input"
        />
      </div>
      <button type="submit" className="button mt-4 w-full">
        Sign up
      </button>
    </form>
  )
}
