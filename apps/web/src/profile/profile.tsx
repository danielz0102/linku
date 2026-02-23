import { useUser } from "~/auth/context/auth-context"

export default function Profile() {
  const { username, firstName, lastName, bio, profilePicUrl } = useUser()

  return (
    <main className="flex size-full flex-col items-center justify-center gap-4 text-center">
      <img
        src={
          profilePicUrl ||
          "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_user_personalization&w=740&q=80"
        }
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
    </main>
  )
}
