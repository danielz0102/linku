interface LoginFormProps {
  onSubmit: (username: string, password: string) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get("username") as string
        const password = formData.get("password") as string
        onSubmit(username, password)
      }}
    >
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
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          className="input"
        />
      </div>
      <button type="submit" className="button mt-4 w-full">
        Login
      </button>
    </form>
  )
}
