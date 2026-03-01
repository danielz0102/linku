import { useUser } from "~/auth/context/auth-context"
import { UpdateUserForm } from "./components/update-user-form/update-user-form"

export default function UpdateProfile() {
  const { username, email, firstName, lastName, bio } = useUser()

  return (
    <main className="space-y-4 p-4 md:max-w-2xl">
      <h1 className="text-center text-2xl font-bold">Update Profile</h1>

      <UpdateUserForm
        defaultValues={{
          username,
          email,
          firstName,
          lastName,
          bio: bio ?? undefined,
        }}
      />
    </main>
  )
}
