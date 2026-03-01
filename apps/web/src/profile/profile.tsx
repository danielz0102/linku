import { useUser } from "~/auth/context/auth-context"
import { UpdateUserForm } from "./components/update-user-form/update-user-form"

export default function Profile() {
  const { username, email, firstName, lastName, bio, profilePicUrl } = useUser()

  return (
    <main className="flex size-full flex-col items-center justify-center gap-4 text-center">
      <img
        src={profilePicUrl || "/default-pp.jpg"}
        alt="Profile picture"
        className="size-32 rounded-full"
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {firstName} {lastName}
        </h1>
        <p className="text-sm text-neutral-300">@{username}</p>
      </div>

      {bio ? <p>{bio}</p> : <p className="italic">No bio available.</p>}

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
