import { useAuth, useUser } from "~/auth/context/auth-context"
import { UpdateUserForm } from "./components/update-user-form"
import { updateUser } from "./services/update-user"

export default function UpdateProfile() {
  const { refresh } = useAuth()
  const { username, email, firstName, lastName, bio } = useUser()

  return (
    <main className="flex flex-col gap-4 p-4 md:items-center">
      <h1 className="text-center text-2xl font-bold">Update Profile</h1>

      <UpdateUserForm
        defaultValues={{
          username,
          email,
          firstName,
          lastName,
          bio: bio ?? undefined,
        }}
        onSubmit={async (data) => {
          await updateUser(data)
          await refresh()
        }}
        className="md:min-w-lg"
      />
    </main>
  )
}
